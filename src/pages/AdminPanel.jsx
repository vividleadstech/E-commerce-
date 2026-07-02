import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection, addDoc, deleteDoc, doc, updateDoc,
  onSnapshot, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "../Config";
import { useAuth } from "../context/AuthContext";
import admins from "../admin.json";
import { toast } from "react-toastify";
import {
  MdDashboard, MdShoppingCart, MdInventory,
  MdSettings, MdAdd, MdDelete, MdEdit, MdLogout,
  MdClose, MdSearch, MdPeople, MdAttachMoney, MdTrendingUp,
} from "react-icons/md";

const CATEGORIES = [
  "iPhones","Smartphones","Foldable Phones","Tablets","Monitors",
  "Smartwatches","Wearables","Gaming","Consoles","Audio",
  "Headphones","Accessories","Mice","Internet","Satellite Internet",
  "Cameras","Drones",
];
const GRIDS = [
  { value: 1,            label: "Grid 1 — Best Offers (Home)" },
  { value: 2,            label: "Grid 2 — Latest Picks (Home)" },
  { value: "allProducts", label: "All Products page only" },
];
const EMPTY_FORM = {
  title:"", category:"", type:"", description:"",
  price:"", originalPrice:"", badge1:"", badge2:"",
  rating:5, inStock:true, sku:"", image:"",
  colors:[], buttonType:"cart", grid:1,
};
const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon: MdDashboard },
  { id:"orders",    label:"Orders",    icon: MdShoppingCart },
  { id:"products",  label:"Products",  icon: MdInventory  },
  { id:"settings",  label:"Settings",  icon: MdSettings  },
];

function Badge({ text }) {
  if (!text) return null;
  const colors = { HOT: "bg-red-500", NEW: "bg-green-600" };
  const bg = text.startsWith("-") ? "bg-blue-600" : colors[text] || "bg-[#3a3a3c]";
  return <span className={`${bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>{text}</span>;
}

// ── Compress image AND convert to base64 — no Storage/Blaze needed ────────
// Firestore has a 1MB-per-document hard limit, so we compress aggressively:
// max 600px on the longest side, 60% JPEG quality. This typically produces
// a base64 string in the 30-90KB range, safely within Firestore's limit
// even with all the other product fields included.
function compressImageToBase64(file, maxSize = 600, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Compression timeout")), 10000);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => { img.src = e.target.result; };
    reader.onerror = () => { clearTimeout(timeout); reject(new Error("Failed to read file")); };
    reader.readAsDataURL(file);

    img.onload = () => {
      clearTimeout(timeout);
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);

      // toDataURL gives us the base64 string directly — no Blob, no upload
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(dataUrl);
    };
    img.onerror = () => { clearTimeout(timeout); reject(new Error("Failed to load image")); };
  });
}

// ── Product Modal (Add/Edit) ───────────────────────────────────────────────
function ProductModal({ initial, onClose, onSave, saving }) {
  const [form, setForm]       = useState(initial || EMPTY_FORM);
  const [colorInput, setCI]   = useState("");
  const [preview, setPreview] = useState(initial?.image || "");
  const [compressing, setCompressing] = useState(false);

  const u = (f) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [f]: v }));
  };

  const addColor = () => {
    const h = colorInput.trim();
    if (!h || form.colors.includes(h)) return;
    setForm((p) => ({ ...p, colors: [...p.colors, h] }));
    setCI("");
  };

  const inp = "w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-[#f5f5f7] outline-none placeholder-[#3a3a3c] focus:border-[#d4a843]/50 transition-colors";
  const lbl = "block text-[11px] font-medium tracking-[0.1em] uppercase text-[#48484a] mb-1.5";

  // Image now resolves directly into form.image as a base64 string —
  // no separate "imageFile" state and no upload step needed at save time.
  const handleImageSelect = async (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setCompressing(true);
    try {
      const base64 = await compressImageToBase64(f);
      setPreview(base64);
      setForm((p) => ({ ...p, image: base64 }));
    } catch (err) {
      console.error("Compression failed:", err);
      toast.error("Failed to process image. Try a smaller photo.");
    } finally {
      setCompressing(false);
    }
  };

  const isFormValid = form.title && form.price && form.category;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl w-full max-w-[780px] max-h-[90vh] overflow-y-auto shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
        style={{ animation: "slideUp .22s cubic-bezier(.22,.68,0,1.2)" }}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="text-lg font-medium text-[#f5f5f7]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {initial ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#636366] hover:text-[#f5f5f7] hover:bg-white/[0.1] transition-colors cursor-pointer">
            <MdClose size={14} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div><label className={lbl}>Title *</label>
              <input className={inp} placeholder="e.g. iPhone 17 Pro" value={form.title} onChange={u("title")} required /></div>
            <div><label className={lbl}>Category *</label>
              <select className={inp} value={form.category} onChange={u("category")} required>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <div><label className={lbl}>Type</label>
              <input className={inp} placeholder="e.g. Smartphones" value={form.type} onChange={u("type")} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Price *</label>
                <input className={inp} placeholder="₦480,000" value={form.price} onChange={u("price")} /></div>
              <div><label className={lbl}>Original Price</label>
                <input className={inp} placeholder="₦600,000" value={form.originalPrice} onChange={u("originalPrice")} /></div>
            </div>
            <div><label className={lbl}>SKU</label>
              <input className={inp} placeholder="IP17PRO-256" value={form.sku} onChange={u("sku")} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Badge 1</label>
                <select className={inp} value={form.badge1} onChange={u("badge1")}>
                  <option value="">None</option>
                  {["HOT","NEW","-5%","-10%","-15%","-20%"].map((b) => <option key={b} value={b}>{b}</option>)}
                </select></div>
              <div><label className={lbl}>Badge 2</label>
                <select className={inp} value={form.badge2} onChange={u("badge2")}>
                  <option value="">None</option>
                  {["HOT","NEW"].map((b) => <option key={b} value={b}>{b}</option>)}
                </select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Rating</label>
                <select className={inp} value={form.rating} onChange={u("rating")}>
                  {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ★</option>)}
                </select></div>
              <div><label className={lbl}>Button</label>
                <select className={inp} value={form.buttonType} onChange={u("buttonType")}>
                  <option value="cart">Add To Cart</option>
                  <option value="select">Select Options</option>
                </select></div>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <input type="checkbox" id="inStock" checked={form.inStock} onChange={u("inStock")} className="w-4 h-4 accent-[#d4a843] cursor-pointer" />
              <label htmlFor="inStock" className="text-sm text-[#8e8e93] cursor-pointer">In Stock</label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={lbl}>Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 bg-white/[0.03] border-2 border-dashed border-white/[0.1] rounded-xl cursor-pointer hover:border-[#d4a843]/40 hover:bg-white/[0.05] transition-colors overflow-hidden mb-2">
                {compressing
                  ? <div className="flex flex-col items-center gap-1.5 text-[#d4a843]"><span className="text-xs">Processing image…</span></div>
                  : preview
                  ? <img src={preview} alt="preview" className="max-h-full max-w-full object-contain" />
                  : <div className="flex flex-col items-center gap-1.5 text-[#3a3a3c]"><MdAdd size={24} /><span className="text-xs">Click to upload</span></div>}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </label>
              <p className="text-[10px] text-[#3a3a3c] mb-2">
                Images are compressed and stored directly — no upload service needed.
              </p>
              <input className={inp} placeholder="Or paste image URL / asset path"
                value={form.image?.startsWith("data:") ? "" : form.image} onChange={u("image")}
                onBlur={(e) => e.target.value && setPreview(e.target.value)} />
            </div>
            <div><label className={lbl}>Description</label>
              <textarea className={`${inp} resize-none`} rows={3}
                placeholder="Product description…" value={form.description} onChange={u("description")} /></div>
            <div><label className={lbl}>Show On</label>
              <select className={inp} value={form.grid} onChange={u("grid")}>
                {GRIDS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select></div>
            <div>
              <label className={lbl}>Color Swatches</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.colors.map((c) => (
                  <div key={c} className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full px-2.5 py-1">
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: c }} />
                    <span className="text-[11px] text-[#8e8e93]">{c}</span>
                    <button type="button" onClick={() => setForm((p) => ({ ...p, colors: p.colors.filter((x) => x !== c) }))}
                      className="text-[#3a3a3c] hover:text-red-400 bg-transparent border-none cursor-pointer text-xs leading-none">×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="color" value={colorInput || "#ffffff"} onChange={(e) => setCI(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent p-0.5" />
                <input className={`${inp} flex-1`} placeholder="#1a1a1a" value={colorInput}
                  onChange={(e) => setCI(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())} />
                <button type="button" onClick={addColor}
                  className="px-4 rounded-xl text-sm font-semibold text-[#0a0a0c] border-none cursor-pointer flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>Add</button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              disabled={saving || compressing || !isFormValid}
              onClick={() => onSave(form)}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-[#0a0a0c] border-none cursor-pointer transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>
              {saving ? "Saving…" : initial ? "Update Product" : "Save Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Section ───────────────────────────────────────────────────────
function DashboardSection() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubUsers = onSnapshot(query(collection(db, "users"), orderBy("joinedAt", "desc")), (snap) => {
      setStats((s) => ({ ...s, users: snap.size }));
      setRecentUsers(snap.docs.slice(0, 5).map((d) => ({ ...d.data(), id: d.id })));
      setLoading(false);
    }, () => setLoading(false));

    const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
      setStats((s) => ({ ...s, products: snap.size }));
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      const revenue = snap.docs.reduce((sum, d) => sum + (d.data().total || 0), 0);
      setStats((s) => ({ ...s, orders: snap.size, revenue }));
    });

    return () => { unsubUsers(); unsubProducts(); unsubOrders(); };
  }, []);

  const cards = [
    { label: "Total Users",    value: stats.users,    icon: MdPeople,     color: "#d4a843" },
    { label: "Total Products", value: stats.products, icon: MdInventory,  color: "#43a047" },
    { label: "Total Orders",   value: stats.orders,    icon: MdShoppingCart, color: "#1565c0" },
    { label: "Revenue",        value: `₦${stats.revenue.toLocaleString()}`, icon: MdAttachMoney, color: "#e53935" },
  ];

  if (loading) {
    return <div className="text-center py-20 text-[#3a3a3c]">Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-medium text-[#f5f5f7] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Dashboard</h2>
      <p className="text-[13px] text-[#48484a] mb-6">Overview of your store performance</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#0e0e10] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}1a` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <MdTrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[#f5f5f7]">{value}</p>
            <p className="text-[12px] text-[#636366] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0e0e10] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-medium text-[#f5f5f7]">Recent Signups</h3>
        </div>
        {recentUsers.length === 0 ? (
          <div className="py-10 text-center text-[#3a3a3c] text-sm">No users yet</div>
        ) : (
          recentUsers.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04] last:border-0">
              {u.photoURL
                ? <img src={u.photoURL} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover border border-[#d4a843]/20" />
                : <span className="w-9 h-9 rounded-full flex items-center justify-center text-[#0a0a0c] text-xs font-bold"
                    style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>
                    {u.displayName?.[0] || "U"}
                  </span>}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-[#f5f5f7] truncate">{u.displayName || "User"}</p>
                <p className="text-[11px] text-[#48484a] truncate">{u.email}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Orders Section ───────────────────────────────────────────────────────────
function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snap) => {
      setOrders(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  const statusColor = (status) => ({
    Pending:   "text-yellow-400 bg-yellow-400/10",
    Completed: "text-green-400 bg-green-400/10",
    Dispatch:  "text-blue-400 bg-blue-400/10",
    Cancelled: "text-red-400 bg-red-400/10",
  }[status] || "text-[#636366] bg-white/[0.05]");

  if (loading) {
    return <div className="text-center py-20 text-[#3a3a3c]">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-medium text-[#f5f5f7] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Orders</h2>
      <p className="text-[13px] text-[#48484a] mb-6">{orders.length} orders found</p>

      <div className="bg-[#0e0e10] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-white/[0.06] text-[11px] tracking-[0.1em] uppercase text-[#3a3a3c] font-medium">
          <span>Order ID</span><span>Customer</span><span>Date</span><span>Total</span><span>Status</span>
        </div>
        {orders.length === 0 ? (
          <div className="py-16 text-center text-[#3a3a3c] text-sm">No orders yet</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 px-5 py-4 border-b border-white/[0.04] items-center hover:bg-white/[0.02] transition-colors">
              <span className="text-[13px] text-[#8e8e93]">#{o.id?.slice(0, 6) || "N/A"}</span>
              <span className="text-[13px] text-[#f5f5f7] truncate">{o.customerName || o.email || "Guest"}</span>
              <span className="text-[12px] text-[#636366]">{o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : "—"}</span>
              <span className="text-[13px] font-semibold" style={{ color: "#d4a843" }}>₦{o.total?.toLocaleString() || "0"}</span>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full w-fit ${statusColor(o.status)}`}>{o.status || "Pending"}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Products Section ───────────────────────────────────────────────────────
function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [search, setSearch]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("title"));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  // No more file upload step — form.image already contains either a
  // base64 data URL (from compression) or a plain pasted URL string.
  // We just write it straight to Firestore.
  const handleSave = async (form) => {
    if (!form.title || !form.price || !form.category) {
      toast.error("Please fill in Title, Category and Price");
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...form,
        image: form.image || "",
        rating: Number(form.rating),
        grid: isNaN(Number(form.grid)) ? form.grid : Number(form.grid),
        updatedAt: serverTimestamp(),
      };

      if (editing) {
        await updateDoc(doc(db, "products", editing.firestoreId), data);
        toast.success("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
        toast.success("Product added successfully!");
      }

      setShowModal(false);
      setEditing(null);
    } catch (err) {
      console.error("Save error:", err);
      // Firestore throws this specific error if the document exceeds 1MB —
      // almost always means the image wasn't compressed enough.
      if (err.message?.includes("longer than")) {
        toast.error("Image is too large even after compression. Try a smaller photo.");
      } else {
        toast.error("Save failed: " + err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (firestoreId, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, "products", firestoreId));
      toast.success("Product deleted.");
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-20 text-[#3a3a3c]">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-medium text-[#f5f5f7]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Products</h2>
          <p className="text-[13px] text-[#48484a] mt-0.5">{products.length} products in store</p>
        </div>
        <button onClick={() => { setEditing(null); setSaving(false); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#0a0a0c] border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
          style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>
          <MdAdd size={16} /> Add Product
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 h-11 mb-5 max-w-[360px]">
        <MdSearch size={16} className="text-[#3a3a3c] flex-shrink-0" />
        <input type="text" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm text-[#d1d1d6] placeholder-[#3a3a3c]" />
      </div>

      <div className="bg-[#0e0e10] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-white/[0.06] text-[11px] tracking-[0.1em] uppercase text-[#3a3a3c] font-medium">
          <span>Product</span><span>Category</span><span>Price</span><span>Status</span><span>Actions</span>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#3a3a3c] text-sm">No products found</div>
        ) : (
          filtered.map((p) => (
            <div key={p.firestoreId} className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4 border-b border-white/[0.04] items-center hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-[#3a3a3c] text-[9px]">No img</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#f5f5f7] truncate">{p.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">{p.badge1 && <Badge text={p.badge1} />}{p.badge2 && <Badge text={p.badge2} />}</div>
                </div>
              </div>
              <span className="text-[13px] text-[#636366] truncate">{p.category}</span>
              <div><span className="text-[13px] font-semibold" style={{ color: "#d4a843" }}>{p.price}</span>
                {p.originalPrice && <span className="text-[11px] text-[#3a3a3c] line-through ml-1.5">{p.originalPrice}</span>}</div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.inStock ? "bg-green-500" : "bg-red-500"}`} />
                <span className={`text-[12px] font-medium ${p.inStock ? "text-green-400" : "text-red-400"}`}>{p.inStock ? "In Stock" : "Out of Stock"}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditing(p); setSaving(false); setShowModal(true); }}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#636366] hover:text-[#d4a843] hover:border-[#d4a843]/30 transition-colors cursor-pointer">
                  <MdEdit size={14} /></button>
                <button onClick={() => handleDelete(p.firestoreId, p.title)}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#636366] hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer">
                  <MdDelete size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <ProductModal
          initial={editing}
          onClose={() => { setShowModal(false); setEditing(null); setSaving(false); }}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}

// ── Settings Section ───────────────────────────────────────────────────────
function SettingsSection() {
  const { user } = useAuth();
  const [name, setName]   = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { updateProfile } = await import("firebase/auth");
      await updateProfile(user, { displayName: name });
      await updateDoc(doc(db, "users", user.uid), { displayName: name });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-[#f5f5f7] outline-none focus:border-[#d4a843]/50 transition-colors";
  const lbl = "block text-[11px] font-medium tracking-[0.1em] uppercase text-[#48484a] mb-2";

  return (
    <div>
      <h2 className="text-2xl font-medium text-[#f5f5f7] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Settings</h2>
      <p className="text-[13px] text-[#48484a] mb-6">Manage your admin profile</p>

      <div className="bg-[#0e0e10] border border-white/[0.07] rounded-2xl p-6 max-w-[480px]">
        <div className="flex items-center gap-4 mb-6">
          {user?.photoURL
            ? <img src={user.photoURL} referrerPolicy="no-referrer" className="w-16 h-16 rounded-full object-cover border-2 border-[#d4a843]/30" />
            : <span className="w-16 h-16 rounded-full flex items-center justify-center text-[#0a0a0c] text-xl font-bold"
                style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>
                {user?.displayName?.[0] || "A"}
              </span>}
          <div>
            <p className="text-sm font-medium text-[#f5f5f7]">{user?.displayName || "Admin"}</p>
            <p className="text-[12px] text-[#48484a]">{user?.email}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className={lbl}>Display Name</label>
          <input className={inp} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-5">
          <label className={lbl}>Email</label>
          <input className={inp} value={user?.email || ""} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 rounded-xl text-sm font-bold text-[#0a0a0c] border-none cursor-pointer transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ── Main Admin Panel ───────────────────────────────────────────────────────
export default function AdminPanel() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    if (user && !admins.adminUIDs.includes(user.uid)) {
      toast.error("Access denied. Admin only.");
      navigate("/");
    }
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = async () => { await logout(); navigate("/"); };

  const renderSection = () => {
    switch (active) {
      case "dashboard": return <DashboardSection />;
      case "orders":    return <OrdersSection />;
      case "products":  return <ProductsSection />;
      case "settings":  return <SettingsSection />;
      default:          return <DashboardSection />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex font-sans">
      <aside className="w-[220px] flex-shrink-0 bg-[#111113] border-r border-white/[0.07] flex flex-col">
        <div className="px-6 py-6 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)", boxShadow: "0 4px 12px rgba(212,168,67,0.25)" }}>
              <svg width="16" height="16" fill="#0a0a0c" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", fontWeight: 500, color: "#f5f5f7" }}>
              Vivid <em className="not-italic font-light" style={{ color: "#d4a843" }}>Admin</em>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] border-none cursor-pointer text-left transition-all duration-150 ${
                active === id ? "text-[#0a0a0c] font-semibold shadow-lg" : "text-[#636366] bg-transparent hover:bg-white/[0.05] hover:text-[#f5f5f7]"
              }`}
              style={active === id ? { background: "linear-gradient(135deg,#d4a843,#b8862e)" } : {}}>
              <Icon size={17} />{label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/[0.07] space-y-2">
          <div className="flex items-center gap-2.5 px-3 py-2">
            {user?.photoURL
              ? <img src={user.photoURL} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover border border-[#d4a843]/30" />
              : <span className="w-8 h-8 rounded-full flex items-center justify-center text-[#0a0a0c] text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>{user?.displayName?.[0] || "A"}</span>}
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[#f5f5f7] truncate">{user?.displayName || "Admin"}</p>
              <p className="text-[10px] text-[#3a3a3c] truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] text-red-400 bg-transparent border-none cursor-pointer hover:bg-red-500/[0.08] transition-colors">
            <MdLogout size={16} /> Log Out
          </button>
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[12px] text-[#3a3a3c] bg-transparent border-none cursor-pointer hover:text-[#636366] transition-colors">
            ← Back to store
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.07] bg-[#0d0d0f] sticky top-0 z-10">
          <h1 className="text-[15px] font-medium text-[#f5f5f7] capitalize">{active}</h1>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#48484a]">Admin Panel</span>
            <div className="w-px h-4 bg-white/[0.07]" />
            <span className="text-[12px] text-[#d4a843] font-medium">{user?.displayName?.split(" ")[0] || "Admin"}</span>
          </div>
        </div>
        <div className="px-8 py-7">{renderSection()}</div>
      </main>
    </div>
  );
}

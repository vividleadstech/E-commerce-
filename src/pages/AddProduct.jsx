import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CATEGORIES = [
  "iPhones", "Smartphones", "Foldable Phones", "Tablets", "Monitors",
  "Smartwatches", "Wearables", "Gaming", "Consoles", "Audio",
  "Headphones", "Accessories", "Mice", "Internet", "Satellite Internet", "Cameras", "Drones",
];

const GRIDS = [
  { value: 1, label: "Grid 1 — Best Offers (Home)" },
  { value: 2, label: "Grid 2 — Latest Picks (Home)" },
  { value: "allProducts", label: "All Products page only" },
];

const EMPTY = {
  title: "", category: "", type: "", description: "",
  price: "", originalPrice: "", badge1: "", badge2: "",
  rating: 5, inStock: true, sku: "", image: "",
  colors: [], buttonType: "cart", grid: 1,
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [colorInput, setColorInput] = useState("");
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm((f) => ({ ...f, image: url }));
  };

  const addColor = () => {
    const hex = colorInput.trim();
    if (!hex || form.colors.includes(hex)) return;
    setForm((f) => ({ ...f, colors: [...f.colors, hex] }));
    setColorInput("");
  };

  const removeColor = (c) =>
    setForm((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category) {
      toast.error("Please fill in Title, Category and Price.");
      return;
    }
    setSaving(true);

    const existing = JSON.parse(localStorage.getItem("localProducts") || "[]");
    const newProduct = {
      ...form,
      id: `local-${Date.now()}`,
      rating: Number(form.rating),
      grid: isNaN(Number(form.grid)) ? form.grid : Number(form.grid),
    };
    localStorage.setItem("localProducts", JSON.stringify([...existing, newProduct]));

    setTimeout(() => {
      setSaving(false);
      toast.success(`"${form.title}" added successfully!`);
      setForm(EMPTY);
      setPreview(null);
      setColorInput("");
    }, 600);
  };

  const inputClass = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#f5f5f7] outline-none tracking-wide transition-all duration-200 placeholder-[#3a3a3c] focus:border-[#d4a843]/40 focus:bg-white/[0.05]";
  const labelClass = "block text-[11px] font-medium tracking-[0.12em] uppercase text-[#48484a] mb-2";

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans">

      {/* Glow */}
      <div className="fixed w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,168,67,0.05) 0%, transparent 70%)", top: "-150px", right: "-150px" }} />

      {/* Header */}
      <div className="bg-[#111113] border-b border-white/[0.07] px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#636366] cursor-pointer transition-colors hover:bg-white/[0.1] hover:text-[#f5f5f7]"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-[18px] font-medium text-[#f5f5f7]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Add New Product
          </h1>
          <p className="text-[11px] text-[#48484a]">Products are saved locally for now</p>
        </div>
        <button
          onClick={() => navigate("/manage-products")}
          className="ml-auto text-[12px] text-[#636366] bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 cursor-pointer transition-colors hover:text-[#f5f5f7] hover:bg-white/[0.07]"
        >
          View All Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-[860px] mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Left column ── */}
        <div className="space-y-5">

          {/* Title */}
          <div>
            <label className={labelClass}>Product Title *</label>
            <input type="text" placeholder="e.g. iPhone 17 Pro Max" value={form.title} onChange={update("title")} required className={inputClass} />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category *</label>
            <select value={form.category} onChange={update("category")} required className={inputClass}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className={labelClass}>Type</label>
            <input type="text" placeholder="e.g. Smartphones, Electronics" value={form.type} onChange={update("type")} className={inputClass} />
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Price *</label>
              <input type="text" placeholder="$999.00" value={form.price} onChange={update("price")} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Original Price</label>
              <input type="text" placeholder="$1,199.00" value={form.originalPrice} onChange={update("originalPrice")} className={inputClass} />
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className={labelClass}>SKU</label>
            <input type="text" placeholder="e.g. IP17PM-256" value={form.sku} onChange={update("sku")} className={inputClass} />
          </div>

          {/* Rating */}
          <div>
            <label className={labelClass}>Rating (1–5)</label>
            <select value={form.rating} onChange={update("rating")} className={inputClass}>
              {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </div>

          {/* In Stock */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="inStock" checked={form.inStock} onChange={update("inStock")}
              className="w-4 h-4 accent-[#d4a843] cursor-pointer" />
            <label htmlFor="inStock" className="text-sm text-[#8e8e93] cursor-pointer">In Stock</label>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Image upload */}
          <div>
            <label className={labelClass}>Product Image</label>
            <label className="flex flex-col items-center justify-center w-full h-36 bg-white/[0.03] border-2 border-dashed border-white/[0.1] rounded-xl cursor-pointer transition-colors hover:border-[#d4a843]/40 hover:bg-white/[0.05] overflow-hidden">
              {preview ? (
                <img src={preview} alt="preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#3a3a3c]">
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-xs">Click to upload image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <p className="text-[10px] text-[#3a3a3c] mt-1.5">Or paste an image URL below</p>
            <input type="text" placeholder="https://… or /src/assets/productimages/…"
              value={form.image} onChange={update("image")}
              onBlur={(e) => e.target.value && setPreview(e.target.value)}
              className={`${inputClass} mt-2`} />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea placeholder="Write a product description…" value={form.description} onChange={update("description")} rows={3}
              className={`${inputClass} resize-none`} />
          </div>

          {/* Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Badge 1</label>
              <select value={form.badge1} onChange={update("badge1")} className={inputClass}>
                <option value="">None</option>
                <option value="HOT">HOT</option>
                <option value="NEW">NEW</option>
                <option value="-5%">-5%</option>
                <option value="-10%">-10%</option>
                <option value="-15%">-15%</option>
                <option value="-20%">-20%</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Badge 2</label>
              <select value={form.badge2} onChange={update("badge2")} className={inputClass}>
                <option value="">None</option>
                <option value="HOT">HOT</option>
                <option value="NEW">NEW</option>
              </select>
            </div>
          </div>

          {/* Button type */}
          <div>
            <label className={labelClass}>Button Type</label>
            <select value={form.buttonType} onChange={update("buttonType")} className={inputClass}>
              <option value="cart">Add To Cart</option>
              <option value="select">Select Options</option>
            </select>
          </div>

          {/* Grid placement */}
          <div>
            <label className={labelClass}>Show On</label>
            <select value={form.grid} onChange={update("grid")} className={inputClass}>
              {GRIDS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>

          {/* Color swatches */}
          <div>
            <label className={labelClass}>Color Swatches</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {form.colors.map((c) => (
                <div key={c} className="flex items-center gap-1 bg-white/[0.06] border border-white/[0.1] rounded-full px-2.5 py-1">
                  <span className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20" style={{ background: c }} />
                  <span className="text-[11px] text-[#8e8e93]">{c}</span>
                  <button type="button" onClick={() => removeColor(c)} className="text-[#3a3a3c] hover:text-red-400 bg-transparent border-none cursor-pointer ml-1 text-xs leading-none">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="color" value={colorInput || "#ffffff"} onChange={(e) => setColorInput(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent p-0.5" />
              <input type="text" placeholder="#1a1a1a" value={colorInput} onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                className={`${inputClass} flex-1`} />
              <button type="button" onClick={addColor}
                className="px-4 rounded-xl text-sm font-semibold text-[#0a0a0c] border-none cursor-pointer flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}
              >Add</button>
            </div>
          </div>
        </div>

        {/* ── Submit ── full width */}
        <div className="md:col-span-2">
          <button type="submit" disabled={saving}
            className="w-full py-4 rounded-xl text-sm font-bold text-[#0a0a0c] border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}
          >
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
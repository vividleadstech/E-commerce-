import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Config";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const PAYSTACK_PUBLIC_KEY = "pk_test_8c9014f0c0c155c9b3359c2be8ace7c58bfc9b57";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [placing, setPlacing] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Paystack expects amount in kobo (smallest currency unit) — multiply by 100
  const paystackConfig = {
    reference: `vth_${Date.now()}`,
    email: form.email,
    amount: Math.round(cartTotal * 100),
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "NGN", // change to "USD" / "GHS" etc. depending on your Paystack account currency
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handlePaySuccess = async (reference) => {
    setPlacing(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user?.uid || null,
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        items: cartItems.map((i) => ({
          id: i.id, title: i.title, price: i.price, qty: i.qty,
        })),
        total: cartTotal,
        status: "Pending",
        paystackReference: reference.reference,
        createdAt: serverTimestamp(),
      });
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/order-success", { state: { reference: reference.reference } });
    } catch (err) {
      toast.error("Order failed to save: " + err.message);
    } finally {
      setPlacing(false);
    }
  };

  const handlePayClose = () => {
    toast.info("Payment window closed.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to checkout.");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill in all fields.");
      return;
    }
    initializePayment({ onSuccess: handlePaySuccess, onClose: handlePayClose });
  };

  const inp = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-[#f5f5f7] outline-none tracking-wide transition-all duration-200 placeholder-[#3a3a3c] focus:border-[#d4a843]/40 focus:bg-white/[0.05]";
  const lbl = "block text-[11px] font-medium tracking-[0.12em] uppercase text-[#48484a] mb-2";

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans px-6 py-10">
      <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8">

        {/* ── Left: Form ── */}
        <div>
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#48484a] text-sm bg-transparent border-none cursor-pointer mb-8 p-0 w-fit transition-colors duration-200 hover:text-[#aeaeb2]">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="text-[#f5f5f7] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "32px", fontWeight: 500 }}>
            Checkout
          </h1>
          <p className="text-sm text-[#48484a] mb-8">Enter your details to complete your order.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={lbl}>Full Name</label>
              <input className={inp} placeholder="John Doe" value={form.name} onChange={update("name")} required />
            </div>
            <div>
              <label className={lbl}>Email Address</label>
              <input type="email" className={inp} placeholder="you@example.com" value={form.email} onChange={update("email")} required />
            </div>
            <div>
              <label className={lbl}>Phone Number</label>
              <input className={inp} placeholder="+234 800 000 0000" value={form.phone} onChange={update("phone")} required />
            </div>
            <div>
              <label className={lbl}>Delivery Address</label>
              <textarea className={`${inp} resize-none`} rows={3} placeholder="Street, City, State" value={form.address} onChange={update("address")} required />
            </div>

            <button type="submit" disabled={placing}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-[#0a0a0c] border-none cursor-pointer mt-4 transition-all duration-200 hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}>
              {placing ? "Placing order…" : `Pay ₦${cartTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6 h-fit">
          <h2 className="text-[16px] font-medium text-[#f5f5f7] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-sm text-[#3a3a3c]">Your cart is empty.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#18181b] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain"
                      onError={(e) => { e.target.style.opacity = 0.2; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#f5f5f7] truncate">{item.title}</p>
                    <p className="text-[11px] text-[#48484a]">Qty: {item.qty}</p>
                  </div>
                  <span className="text-[12px] font-semibold" style={{ color: "#d4a843" }}>{item.price}</span>
                </div>
              ))}
            </div>
          )}

          <div className="h-px bg-white/[0.07] my-4" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#636366]">Total</span>
            <span className="text-lg font-bold" style={{ color: "#d4a843" }}>
              ₦{cartTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
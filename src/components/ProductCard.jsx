import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function StarRating({ rating }) {
  return (
    <div className="flex gap-[2px] my-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="11" height="11" viewBox="0 0 24 24" fill={star <= rating ? "#f5a623" : "#e0e0e0"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Badge({ text }) {
  const bg = text === "HOT" ? "#e53935" : text === "NEW" ? "#43a047" : "#1565c0";
  return (
    <span className="inline-block text-white text-[9px] font-bold py-0.5 px-1.5 rounded-full tracking-wide" style={{ background: bg }}>
      {text}
    </span>
  );
}

function ColorSwatch({ colors }) {
  if (!colors || colors.length === 0) return null;
  return (
    <div className="flex gap-1 mt-1">
      {colors.map((c, i) => (
        <div key={i} className="w-3 h-3 rounded-full border border-gray-300" style={{ background: c }} />
      ))}
    </div>
  );
}

function authToast(navigate) {
  toast.error(
    <span>
      Please{" "}
      <button onClick={() => navigate("/login")} className="text-[#d4a843] underline bg-transparent border-none cursor-pointer p-0 text-inherit">
        log in
      </button>
      {" "}to continue.
    </span>,
    { position: "top-center", autoClose: 3000 }
  );
}

// ── Product Modal ──────────────────────────────────────────────────────────
function ProductModal({ product, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleAddToCart = () => {
    if (!user) { authToast(navigate); return; }
    addToCart(product, qty);
    setAdded(true);
    toast.success(`${product.title} added to cart!`, { position: "top-center", autoClose: 2000 });
    setTimeout(() => setAdded(false), 1500);
  };

  const handleCheckout = () => {
    if (!user) { authToast(navigate); return; }
    addToCart(product, qty);
    navigate("/checkout");
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-[fadeIn_0.18s_ease]"
        onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="bg-[#111113] border border-white/10 rounded-[20px] w-full max-w-[860px] max-h-[90vh] overflow-y-auto flex flex-col sm:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-[slideUp_0.22s_cubic-bezier(0.22,0.68,0,1.2)] relative">
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/5 border border-white/10 rounded-full cursor-pointer flex items-center justify-center text-[#636366] hover:bg-white/10 hover:text-[#f5f5f7] transition-all z-[2]">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image panel */}
          <div className="w-full sm:w-[46%] shrink-0 bg-[#18181b] border-b sm:border-b-0 sm:border-r border-white/5 flex items-center justify-center p-6 sm:p-10 rounded-t-[20px] sm:rounded-l-[20px] sm:rounded-tr-none min-h-[240px] sm:min-h-[440px] relative">
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-[2]">
              {product.badge1 && <Badge text={product.badge1} />}
              {product.badge2 && <Badge text={product.badge2} />}
            </div>
            <img src={product.image} alt={product.title} loading="lazy"
              className="max-w-full max-h-[220px] sm:max-h-[320px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              onError={(e) => { e.target.style.opacity = 0.2; }} />
          </div>

          {/* Info panel */}
          <div className="flex-1 py-6 px-5 sm:py-10 sm:px-9 flex flex-col">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#48484a] mb-2">{product.category}</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}
              className="text-[22px] sm:text-[28px] font-medium text-[#f5f5f7] leading-tight mb-2">{product.title}</h2>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <StarRating rating={product.rating} />
              <span className="text-[11px] text-[#3a3a3c]">SKU: {product.sku}</span>
            </div>
            <div className="h-px bg-white/10 my-4" />
            <p className="text-[13px] text-[#636666] leading-relaxed mb-4">{product.description}</p>
            <div className={`flex items-center gap-1.5 text-xs font-semibold mb-3 ${product.inStock ? "text-[#43a047]" : "text-[#e53935]"}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              {product.inStock ? "In stock — ready to ship" : "Out of stock"}
            </div>
            <div className="flex items-baseline gap-2.5 mb-4">
              {product.originalPrice && <span className="text-sm text-[#3a3a3c] line-through">{product.originalPrice}</span>}
              <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }} className="text-[32px] font-medium text-[#d4a843] leading-none">{product.price}</span>
            </div>
            {product.colors?.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] tracking-[0.1em] uppercase text-[#48484a] mb-2">Color</p>
                <div className="flex gap-2">
                  {product.colors.map((c, i) => (
                    <div key={i} className="w-[22px] h-[22px] rounded-full border-2 border-white/25 cursor-pointer transition-transform hover:scale-110" style={{ background: c }} />
                  ))}
                </div>
              </div>
            )}
            <div className="mb-5">
              <p className="text-[11px] tracking-[0.1em] uppercase text-[#48484a] mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg text-[#f5f5f7] text-lg cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span className="text-base font-semibold text-[#f5f5f7] min-w-[20px] text-center">{qty}</span>
                <button className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg text-[#f5f5f7] text-lg cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors"
                  onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <button onClick={handleAddToCart}
                className="w-full py-3.5 rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-200 hover:opacity-80 hover:-translate-y-px active:translate-y-0"
                style={{ background: added ? "#43a047" : "rgba(255,255,255,0.07)", color: added ? "#fff" : "#f5f5f7", border: "1px solid rgba(255,255,255,0.1)" }}>
                {added ? "✓ Added to Cart!" : product.buttonType === "select" ? "Select Options" : "Add To Cart"}
              </button>
              <button onClick={handleCheckout}
                className="w-full py-3.5 rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:translate-y-0 text-[#0a0a0c]"
                style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}>
                Checkout Now
              </button>
            </div>
            {!user && (
              <p className="text-[11px] text-[#3a3a3c] mt-3 text-center">
                You must <a href="/login" className="text-[#d4a843] no-underline">log in</a> to add items or checkout.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Product Card ───────────────────────────────────────────────────────────
export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCart = () => {
    if (!user) { authToast(navigate); return; }
    addToCart(product);
    setAdded(true);
    toast.success(`${product.title} added to cart!`, { position: "top-center", autoClose: 2000 });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      {modalOpen && <ProductModal product={product} onClose={() => setModalOpen(false)} />}

      {/* 
        Card is now fully fluid — width is controlled by the parent grid.
        On AllProducts: parent is a CSS grid with grid-cols-2 on mobile → 2 per row.
        On ProductGrid (home): parent uses flex-wrap, card fills available space.
        Removed all fixed w-[] and min-w-[] from the card itself.
      */}
      <div className="bg-white border border-[#e8e8e8] rounded-xl p-2.5 sm:p-4 flex flex-col relative shadow-sm transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 w-full">

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-[2]">
          {product.badge1 && <Badge text={product.badge1} />}
          {product.badge2 && <Badge text={product.badge2} />}
        </div>

        {/* Image */}
        <div onClick={() => setModalOpen(true)} title="Click to view details"
          className="h-28 sm:h-40 flex items-center justify-center bg-[#f7f8fa] rounded-lg overflow-hidden mb-2 sm:mb-3 cursor-zoom-in transition-colors hover:bg-[#eef1f7]">
          <img src={product.image} alt={product.title} loading="lazy"
            className="max-h-[100px] sm:max-h-[140px] max-w-full object-contain transition-transform duration-200 hover:scale-105"
            onError={(e) => { e.target.style.opacity = 0.3; }} />
        </div>

        {/* Info */}
        <div className="text-[11px] sm:text-sm font-bold text-[#111] leading-tight mb-0.5 line-clamp-2">{product.title}</div>
        <div className="text-[10px] sm:text-xs text-[#9e9e9e] mb-0.5">{product.category}</div>

        <StarRating rating={product.rating} />

        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#43a047] font-semibold mb-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#43a047" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {product.inStock ? "In stock" : "Out of stock"}
        </div>

        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-[#bbb] line-through">{product.originalPrice}</span>
          )}
          <span className="text-sm sm:text-base font-bold text-[#1565c0]">{product.price}</span>
        </div>

        {product.colors?.length > 0 && <ColorSwatch colors={product.colors} />}

        <button onClick={handleCart}
          className="mt-2 text-white border-none rounded-md py-2 sm:py-2.5 text-[11px] sm:text-[13px] font-semibold cursor-pointer w-full transition-colors duration-200"
          style={{ background: added ? "#43a047" : "#1565c0" }}>
          {added ? "✓ Added!" : product.buttonType === "select" ? "Select Options" : "Add To Cart"}
        </button>

        <div className="text-[9px] sm:text-[11px] text-[#bbb] mt-1.5">
          <strong>SKU:</strong> {product.sku}
        </div>
      </div>
    </>
  );
}
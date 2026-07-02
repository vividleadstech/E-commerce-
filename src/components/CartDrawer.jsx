import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#111113] border-l border-white/[0.07] z-[1001] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]"
        style={{ animation: "slideIn 0.25s cubic-bezier(.22,.68,0,1.2)" }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <div>
            <h2 className="text-[18px] font-medium text-[#f5f5f7]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Your Cart
            </h2>
            <p className="text-[11px] text-[#48484a] mt-0.5">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#636366] cursor-pointer transition-colors hover:bg-white/[0.1] hover:text-[#f5f5f7]"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center">
                <svg className="w-7 h-7 text-[#3a3a3c]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#636366] text-sm font-medium">Your cart is empty</p>
                <p className="text-[#3a3a3c] text-xs mt-1">Add some products to get started</p>
              </div>
              <button
                onClick={() => { navigate("/products"); onClose(); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a0a0c] border-none cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                {/* Image */}
                <div className="w-16 h-16 rounded-lg bg-[#18181b] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.style.opacity = 0.2; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#f5f5f7] truncate">{item.title}</p>
                  <p className="text-[11px] text-[#48484a] mb-2">{item.category}</p>

                  <div className="flex items-center justify-between">
                    {/* Qty stepper */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 rounded-md bg-white/[0.06] border border-white/[0.1] text-[#f5f5f7] text-sm flex items-center justify-center cursor-pointer hover:bg-white/[0.1] transition-colors"
                      >−</button>
                      <span className="text-[13px] font-medium text-[#f5f5f7] min-w-[16px] text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-6 h-6 rounded-md bg-white/[0.06] border border-white/[0.1] text-[#f5f5f7] text-sm flex items-center justify-center cursor-pointer hover:bg-white/[0.1] transition-colors"
                      >+</button>
                    </div>

                    {/* Price */}
                    <span className="text-[13px] font-bold" style={{ color: "#d4a843" }}>
                      {item.price}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-[#3a3a3c] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none self-start mt-0.5"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-5 border-t border-white/[0.07] space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#636366]">Subtotal</span>
              <span className="text-[15px] font-bold" style={{ color: "#d4a843" }}>
                N{cartTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Checkout */}
            <button
              onClick={() => { navigate("/checkout"); onClose(); }}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-[#0a0a0c] border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
              style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}
            >
              Checkout
            </button>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full py-2.5 rounded-xl text-xs text-[#636366] bg-transparent border border-white/[0.06] cursor-pointer transition-colors hover:text-red-400 hover:border-red-500/20"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
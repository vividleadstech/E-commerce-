import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const reference = location.state?.reference;

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans flex items-center justify-center px-6">
      <div className="max-w-[420px] text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #43a047, #2e7d32)" }}>
          <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-[#f5f5f7] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "30px", fontWeight: 500 }}>
          Order Placed!
        </h1>
        <p className="text-sm text-[#636366] mb-6 leading-relaxed">
          Thank you for shopping with VividTechHub. Your order has been received and is being processed.
        </p>

        {reference && (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 mb-8">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#48484a] mb-1">Reference</p>
            <p className="text-sm text-[#d4a843] font-mono">{reference}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => navigate("/")}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-[#f5f5f7] border border-white/[0.1] bg-white/[0.04] cursor-pointer transition-colors hover:bg-white/[0.08]">
            Back to Home
          </button>
          <button onClick={() => navigate("/products")}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-[#0a0a0c] border-none cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
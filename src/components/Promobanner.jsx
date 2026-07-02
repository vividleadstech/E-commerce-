import { useNavigate } from "react-router-dom";
import img from "../assets/headphone.png"

export default function PromoBanner() {
  const navigate = useNavigate();

  return (
    <section className="px-6 py-8 bg-[#f4f6f9]">
      <div
        className="max-w-[1160px] mx-auto rounded-2xl overflow-hidden relative flex items-center justify-between px-8 md:px-14 py-10 md:py-14"
        style={{ background: "linear-gradient(120deg, #18181b 0%, #0e0e10 100%)" }}
      >
        {/* Ambient glow */}
        <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)", top: "-150px", right: "-100px" }} />

        {/* Left content */}
        <div className="relative z-10 max-w-[420px]">
          <span className="inline-block text-[11px] tracking-[0.18em] uppercase text-[#d4a843] font-semibold mb-3">
            Special Offer
          </span>
          <h2 className="text-[#f5f5f7] leading-[1.1] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500 }}>
            Up to <span style={{ color: "#d4a843" }}>50% Off</span>
          </h2>
          <p className="text-sm text-[#8e8e93] leading-relaxed mb-7">
            Limited time offer on selected tech. Hurry up and grab the best deals before they're gone.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[#0a0a0c] border-none cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}
          >
            Shop Now
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Right illustration — headphone image */}
        <div className="hidden md:flex items-center justify-center relative z-10 flex-shrink-0 w-[260px] h-[260px]">
          {/* Debug: Check if image loads */}
          <img 
            src={img} 
            alt="" 
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error("Image failed to load:", img);
              e.target.style.display = 'none';
            }}
            onLoad={() => console.log("Image loaded successfully!")}
          />
          
          {/* Fallback if image doesn't load */}
          <div className="absolute inset-0 flex items-center justify-center text-[#8e8e93] text-sm">
            
          </div>

          {/* Price tag */}
          <div className="absolute flex flex-col items-center justify-center rounded-xl px-4 py-3 z-20"
            style={{
              background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)",
              right: "10px", top: "55px", transform: "rotate(-8deg)",
              boxShadow: "0 12px 32px rgba(212,168,67,0.35)",
            }}>
            <span className="text-[#0a0a0c] text-lg font-extrabold leading-none">50%</span>
            <span className="text-[#0a0a0c] text-[10px] font-bold tracking-wide">OFF</span>
            <div className="absolute w-2 h-2 rounded-full bg-[#0a0a0c] -top-1 left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}
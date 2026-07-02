import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Replace these with your actual asset paths ───────────────────────────────
import iPhone17ProImg from "../assets/productImages/17pro.png";
import macbookImg     from "../assets/macbook1.png";
import appleWatchImg  from "../assets/iwatch2.png";
// ─────────────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 1,
    badge: "Just Arrived",
    headline: "iPhone 17",
    headlineAccent: "Pro.",
    subtext: "Four cameras. One extraordinary system.",
    detail: "A18 Pro chip · Titanium design · 5× Optical zoom",
    price: "₦1,899,000",
    installment: "or ₦158,250/mo. over 12 months",
    cta: "Buy Now",
    ctaSecondary: "Learn More",
    bg: "linear-gradient(130deg, #eaeaec 0%, #e0e0e4 35%, #d2d2d8 70%, #c8c8d0 100%)",
    accentDark: "#1c1c1e",
    accentMid: "#48484a",
    accentLight: "#6e6e73",
    btnBg: "#1c1c1e",
    btnText: "#ffffff",
    isDark: false,
    image: iPhone17ProImg,
    imageAlt: "iPhone 17 Pro — Silver",
  },
  {
    id: 2,
    badge: "Pro Performance",
    headline: "MacBook Pro",
    headlineAccent: "M4 Max.",
    subtext: "The most powerful Mac laptop. Ever.",
    detail: "M4 Max chip · 48GB RAM · Up to 128GB storage",
    price: "₦3,450,000",
    installment: "or ₦287,500/mo. over 12 months",
    cta: "Shop Now",
    ctaSecondary: "Learn More",
    bg: "linear-gradient(130deg, #d8d8d8 0%, #cecece 30%, #c4c4c6 60%, #b8b8bc 100%)",
    accentDark: "#1c1c1e",
    accentMid: "#3a3a3c",
    accentLight: "#6e6e73",
    btnBg: "#1c1c1e",
    btnText: "#f5f5f7",
    isDark: false,
    image: macbookImg,
    imageAlt: "MacBook Pro M4 Max — Silver",
  },
  {
    id: 3,
    badge: "Wear the Future",
    headline: "Apple Watch",
    headlineAccent: "Series 10.",
    subtext: "Your health. Your style. Your pace.",
    detail: "Gold Aluminium · Midnight case · Sport Band",
    price: "₦899,000",
    installment: "or ₦74,916/mo. over 12 months",
    cta: "Buy Now",
    ctaSecondary: "Explore",
    bg: "linear-gradient(130deg, #d4c4b0 0%, #c8b89a 30%, #bfaa8a 60%, #b8a082 100%)",
    accentDark: "#2c1f0e",
    accentMid: "#4a3520",
    accentLight: "#6b4f30",
    btnBg: "#2c1f0e",
    btnText: "#f5f0e8",
    isDark: false,
    image: appleWatchImg,
    imageAlt: "Apple Watch Series 10 — Gold & Midnight",
  },
];

export default function Hero({ onAddToCart }) {
  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [visible, setVisible]     = useState(true);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const goToSlide = (index, dir = "next") => {
    if (animating || index === current) return;
    setDirection(dir);
    setAnimating(true);
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setVisible(true);
      setAnimating(false);
    }, 420);
  };

  const next = () => goToSlide((current + 1) % SLIDES.length, "next");
  const prev = () => goToSlide((current - 1 + SLIDES.length) % SLIDES.length, "prev");

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5500);
    return () => clearInterval(timerRef.current);
  }, [current]);

  // Navigate to All Products page
  const handleShopNow = (slide, e) => {
    e?.stopPropagation();
    
    // If onAddToCart prop exists, call it first (optional)
    if (onAddToCart) {
      onAddToCart(slide);
    }
    
    // Navigate to All Products page
    navigate("/products");
  };

  // Handle "Learn More" / secondary CTA - also goes to products page
  const handleLearnMore = (slide, e) => {
    e?.stopPropagation();
    // Navigate to All Products page
    navigate("/products");
  };

  const s = SLIDES[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');

        .hero-root * { box-sizing: border-box; }
        .hero-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .hero-sans  { font-family: 'Inter', system-ui, sans-serif; }

        .txt-enter-r { animation: txtInR  0.42s cubic-bezier(.25,.8,.25,1) forwards; }
        .txt-enter-l { animation: txtInL  0.42s cubic-bezier(.25,.8,.25,1) forwards; }
        @keyframes txtInR { from{opacity:0;transform:translateX(36px)} to{opacity:1;transform:translateX(0)} }
        @keyframes txtInL { from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:translateX(0)} }

        .img-enter-r { animation: imgInR 0.52s cubic-bezier(.22,.68,0,1.15) forwards; }
        .img-enter-l { animation: imgInL 0.52s cubic-bezier(.22,.68,0,1.15) forwards; }
        @keyframes imgInR { from{opacity:0;transform:translateX(56px) scale(0.93)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes imgInL { from{opacity:0;transform:translateX(-56px) scale(0.93)} to{opacity:1;transform:translateX(0) scale(1)} }

        @keyframes progress-hero { from{width:0%} to{width:100%} }

        .hero-grain::after {
          content:''; position:absolute; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity:0.032; pointer-events:none; z-index:1;
        }
      `}</style>

      <section
        className="hero-root hero-grain relative w-full overflow-hidden"
        style={{ background: s.bg, transition: "background 0.8s ease" }}
      >
        {/* ── Mobile layout: stacked ── */}
        <div className="flex flex-col md:hidden">
          {/* Image top on mobile — large and prominent */}
          <div
            key={`img-mob-${current}`}
            className={`relative z-10 flex items-end justify-center pt-8 px-6 ${visible ? (direction === "next" ? "img-enter-r" : "img-enter-l") : ""}`}
            style={{ minHeight: "260px" }}
          >
            <img
              src={s.image}
              alt={s.imageAlt}
              loading="lazy"
              draggable={false}
              className="select-none object-contain w-full"
              style={{
                maxHeight: "280px",
                filter: `drop-shadow(0 24px 40px rgba(0,0,0,${s.isDark ? "0.7" : "0.18"}))`,
              }}
            />
          </div>

          {/* Text below on mobile */}
          <div
            key={`txt-mob-${current}`}
            className={`hero-sans relative z-10 px-6 pt-5 pb-16 ${visible ? (direction === "next" ? "txt-enter-r" : "txt-enter-l") : ""}`}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.accentDark }} />
              <span className="text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: s.accentMid }}>
                {s.badge}
              </span>
            </div>

            <h1
              className="hero-serif font-light leading-[1.02] mb-2"
              style={{ fontSize: "clamp(2.6rem, 11vw, 4rem)", color: s.accentDark, letterSpacing: "-0.02em" }}
            >
              {s.headline}{" "}
              <em className="hero-serif" style={{ color: s.accentMid, fontStyle: "italic", fontWeight: 300 }}>
                {s.headlineAccent}
              </em>
            </h1>

            <div className="w-8 h-px my-3" style={{ background: s.accentLight, opacity: 0.5 }} />

            <p className="hero-sans font-light text-sm leading-relaxed mb-1" style={{ color: s.accentMid }}>
              {s.subtext}
            </p>
            <p className="hero-sans font-light text-[11px] tracking-wide mb-4" style={{ color: s.accentLight }}>
              {s.detail}
            </p>

            <p className="hero-serif font-semibold mb-0.5" style={{ fontSize: "clamp(1.6rem, 7vw, 2.2rem)", color: s.accentDark, letterSpacing: "-0.01em" }}>
              {s.price}
            </p>
            <p className="hero-sans font-light text-xs mb-6" style={{ color: s.accentLight }}>
              {s.installment}
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={(e) => handleShopNow(s, e)}
                className="hero-sans text-sm font-medium px-7 py-3 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: s.btnBg, color: s.btnText, letterSpacing: "0.02em" }}
              >
                {s.cta}
              </button>
              <button
                onClick={(e) => handleLearnMore(s, e)}
                className="hero-sans text-sm font-medium flex items-center gap-1.5 transition-opacity hover:opacity-60"
                style={{ color: s.accentMid, textDecoration: "underline", textUnderlineOffset: "4px", textDecorationThickness: "1px" }}
              >
                {s.ctaSecondary}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop layout: side by side ── */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 hidden md:flex items-center justify-between"
          style={{ minHeight: "560px" }}
        >
          {/* LEFT — copy */}
          <div
            key={`txt-${current}`}
            className={`hero-sans flex-1 max-w-lg py-16 ${visible ? (direction === "next" ? "txt-enter-r" : "txt-enter-l") : ""}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.accentDark }} />
              <span className="text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: s.accentMid }}>
                {s.badge}
              </span>
            </div>

            <h1
              className="hero-serif font-light leading-[1.02] mb-2"
              style={{ fontSize: "clamp(3.2rem, 6.5vw, 6rem)", color: s.accentDark, letterSpacing: "-0.02em" }}
            >
              {s.headline}{" "}
              <em className="hero-serif" style={{ color: s.accentMid, fontStyle: "italic", fontWeight: 300 }}>
                {s.headlineAccent}
              </em>
            </h1>

            <div className="w-10 h-px mb-4 mt-4" style={{ background: s.accentLight, opacity: 0.5 }} />

            <p className="hero-sans font-light text-base md:text-lg leading-relaxed mb-1" style={{ color: s.accentMid }}>
              {s.subtext}
            </p>
            <p className="hero-sans font-light text-xs tracking-wide mb-6" style={{ color: s.accentLight }}>
              {s.detail}
            </p>

            <p className="hero-serif font-semibold mb-0.5" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: s.accentDark, letterSpacing: "-0.01em" }}>
              {s.price}
            </p>
            <p className="hero-sans font-light text-xs mb-8" style={{ color: s.accentLight }}>
              {s.installment}
            </p>

            <div className="flex items-center gap-5 flex-wrap">
              <button
                onClick={(e) => handleShopNow(s, e)}
                className="hero-sans text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-200 hover:opacity-90 hover:scale-[1.03] active:scale-95"
                style={{ background: s.btnBg, color: s.btnText, letterSpacing: "0.02em" }}
              >
                {s.cta}
              </button>
              <button
                onClick={(e) => handleLearnMore(s, e)}
                className="hero-sans text-sm font-medium transition-opacity hover:opacity-60 flex items-center gap-1.5"
                style={{ color: s.accentMid, textDecoration: "underline", textUnderlineOffset: "4px", textDecorationThickness: "1px" }}
              >
                {s.ctaSecondary}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* RIGHT — product image, bigger */}
          <div
            key={`img-${current}`}
            className={`flex-1 flex items-center justify-center py-8 ${visible ? (direction === "next" ? "img-enter-r" : "img-enter-l") : ""}`}
          >
            <img
              src={s.image}
              alt={s.imageAlt}
              loading="lazy"
              draggable={false}
              className="select-none object-contain"
              style={{
                maxHeight: "520px",
                width: "100%",
                filter: `drop-shadow(0 40px 60px rgba(0,0,0,${s.isDark ? "0.55" : "0.18"}))`,
              }}
            />
          </div>
        </div>

        {/* ── Slide counter ── */}
        <div
          className="hero-sans absolute top-5 right-5 z-20 text-xs font-light tracking-widest"
          style={{ color: s.accentLight }}
        >
          {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </div>

        {/* ── Arrow Prev ── */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.1)",
            color: s.accentMid,
            backdropFilter: "blur(8px)",
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* ── Arrow Next ── */}
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.1)",
            color: s.accentMid,
            backdropFilter: "blur(8px)",
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* ── Dot Navigation ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((sl, i) => (
            <button
              key={sl.id}
              onClick={() => goToSlide(i, i > current ? "next" : "prev")}
              aria-label={`Slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "28px" : "8px",
                height: "8px",
                background: s.accentDark,
                opacity: i === current ? 0.8 : 0.22,
              }}
            />
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div
          className="absolute bottom-0 left-0 w-full z-20"
          style={{ height: "2px", background: "rgba(0,0,0,0.07)" }}
        >
          <div
            key={`pb-${current}`}
            style={{
              height: "100%",
              background: s.accentDark,
              opacity: 0.4,
              animation: "progress-hero 5.5s linear forwards",
            }}
          />
        </div>
      </section>
    </>
  );
}
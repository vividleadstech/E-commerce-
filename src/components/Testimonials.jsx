import { useRef, useState, useEffect } from "react";

const REVIEWS = [
  {
    name: "John D.",
    text: "Amazing products and fast delivery! VividTechHub is my go-to store for all my tech needs.",
    rating: 5,
    initials: "JD",
  },
  {
    name: "Sarah M.",
    text: "Great quality at affordable prices. The customer support is also very responsive.",
    rating: 5,
    initials: "SM",
  },
  {
    name: "Michael T.",
    text: "Very happy with my purchase. Highly recommend VividTechHub to everyone!",
    rating: 5,
    initials: "MT",
  },
  {
    name: "Amaka O.",
    text: "Got my iPhone delivered in two days. Packaging was solid and the price was unbeatable.",
    rating: 5,
    initials: "AO",
  },
  {
    name: "David K.",
    text: "The admin team responded so fast when I had a question about my order. 10/10 experience.",
    rating: 4,
    initials: "DK",
  },
];

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5 mt-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= rating ? "#d4a843" : "#d1d1d6"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Duplicate reviews for infinite scroll effect
  const infiniteReviews = [...REVIEWS, ...REVIEWS, ...REVIEWS];

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const cardWidth = 310; // card width + gap
    const container = scrollRef.current;
    const currentScroll = container.scrollLeft;
    const targetScroll = currentScroll + dir * cardWidth;
    
    container.scrollTo({ left: targetScroll, behavior: "smooth" });

    // Reset scroll position for infinite effect when reaching boundaries
    setTimeout(() => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const firstSetWidth = REVIEWS.length * cardWidth;
      const lastSetStart = (REVIEWS.length * 2) * cardWidth;
      
      if (scrollLeft < 10) {
        // At beginning, jump to middle set
        container.scrollTo({ left: REVIEWS.length * cardWidth, behavior: "auto" });
      } else if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // At end, jump to middle set
        container.scrollTo({ left: REVIEWS.length * cardWidth, behavior: "auto" });
      }
    }, 400);
  };

  return (
    <section className="bg-[#f5f5f7] py-16 px-6 font-sans">
      <div className="max-w-[1160px] mx-auto">
        <h2 className="text-center text-[#1c1c1e] mb-10"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 500 }}>
          What Our Customers Say
        </h2>

        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll(-1)}
            className={`hidden md:flex absolute left-[-18px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#d1d1d6] items-center justify-center text-[#8e8e93] cursor-pointer z-10 transition-all duration-200 hover:bg-[#f0f0f2] hover:text-[#1c1c1e] hover:border-[#a1a1a6] ${
              !canScrollLeft ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`section .flex.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
            {infiniteReviews.map((r, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[290px] bg-white border border-[#e5e5ea] rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#d4a843]/30"
              >
                {/* Quote icon */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "rgba(212,168,67,0.12)" }}>
                  <svg width="16" height="16" fill="#d4a843" viewBox="0 0 24 24">
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-4v-10h10z" />
                  </svg>
                </div>

                <p className="text-[13px] text-[#3a3a3c] leading-relaxed mb-5 min-h-[60px]">
                  {r.text}
                </p>

                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}>
                    {r.initials}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-[#1c1c1e]">{r.name}</p>
                    <StarRow rating={r.rating} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll(1)}
            className={`hidden md:flex absolute right-[-18px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#d1d1d6] items-center justify-center text-[#8e8e93] cursor-pointer z-10 transition-all duration-200 hover:bg-[#f0f0f2] hover:text-[#1c1c1e] hover:border-[#a1a1a6] ${
              !canScrollRight ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
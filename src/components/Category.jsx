import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Replace these imports with your actual asset paths ───────────────────────
import monitorImg     from "../assets/monitor.png";
import speakerImg     from "../assets/speaker.png";
import tabletImg      from "../assets/ipad.png";
import airpodsImg     from "../assets/airpods.png";
import smartwatchImg  from "../assets/iwatch.png";
import phoneImg       from "../assets/17series.png";
import headphonesImg  from "../assets/headphone.png";
import laptopImg      from "../assets/laptop.png";
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 1,
    label: "Monitors",
    count: 9,
    image: monitorImg,
    categorySlug: "monitors",
  },
  {
    id: 2,
    label: "Speaker",
    count: 3,
    image: speakerImg,
    categorySlug: "speakers",
  },
  {
    id: 3,
    label: "Tablets",
    count: 4,
    image: tabletImg,
    categorySlug: "tablets",
  },
  {
    id: 4,
    label: "Airpods",
    count: 2,
    image: airpodsImg,
    categorySlug: "airpods",
  },
  {
    id: 5,
    label: "Smartwatches",
    count: 10,
    image: smartwatchImg,
    categorySlug: "smartwatches",
  },
  {
    id: 6,
    label: "Smart Phones",
    count: 9,
    image: phoneImg,
    categorySlug: "phones",
  },
  {
    id: 7,
    label: "Headphones",
    count: 2,
    image: headphonesImg,
    categorySlug: "headphones",
  },
  {
    id: 8,
    label: "Laptops",
    count: 6,
    image: laptopImg,
    categorySlug: "laptops",
  },
];

function CategoryCard({ cat, index }) {
  const [hovered, setHovered] = useState(false);
  const [entered, setEntered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80 + index * 55);
    return () => clearTimeout(t);
  }, [index]);

  const handleClick = (e) => {
    e.preventDefault();
    // Navigate to products page with category filter
    navigate(`/products?category=${cat.categorySlug}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
        outline: "none",
        flexShrink: 0,
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.5s ease ${index * 55}ms, transform 0.5s cubic-bezier(.22,.68,0,1.2) ${index * 55}ms`,
        cursor: "pointer",
        padding: "8px 4px",
        borderRadius: "24px",
      }}
    >
      {/* Image card with gold theme - removed translateY on hover */}
      <div
        style={{
          width: "86px",
          height: "86px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: hovered ? "#fef9f0" : "#ffffff",
          border: hovered ? "2px solid #d4a843" : "2px solid transparent",
          boxShadow: hovered
            ? "0 8px 24px rgba(212, 168, 67, 0.15), 0 4px 12px rgba(212, 168, 67, 0.08)"
            : "0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "background 0.32s ease, box-shadow 0.32s ease, transform 0.35s cubic-bezier(.22,.68,0,1.2), border 0.32s ease",
        }}
      >
        {/* Gold shimmer overlay on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered
              ? "radial-gradient(circle at 28% 28%, rgba(212, 168, 67, 0.08) 0%, transparent 65%)"
              : "transparent",
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Product image */}
        <img
          src={cat.image}
          alt={cat.label}
          draggable={false}
          style={{
            width: "58px",
            height: "58px",
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
            filter: hovered
              ? "drop-shadow(0 4px 8px rgba(212, 168, 67, 0.15))"
              : "drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2), filter 0.28s ease",
            userSelect: "none",
          }}
        />
      </div>

      {/* Text with gold accents */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            lineHeight: 1.2,
            color: hovered ? "#d4a843" : "#1c1c1e",
            transition: "color 0.25s ease",
            margin: 0,
          }}
        >
          {cat.label}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "11px",
            color: hovered ? "#b8862e" : "#8e8e93",
            marginTop: "3px",
            marginBottom: 0,
            transition: "color 0.25s ease",
          }}
        >
          {cat.count} {cat.count === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Animated gold underline */}
      <div
        style={{
          width: hovered ? "22px" : "0px",
          height: "2.5px",
          borderRadius: "999px",
          background: "#d4a843",
          marginTop: "-4px",
          transition: "width 0.3s cubic-bezier(.22,.68,0,1.2)",
        }}
      />
    </div>
  );
}

export default function Categories() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@400;600&display=swap');

        .cat-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <section
        style={{
          background: "#f9f9fb",
          padding: "48px 0 56px",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Heading */}
          <div style={{ marginBottom: "36px" }}>
            <p
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a843",
                marginBottom: "6px",
                margin: "0 0 6px 0",
              }}
            >
              Browse by
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                fontWeight: 600,
                color: "#1c1c1e",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Our Top Categories
            </h2>
          </div>

          {/* Cards row — horizontal scroll on mobile, wraps on desktop */}
          <div
            className="cat-scroll"
            style={{
              display: "flex",
              gap: "clamp(20px, 3.5vw, 44px)",
              overflowX: "auto",
              padding: "12px 4px 16px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
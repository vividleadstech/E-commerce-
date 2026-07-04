import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const QUICK_LINKS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/products" },
  { label: "Blogs", path: "/blogs" },
  { label: "Reviews", path: "/#reviews" },
];

const SERVICE_LINKS = [
  { label: "Track Order", path: "/orders" },
  { label: "Returns & Refunds", path: "#" },
  { label: "Shipping Policy", path: "#" },
];

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed! Watch your inbox for deals.");
    setEmail("");
  };

  return (
    <footer className="bg-[#0a0a0c] border-t border-white/[0.07] font-sans">
      <div className="max-w-[1160px] mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)", boxShadow: "0 4px 16px rgba(212,168,67,0.2)" }}>
              <svg width="16" height="16" fill="#0a0a0c" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[#f5f5f7] text-lg tracking-wide" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
              Vivid <em className="not-italic font-light" style={{ color: "#d4a843" }}>Tech</em>
            </span>
          </div>
          <p className="text-[13px] text-[#48484a] leading-relaxed">
            Your one-stop shop for quality tech products at the best prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[12px] tracking-[0.12em] uppercase text-[#f5f5f7] font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => {
                    if (l.path === "/#reviews") {
                      // If already on home, scroll directly
                      if (window.location.pathname === "/") {
                        document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        // Navigate home first, then scroll after page loads
                        navigate("/");
                        setTimeout(() => {
                          document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                        }, 500);
                      }
                    } else {
                      navigate(l.path);
                    }
                  }}
                  className="text-[13px] text-[#636366] bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-[#d4a843]">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-[12px] tracking-[0.12em] uppercase text-[#f5f5f7] font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2.5">
            {SERVICE_LINKS.map((l) => (
              <li key={l.label}>
                <button onClick={() => l.path !== "#" && navigate(l.path)}
                  className="text-[13px] text-[#636366] bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-[#d4a843]">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-[12px] tracking-[0.12em] uppercase text-[#f5f5f7] font-semibold mb-4">Subscribe to our Newsletter</h3>
          <p className="text-[13px] text-[#636366] mb-4 leading-relaxed">
            Get the latest updates on new products and upcoming sales.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2.5 text-[13px] text-[#f5f5f7] outline-none placeholder-[#3a3a3c] transition-colors focus:border-[#d4a843]/40"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg text-[13px] font-bold text-[#0a0a0c] border-none cursor-pointer flex-shrink-0 transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] px-6 py-5">
        <div className="max-w-[1160px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#3a3a3c]">
            © {new Date().getFullYear()} VividTechHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { label: "Facebook", path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.88h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" },
              { label: "Twitter", path: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05A4.13 4.13 0 0016.11 4c-2.28 0-4.13 1.86-4.13 4.15 0 .32.04.64.1.94C8.28 8.94 5.1 7.13 2.94 4.4c-.36.62-.57 1.34-.57 2.1 0 1.44.73 2.7 1.85 3.46-.68-.02-1.32-.21-1.88-.51v.05c0 2.02 1.43 3.7 3.32 4.09-.35.1-.72.15-1.1.15-.27 0-.53-.03-.78-.07.53 1.65 2.05 2.86 3.86 2.89A8.265 8.265 0 012 18.58 11.65 11.65 0 008.29 20.5c7.55 0 11.68-6.31 11.68-11.79 0-.18 0-.36-.01-.53.8-.58 1.5-1.3 2.05-2.13l.45-.05z" },
              { label: "Google", path: "M21.35 11.1H12v3.9h5.59c-.24 1.49-1.79 4.38-5.59 4.38-3.37 0-6.12-2.78-6.12-6.38s2.75-6.38 6.12-6.38c1.92 0 3.21.82 3.95 1.52l2.69-2.59C17.06 4.16 14.7 3 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c5.19 0 8.64-3.64 8.64-8.78 0-.59-.06-1.04-.29-2.12z" },
            ].map((s) => (
              <button key={s.label} title={s.label}
                className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#636366] cursor-pointer transition-all duration-200 hover:text-[#d4a843] hover:bg-[#d4a843]/[0.1] hover:border-[#d4a843]/30">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
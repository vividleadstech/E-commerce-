import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";

const QUICK_LINKS = [
  { label: "Home", path: "/", scrollToTop: true },
  { label: "Shop", path: "/products", scrollToTop: true },
  { label: "Categories", path: "/products", scrollToTop: true },
];

const SERVICE_LINKS = [
  { label: "Track Order", path: "/orders", scrollToTop: true },
  { label: "Returns & Refunds", path: "/returns", scrollToTop: true },
  { label: "Shipping Policy", path: "/shipping", scrollToTop: true },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed! Watch your inbox for deals.");
    setEmail("");
  };

  const handleNavigation = (path, scrollToTop = false) => {
    // If we're already on the page, just scroll to top
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    // Navigate to the page
    navigate(path);
    
    // Scroll to top after navigation
    if (scrollToTop) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <footer className="bg-[#0a0a0c] border-t border-white/[0.07] font-sans">
      <div className="max-w-[1160px] mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div 
            onClick={() => handleNavigation("/", true)}
            className="flex items-center gap-2.5 mb-4 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)", boxShadow: "0 4px 16px rgba(212,168,67,0.2)" }}>
              <svg width="16" height="16" fill="#0a0a0c" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[#f5f5f7] text-lg tracking-wide transition-colors group-hover:text-[#d4a843]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
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
                  onClick={() => handleNavigation(l.path, l.scrollToTop)}
                  className="text-[13px] text-[#636366] bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-[#d4a843]"
                >
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
                <button 
                  onClick={() => handleNavigation(l.path, l.scrollToTop)}
                  className="text-[13px] text-[#636366] bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-[#d4a843]"
                >
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
              required
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg text-[13px] font-bold text-[#0a0a0c] border-none cursor-pointer flex-shrink-0 transition-all hover:opacity-90 hover:scale-105 active:scale-95"
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
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#636366] cursor-pointer transition-all duration-200 hover:text-[#d4a843] hover:bg-[#d4a843]/[0.1] hover:border-[#d4a843]/30"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#636366] cursor-pointer transition-all duration-200 hover:text-[#d4a843] hover:bg-[#d4a843]/[0.1] hover:border-[#d4a843]/30"
            >
              <FaTwitter size={14} />
            </a>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Google"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#636366] cursor-pointer transition-all duration-200 hover:text-[#d4a843] hover:bg-[#d4a843]/[0.1] hover:border-[#d4a843]/30"
            >
              <FaGoogle size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
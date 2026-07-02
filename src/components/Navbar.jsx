import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import admins from "../admin.json";

const SEARCH_SUGGESTIONS = [
  "iPhone 17 Pro", "iPhone 17 Air", "iPhone 17", "iPhone 16",
  "iPhone 16 Pro", "iPhone 16 Pro Max", "iPhone 15", "iPhone 15 Pro",
  "iPhone 15 Pro Max", "Apple Watch Series 10", "Google Pixel 9 Pro Fold",
  "Starlink Standard Kit", "Xiaomi Curved Monitor", "Sony WH-1000XM6",
  "Samsung Galaxy Tab S10 Ultra", "DJI Mini 4K Drone",
  "Logitech MX Master 3S", "Anker 4K Monitor", "PlayStation 5",
];

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Our Store", path: "/products" },
  { label: "Reviews", path: "#testimonials" },
  { label: "Blogs", path: "/blogs" },
];

export default function Navbar({ onCartClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const isAdmin = user && admins.adminUIDs.includes(user.uid);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const dropdownTimeout = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSuggestions(false);
      if (accountRef.current && !accountRef.current.contains(e.target))
        setShowAccountMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setShowAccountMenu(false);
  }, [location.pathname]);

  const handleSuggestionClick = (s) => {
    setSearchQuery(s);
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    navigate("/products", { state: { search: s } });
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowSuggestions(false);
      setMobileSearchOpen(false);
      navigate("/products", { state: { search: searchQuery } });
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowAccountMenu(false);
    setMobileMenuOpen(false);
    toast.success("Logged out successfully.");
    navigate("/");
  };

  const handleDropdownEnter = (label) => { clearTimeout(dropdownTimeout.current); setActiveDropdown(label); };
  const handleDropdownLeave = () => { dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 160); };

  const UserAvatar = ({ size = 22 }) => {
    if (user?.photoURL) {
      return (
        <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer"
          className="rounded-full object-cover flex-shrink-0 border border-[#d4a843]/30"
          style={{ width: size, height: size }} />
      );
    }
    const initials = user?.displayName
      ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "U";
    return (
      <span className="rounded-full flex items-center justify-center text-[#0a0a0c] font-bold flex-shrink-0"
        style={{ width: size, height: size, background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)", fontSize: size * 0.38 }}>
        {initials}
      </span>
    );
  };

  const SearchBox = ({ autoFocus = false }) => (
    <div className="relative w-full" ref={searchRef}>
      <div className="flex items-center bg-white/[0.04] border border-white/[0.09] rounded-full px-4 h-[38px] transition-all duration-200 focus-within:border-white/[0.2] focus-within:bg-white/[0.06]">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowSuggestions(true)} onKeyDown={handleSearchSubmit}
          placeholder="Search products…" autoFocus={autoFocus}
          className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#d1d1d6] tracking-wide placeholder-[#48484a] font-sans"
        />
        <button onClick={() => searchQuery.trim() && navigate("/products", { state: { search: searchQuery } })}
          className="text-[#48484a] bg-transparent border-none cursor-pointer flex items-center transition-colors duration-200 hover:text-[#aeaeb2]">
          <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        </button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#18181b] border border-white/[0.08] rounded-[14px] shadow-[0_20px_56px_rgba(0,0,0,0.7)] z-[300] overflow-hidden p-1.5">
          <p className="text-[9px] tracking-[0.22em] uppercase text-[#3a3a3c] font-medium px-3 pt-2 pb-1">Suggestions</p>
          {suggestions.map((s) => (
            <button key={s} onClick={() => handleSuggestionClick(s)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] text-[#8e8e93] bg-transparent border-none cursor-pointer text-left rounded-lg transition-all duration-150 hover:bg-white/[0.05] hover:text-[#f5f5f7]">
              <svg className="w-[13px] h-[13px] text-[#3a3a3c] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <span>
                {s.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
                  part.toLowerCase() === searchQuery.toLowerCase()
                    ? <mark key={i} className="bg-[#d4a843]/[0.18] text-[#d4a843] font-medium rounded-sm px-0.5">{part}</mark>
                    : <span key={i}>{part}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const ChevronDown = ({ className = "" }) => (
    <svg className={`w-2.5 h-2.5 fill-current ${className}`} viewBox="0 0 20 20">
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
    </svg>
  );

  return (
    <header className="w-full font-sans sticky top-0 z-[999]">

      <div className="hidden md:flex bg-[#0a0a0c] border-b border-white/[0.06] px-6 py-2 items-center justify-between">
        <button className="flex items-center gap-1.5 text-[11px] tracking-[0.06em] text-[#636366] bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-[#aeaeb2]">
          <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          English <ChevronDown />
        </button>

        <p className="flex items-center gap-1.5 text-[11px] tracking-[0.05em] text-[#48484a]">
          <span>🚚</span>
          <span className="text-[#aeaeb2]">Free Shipping</span>
          <span>on orders over</span>
          <span className="text-[#d4a843] font-medium">₦1,000,000</span>
        </p>

        <div ref={accountRef} className="relative">
          <button
            onClick={() => setShowAccountMenu((v) => !v)}
            className="flex items-center gap-2 text-[11px] tracking-[0.06em] text-[#636366] bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-[#aeaeb2]"
          >
            {user ? (
              <>
                <UserAvatar size={22} />
                <span className="max-w-[120px] truncate text-[#aeaeb2]">
                  {user.displayName?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
                <ChevronDown className={`transition-transform duration-200 ${showAccountMenu ? "rotate-180" : ""}`} />
              </>
            ) : (
              <>
                <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                My Account
                <ChevronDown className={`transition-transform duration-200 ${showAccountMenu ? "rotate-180" : ""}`} />
              </>
            )}
          </button>

          {showAccountMenu && (
            <div className="absolute top-[calc(100%+10px)] right-0 bg-[#18181b] border border-white/[0.08] rounded-xl shadow-[0_20px_56px_rgba(0,0,0,0.7)] z-[200] min-w-[200px] p-1.5">
              <div className="h-0.5 rounded-sm mb-1.5" style={{ background: "linear-gradient(90deg, #d4a843, transparent)" }} />

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3.5 py-3 mb-1">
                    <UserAvatar size={36} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#f5f5f7] truncate">{user.displayName || "User"}</p>
                      <p className="text-[11px] text-[#48484a] truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/[0.05] mb-1" />
                  {isAdmin && (
                    <>
                      <button onClick={() => { navigate("/admin"); setShowAccountMenu(false); }}
                        className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-[#d4a843] bg-[#d4a843]/[0.06] border-none cursor-pointer text-left rounded-[7px] transition-all duration-150 hover:bg-[#d4a843]/[0.12] font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7.65 7.65 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.28z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Panel
                      </button>
                      <div className="h-px bg-white/[0.05] my-1" />
                    </>
                  )}
                  <button onClick={() => { navigate("/profile"); setShowAccountMenu(false); }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-[#8e8e93] bg-transparent border-none cursor-pointer text-left rounded-[7px] transition-all duration-150 hover:bg-white/[0.05] hover:text-[#f5f5f7]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    My Profile
                  </button>
                  <button onClick={() => { navigate("/orders"); setShowAccountMenu(false); }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-[#8e8e93] bg-transparent border-none cursor-pointer text-left rounded-[7px] transition-all duration-150 hover:bg-white/[0.05] hover:text-[#f5f5f7]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                    My Orders
                  </button>
                  <div className="h-px bg-white/[0.05] my-1" />
                  <button onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-red-400 bg-transparent border-none cursor-pointer text-left rounded-[7px] transition-all duration-150 hover:bg-red-500/[0.08] hover:text-red-300">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate("/login"); setShowAccountMenu(false); }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-[#8e8e93] bg-transparent border-none cursor-pointer text-left rounded-[7px] transition-all duration-150 hover:bg-white/[0.05] hover:text-[#f5f5f7]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Login
                  </button>
                  <div className="h-px bg-white/[0.05] my-1" />
                  <button onClick={() => { navigate("/signup"); setShowAccountMenu(false); }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-[13px] text-[#8e8e93] bg-transparent border-none cursor-pointer text-left rounded-[7px] transition-all duration-150 hover:bg-white/[0.05] hover:text-[#f5f5f7]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#111113] border-b border-white/[0.07] shadow-[0_1px_0_rgba(255,255,255,0.03)]">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center gap-4 h-16">

          <a href="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)", boxShadow: "0 4px 16px rgba(212,168,67,0.25)" }}>
              <svg className="w-[18px] h-[18px] text-[#0a0a0c]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="leading-none">
              <span className="text-[22px] font-medium tracking-wide text-[#f5f5f7]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Vivid <em className="not-italic font-light" style={{ color: "#d4a843" }}>Tech</em>
              </span>
              <span className="block text-[9px] tracking-[0.28em] uppercase text-[#48484a] font-normal mt-0.5">Hub · Est. 2024</span>
            </div>
          </a>

          <div className="hidden md:block w-px h-7 bg-white/[0.07] flex-shrink-0" />

          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative"
                onMouseEnter={() => link.hasDropdown && handleDropdownEnter(link.label)}
                onMouseLeave={handleDropdownLeave}
              >
                {link.hasDropdown ? (
                  <button className={`flex items-center gap-1 text-[13px] tracking-[0.04em] px-3 py-1.5 rounded-md border-none cursor-pointer whitespace-nowrap transition-all duration-200 ${activeDropdown === link.label ? "text-[#f5f5f7] bg-white/[0.06]" : "text-[#8e8e93] bg-transparent hover:text-[#f5f5f7] hover:bg-white/[0.06]"}`}>
                    {link.label} <ChevronDown className={`transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <button onClick={() => navigate(link.path)}
                    className={`flex items-center gap-1 text-[13px] tracking-[0.04em] px-3 py-1.5 rounded-md border-none cursor-pointer whitespace-nowrap transition-all duration-200 ${location.pathname === link.path ? "text-[#f5f5f7] bg-white/[0.06]" : "text-[#8e8e93] bg-transparent hover:text-[#f5f5f7] hover:bg-white/[0.06]"}`}>
                    {link.label}
                  </button>
                )}
                {link.hasDropdown && activeDropdown === link.label && (
                  <div onMouseEnter={() => handleDropdownEnter(link.label)} onMouseLeave={handleDropdownLeave}
                    className="absolute top-[calc(100%+8px)] left-0 bg-[#18181b] border border-white/[0.08] rounded-xl shadow-[0_20px_56px_rgba(0,0,0,0.7)] z-[100] min-w-[168px] p-1.5">
                    <div className="h-0.5 rounded-sm mb-1" style={{ background: "linear-gradient(90deg, #d4a843, transparent)" }} />
                    {link.items.map((item) => (
                      <a key={item} href="#" className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[#8e8e93] no-underline rounded-[7px] transition-all duration-150 hover:bg-white/[0.05] hover:text-[#f5f5f7]">
                        <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: "#d4a843" }} />
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="hidden md:flex flex-1 max-w-[320px]"><SearchBox /></div>

          <button className={`md:hidden bg-transparent border-none cursor-pointer flex items-center transition-colors duration-200 ${mobileSearchOpen ? "text-[#d4a843]" : "text-[#636366] hover:text-[#f5f5f7]"}`}
            onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileMenuOpen(false); }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          </button>

          <button onClick={onCartClick}
            className="relative flex items-center gap-2 bg-white/[0.04] border border-white/[0.09] rounded-full px-4 h-[38px] text-[#8e8e93] cursor-pointer flex-shrink-0 transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-[#f5f5f7]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span className="hidden md:inline text-[13px] font-normal tracking-wide">Cart</span>
            <span className={`absolute -top-[7px] -right-[6px] min-w-[20px] h-5 text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-[1.5px] border-[#111113] transition-all duration-300 ${cartCount > 0 ? "scale-100 text-[#0a0a0c]" : "scale-[0.85] text-[#48484a] bg-white/[0.1]"}`}
              style={cartCount > 0 ? { background: "linear-gradient(135deg, #d4a843, #b8862e)" } : {}}>
              {cartCount}
            </span>
          </button>

          <button className={`md:hidden bg-transparent border-none cursor-pointer flex items-center transition-colors duration-200 ${mobileMenuOpen ? "text-[#d4a843]" : "text-[#636366] hover:text-[#f5f5f7]"}`}
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileSearchOpen(false); }}>
            {mobileMenuOpen
              ? <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            }
          </button>
        </div>

        {mobileSearchOpen && (
          <div className="md:hidden px-5 py-3 bg-[#111113] border-t border-white/[0.06]">
            <SearchBox autoFocus />
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0e0e10] px-5 pt-1 pb-5">
            {NAV_LINKS.map((link) => (
              <button key={link.label} onClick={() => { if (link.path) navigate(link.path); setMobileMenuOpen(false); }}
                className={`flex items-center justify-between w-full py-[15px] text-[15px] bg-transparent border-none border-b border-white/[0.04] cursor-pointer text-left transition-colors duration-200 hover:text-[#f5f5f7] ${location.pathname === link.path ? "text-[#f5f5f7] font-medium" : "text-[#636366] font-normal"}`}>
                {link.label}
                {location.pathname === link.path && <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: "#d4a843" }} />}
              </button>
            ))}
            {user ? (
              <div className="mt-5">
                {/* Avatar block — now clickable, navigates to profile */}
                <button onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 py-3 border-b border-white/[0.04] w-full bg-transparent border-none cursor-pointer text-left transition-colors duration-200 hover:bg-white/[0.03]">
                  <UserAvatar size={38} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#f5f5f7] truncate">{user.displayName || "User"}</p>
                    <p className="text-[11px] text-[#48484a] truncate">{user.email}</p>
                  </div>
                </button>

                {/* My Profile link */}
                <button onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full py-3 text-[14px] text-[#8e8e93] bg-transparent border-none border-b border-white/[0.04] cursor-pointer text-left transition-colors duration-200 hover:text-[#f5f5f7]">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  My Profile
                </button>

                {/* My Orders link */}
                <button onClick={() => { navigate("/orders"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full py-3 text-[14px] text-[#8e8e93] bg-transparent border-none border-b border-white/[0.04] cursor-pointer text-left transition-colors duration-200 hover:text-[#f5f5f7]">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                  My Orders
                </button>

                {isAdmin && (
                  <button onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full mt-4 py-3.5 border border-[#d4a843]/30 rounded-xl text-[#d4a843] text-sm font-semibold cursor-pointer bg-[#d4a843]/[0.08] transition-colors duration-200 justify-center hover:bg-[#d4a843]/[0.14]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7.65 7.65 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.28z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Panel
                  </button>
                )}
                <button onClick={handleLogout}
                  className="flex items-center gap-2 w-full mt-4 py-3.5 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium cursor-pointer bg-red-500/[0.05] transition-colors duration-200 justify-center hover:bg-red-500/[0.1]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2.5 mt-5">
                <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                  className="flex-1 py-3.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-[#f5f5f7] text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-white/[0.08]">
                  Login
                </button>
                <button onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }}
                  className="flex-1 py-3.5 border-none rounded-xl text-[#0a0a0c] text-sm font-bold cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
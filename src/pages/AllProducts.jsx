import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProducts } from "../utils/useProducts.js";
import ProductCard from "../components/ProductCard";

const categories = (products) => ["All", ...new Set(products.map((p) => p.category))];
const PER_PAGE = 15;

export default function AllProducts() {
  const navigate      = useNavigate();
  const location      = useLocation();
  const { products, loading } = useProducts();

  const incomingSearch = location.state?.search || "";
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery]       = useState(incomingSearch);
  const [sortBy, setSortBy]                 = useState("default");
  const [currentPage, setCurrentPage]       = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (location.state?.search) setSearchQuery(location.state.search);
  }, [location.state?.search]);

  // Reset to page 1 whenever filters change so user doesn't land on an empty page
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  const filtered = products
    .filter((p) => activeCategory === "All" ? true : p.category === activeCategory)
    .filter((p) =>
      searchQuery.trim() === ""
        ? true
        : p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const price = (str) => parseFloat((str || "0").replace(/[^0-9.]/g, ""));
      if (sortBy === "price-asc")  return price(a.price) - price(b.price);
      if (sortBy === "price-desc") return price(b.price) - price(a.price);
      if (sortBy === "rating")     return b.rating - a.rating;
      return 0;
    });

  const cats = categories(products);

  // ── Pagination math ──────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + PER_PAGE);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build a compact page number list e.g. 1 2 3 … 8
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans">

      {/* Top Bar */}
      <div className="bg-white border-b border-[#e4e7ec] px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-[#eef1f7] border-none flex items-center justify-center cursor-pointer text-[#555] text-lg flex-shrink-0 hover:bg-[#e0e4ef] transition-colors">
          ‹
        </button>
        <h1 className="text-xl font-bold text-[#111] m-0">All Products</h1>
        <span className="ml-auto text-[13px] text-[#888] font-medium">
          {loading ? "Loading…" : `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      <div className="px-4 sm:px-6 py-6">

        {/* Search + Filters */}
        <div className="max-w-[1280px] mx-auto mb-7 flex flex-col gap-3.5">
          <div className="flex items-center bg-white border border-[#e4e7ec] rounded-full px-4 h-[42px] max-w-[440px] gap-2.5">
            <svg width="15" height="15" fill="none" stroke="#aaa" strokeWidth={2} viewBox="0 0 24 24" className="flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="flex-1 border-none bg-transparent outline-none text-[13px] text-[#111] placeholder-[#aaa]" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}
                className="bg-transparent border-none cursor-pointer text-[#aaa] text-base leading-none hover:text-[#555] transition-colors">×</button>
            )}
          </div>

          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {cats.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold border-none cursor-pointer transition-all duration-150 ${
                    activeCategory === cat ? "bg-[#1565c0] text-white" : "bg-[#eef1f7] text-[#555] hover:bg-[#e0e4ef]"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#e4e7ec] rounded-full px-4 py-1.5 text-xs font-semibold text-[#555] cursor-pointer outline-none hover:border-[#c0c8d8] transition-colors">
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Grid - Fixed: Removed scaling that was breaking the modal */}
        {loading ? (
          <div className="text-center py-20 text-[#aaa] text-sm">Loading products…</div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 max-w-[1280px] mx-auto">
              {paginated.map((product) => (
                <ProductCard key={product.id || product.firestoreId} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                {/* Prev */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-full bg-white border border-[#e4e7ec] flex items-center justify-center text-[#555] cursor-pointer transition-colors hover:bg-[#eef1f7] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="text-[#aaa] text-sm px-1">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`min-w-[36px] h-9 px-2 rounded-full text-sm font-semibold border-none cursor-pointer transition-colors ${
                        p === currentPage
                          ? "bg-[#1565c0] text-white"
                          : "bg-white border border-[#e4e7ec] text-[#555] hover:bg-[#eef1f7]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-full bg-white border border-[#e4e7ec] flex items-center justify-center text-[#555] cursor-pointer transition-colors hover:bg-[#eef1f7] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Page info */}
            <p className="text-center text-[12px] text-[#aaa] mt-4">
              Showing {startIndex + 1}–{Math.min(startIndex + PER_PAGE, filtered.length)} of {filtered.length} products
            </p>
          </>
        ) : (
          <div className="text-center py-20 px-6 text-[#aaa] text-[15px]">
            No products found{searchQuery ? ` for "${searchQuery}"` : " in this category"}.
          </div>
        )}
      </div>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { useProducts } from "../utils/useProducts.js";
import ProductCard from "./ProductCard";

function SectionHeader({ title, onMoreClick }) {
  return (
    <div className="flex justify-between items-center max-w-[1280px] mx-auto mb-5 px-4 sm:px-6">
      <h2 className="text-[18px] sm:text-[22px] font-bold text-[#111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {title}
      </h2>
      <button onClick={onMoreClick}
        className="bg-[#eef1f7] border-none rounded-full px-4 py-1.5 text-[12px] sm:text-[13px] text-[#555] cursor-pointer flex items-center gap-1 font-medium hover:bg-[#e0e4ef] transition-colors">
        More <span className="text-base">›</span>
      </button>
    </div>
  );
}

function CardGrid({ products }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 max-w-[1280px] mx-auto px-4 sm:px-6">
      {products.map((p) => (
        <ProductCard key={p.id || p.firestoreId} product={p} />
      ))}
    </div>
  );
}

export default function ProductGrid() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const grid1 = products.filter((p) => p.grid === 1);
  const grid2 = products.filter((p) => p.grid === 2);

  if (loading) return (
    <div className="bg-[#f4f6f9] py-16 text-center text-[#aaa] text-sm">Loading products…</div>
  );

  return (
    <div className="bg-[#f4f6f9] min-h-[200px] py-8 font-sans">
      <section className="mb-10">
        <SectionHeader title="The Best Offers" onMoreClick={() => navigate("/products")} />
        <CardGrid products={grid1} />
      </section>
      <div className="max-w-[1280px] mx-auto mb-10 border-t-[1.5px] border-[#e4e7ec] px-6" />
      <section>
        <SectionHeader title="Latest iPhones & More" onMoreClick={() => navigate("/products")} />
        <CardGrid products={grid2} />
      </section>
    </div>
  );
}
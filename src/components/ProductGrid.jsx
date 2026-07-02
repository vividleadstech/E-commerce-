import { useNavigate } from "react-router-dom";
import { useProducts } from "../utils/useProducts";
import ProductCard from "./ProductCard";

function SectionHeader({ title, onMoreClick }) {
  return (
    <div className="flex justify-between items-center max-w-[1160px] mx-auto mb-5">
      <h2 className="text-[22px] font-bold text-[#111] m-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {title}
      </h2>
      <button onClick={onMoreClick} className="bg-[#eef1f7] border-none rounded-full px-5 py-2 text-[13px] text-[#555] cursor-pointer flex items-center gap-1 font-medium hover:bg-[#e0e4ef] transition-colors">
        More Products <span className="text-base">›</span>
      </button>
    </div>
  );
}

function CardRow({ products }) {
  return (
    <div className="flex gap-4 max-w-[1160px] mx-auto flex-wrap justify-center">
      {products.map((p) => <ProductCard key={p.id || p.firestoreId} product={p} />)}
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
    <div className="bg-[#f4f6f9] min-h-screen py-8 px-6 font-sans">
      <section className="mb-12">
        <SectionHeader title="The Best Offers" onMoreClick={() => navigate("/products")} />
        <CardRow products={grid1} />
      </section>
      <div className="max-w-[1160px] mx-auto mb-12 border-t-[1.5px] border-[#e4e7ec]" />
      <section>
        <SectionHeader title="Latest iPhones & More" onMoreClick={() => navigate("/products")} />
        <CardRow products={grid2} />
      </section>
    </div>
  );
}
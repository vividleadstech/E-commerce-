import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../Config";

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const q = query(
      collection(db, "orders"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [user, navigate]);

  if (!user) return null;

  const statusColor = (status) => ({
    Pending:   "text-yellow-400 bg-yellow-400/10",
    Completed: "text-green-400 bg-green-400/10",
    Dispatch:  "text-blue-400 bg-blue-400/10",
    Cancelled: "text-red-400 bg-red-400/10",
  }[status] || "text-[#636366] bg-white/[0.05]");

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans px-6 py-10">
      <div className="max-w-[680px] mx-auto">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#48484a] text-sm bg-transparent border-none cursor-pointer mb-8 p-0 transition-colors hover:text-[#aeaeb2]">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-2xl font-medium text-[#f5f5f7] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          My Orders
        </h1>
        <p className="text-[13px] text-[#48484a] mb-7">
          {loading ? "Loading…" : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
        </p>

        {loading ? (
          <div className="text-center py-16 text-[#3a3a3c] text-sm">Loading your orders…</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center bg-[#111113] border border-white/[0.07] rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3a3a3c]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <div>
              <p className="text-[#636366] text-sm font-medium">No orders yet</p>
              <p className="text-[#3a3a3c] text-xs mt-1">Your order history will appear here</p>
            </div>
            <button onClick={() => navigate("/products")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a0a0c] border-none cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-[#111113] border border-white/[0.07] rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-[#f5f5f7]">Order #{o.id.slice(0, 6)}</p>
                  <p className="text-[11px] text-[#48484a] mt-0.5">
                    {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : "—"}
                  </p>
                </div>
                <span className="text-sm font-semibold" style={{ color: "#d4a843" }}>
                  ${o.total?.toLocaleString() || "0"}
                </span>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColor(o.status)}`}>
                  {o.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
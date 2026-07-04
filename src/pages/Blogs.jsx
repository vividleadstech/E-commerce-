import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FEEDS = [
  {
    id: "apple",
    label: "Apple",
    color: "#d4a843",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.macrumors.com/MacRumors-All&count=6",
  },
  {
    id: "playstation",
    label: "PlayStation",
    color: "#1565c0",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.181.76.814.76 1.505v5.875c2.441 1.193 4.362-.005 4.362-3.236 0-3.323-1.153-4.724-4.514-5.853-1.216-.406-3.393-.902-4.317-.392zM2 17.208l4.231 1.798V15.51L2 14.08v3.128zm0-4.926l4.231 1.798v-3.496L2 8.856v3.426zm0-4.926l4.231 1.798V5.658L2 3.93v3.426z"/>
      </svg>
    ),
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://blog.playstation.com/feed/&count=6",
  },
];

const FALLBACK = {
  apple: [
    { title: "Apple Intelligence arrives on iPhone and Mac", pubDate: "2025-09-15", description: "Apple's new AI-powered features roll out to iPhone 16 and Mac users globally, bringing writing tools, image generation, and Siri improvements.", link: "https://www.apple.com/newsroom/" },
    { title: "iPhone 17 series officially announced", pubDate: "2025-09-09", description: "Apple unveils the iPhone 17 lineup featuring the ultra-thin iPhone 17 Air, the powerhouse 17 Pro Max, and the brand-new A19 chip.", link: "https://www.apple.com/newsroom/" },
    { title: "Apple Watch Series 10 brings sleep apnea detection", pubDate: "2025-09-09", description: "The thinnest Apple Watch yet gains FDA-cleared sleep apnea alerts and a larger, always-on display.", link: "https://www.apple.com/newsroom/" },
    { title: "macOS Sequoia lands with iPhone mirroring", pubDate: "2025-09-16", description: "macOS Sequoia introduces iPhone Mirroring, window tiling, and major gaming improvements to the Mac platform.", link: "https://www.apple.com/newsroom/" },
    { title: "Apple's M4 MacBook Pro reviewed", pubDate: "2025-11-08", description: "The M4 MacBook Pro delivers stunning performance gains, especially in AI workloads, with up to 24 hours of battery life.", link: "https://www.apple.com/newsroom/" },
    { title: "AirPods 4 introduce active noise cancellation", pubDate: "2025-09-09", description: "The standard AirPods finally get ANC at an accessible price point, alongside a new H2 chip for improved audio performance.", link: "https://www.apple.com/newsroom/" },
  ],
  playstation: [
    { title: "PS5 Pro delivers 45% faster rendering", pubDate: "2025-11-07", description: "Sony's PS5 Pro launches with PlayStation Spectral Super Resolution and a supercharged GPU for 4K gaming at 60fps.", link: "https://blog.playstation.com" },
    { title: "God of War: Ragnarök comes to PC", pubDate: "2025-09-19", description: "Kratos and Atreus's Norse saga finally arrives on PC with full ultra-wide support, NVIDIA DLSS, and unlocked frame rates.", link: "https://blog.playstation.com" },
    { title: "PlayStation Plus new games for December 2025", pubDate: "2025-11-27", description: "This month's PS Plus lineup includes multiple award-winning AAA titles across Essential, Extra, and Premium tiers.", link: "https://blog.playstation.com" },
    { title: "Gran Turismo 7 update adds 8 new cars", pubDate: "2025-10-10", description: "Polyphony Digital drops the latest GT7 update featuring classic Ferrari and Lamborghini models plus new circuit layouts.", link: "https://blog.playstation.com" },
    { title: "Spider-Man 2 swings to PC in early 2026", pubDate: "2025-09-25", description: "Insomniac's critically acclaimed Marvel's Spider-Man 2 is coming to PC with all post-launch content included at launch.", link: "https://blog.playstation.com" },
    { title: "PSVR2 adds eye-tracking PC support", pubDate: "2025-08-22", description: "Sony's PSVR2 headset can now connect to PC via USB, unlocking access to hundreds of SteamVR titles for existing owners.", link: "https://blog.playstation.com" },
  ],
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

function ArticleCard({ article, accent }) {
  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer"
      className="block bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] no-underline group">
      {article.thumbnail && !article.thumbnail.includes("logo") ? (
        <div className="w-full h-44 overflow-hidden bg-[#18181b]">
          <img src={article.thumbnail} alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.parentElement.style.display = "none"; }} />
        </div>
      ) : (
        <div className="w-full h-2 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      )}
      <div className="p-5">
        <p className="text-[11px] text-[#636366] mb-2">{timeAgo(article.pubDate)}</p>
        <h3 className="text-[14px] font-medium text-[#f5f5f7] leading-snug mb-2 line-clamp-2 group-hover:text-[#d4a843] transition-colors">
          {article.title}
        </h3>
        <p className="text-[12px] text-[#636366] leading-relaxed line-clamp-3">
          {stripHtml(article.description || article.content || "")}
        </p>
        <div className="flex items-center gap-1 mt-4" style={{ color: accent }}>
          <span className="text-[11px] font-semibold">Read more</span>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </a>
  );
}

export default function Blogs() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState({ apple: [], playstation: [] });
  const [loading, setLoading]   = useState({ apple: true, playstation: true });
  const [activeTab, setActiveTab] = useState("apple");

  useEffect(() => {
    FEEDS.forEach(async (feed) => {
      try {
        const res = await fetch(feed.url);
        const data = await res.json();
        if (data.status === "ok" && data.items?.length > 0) {
          setArticles((prev) => ({ ...prev, [feed.id]: data.items }));
        } else {
          setArticles((prev) => ({ ...prev, [feed.id]: FALLBACK[feed.id] }));
        }
      } catch {
        setArticles((prev) => ({ ...prev, [feed.id]: FALLBACK[feed.id] }));
      } finally {
        setLoading((prev) => ({ ...prev, [feed.id]: false }));
      }
    });
  }, []);

  const activeFeed = FEEDS.find((f) => f.id === activeTab);
  const activeArticles = articles[activeTab];
  const isLoading = loading[activeTab];

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans">

      <div className="bg-[#111113] border-b border-white/[0.07] px-6 py-5 flex items-center gap-4">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#636366] cursor-pointer transition-colors hover:bg-white/[0.1] hover:text-[#f5f5f7]">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-[#f5f5f7] text-[20px] font-medium" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Tech Blogs
          </h1>
          <p className="text-[12px] text-[#48484a]">Latest news from the tech world</p>
        </div>
      </div>

      <div className="max-w-[1160px] mx-auto px-6 py-8">

        <div className="flex gap-3 mb-8">
          {FEEDS.map((feed) => (
            <button key={feed.id} onClick={() => setActiveTab(feed.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold border-none cursor-pointer transition-all duration-200 ${
                activeTab === feed.id ? "text-[#0a0a0c]" : "bg-white/[0.05] text-[#636366] hover:bg-white/[0.08] hover:text-[#f5f5f7]"
              }`}
              style={activeTab === feed.id ? { background: `linear-gradient(135deg, ${feed.color}, ${feed.color}cc)` } : {}}>
              <span style={{ color: activeTab === feed.id ? "#0a0a0c" : feed.color }}>{feed.icon}</span>
              {feed.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 rounded-full" style={{ background: activeFeed.color }} />
          <h2 className="text-[15px] font-medium text-[#f5f5f7]">{activeFeed.label} News</h2>
          {!isLoading && (
            <span className="text-[11px] text-[#48484a] ml-auto">{activeArticles.length} articles</span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="w-full h-44 bg-white/[0.04] animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-white/[0.04] rounded-full w-1/4 animate-pulse" />
                  <div className="h-4 bg-white/[0.06] rounded-full animate-pulse" />
                  <div className="h-4 bg-white/[0.06] rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-white/[0.03] rounded-full animate-pulse" />
                  <div className="h-3 bg-white/[0.03] rounded-full w-5/6 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeArticles.map((article, i) => (
              <ArticleCard key={i} article={article} accent={activeFeed.color} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
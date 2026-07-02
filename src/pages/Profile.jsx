import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db } from "../Config";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName]     = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(user, { displayName: name });
      await updateDoc(doc(db, "users", user.uid), { displayName: name });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-[#f5f5f7] outline-none focus:border-[#d4a843]/50 transition-colors";
  const lbl = "block text-[11px] font-medium tracking-[0.1em] uppercase text-[#48484a] mb-2";

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans px-6 py-10">
      <div className="max-w-[480px] mx-auto">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#48484a] text-sm bg-transparent border-none cursor-pointer mb-8 p-0 transition-colors hover:text-[#aeaeb2]">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-2xl font-medium text-[#f5f5f7] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          My Profile
        </h1>
        <p className="text-[13px] text-[#48484a] mb-7">Manage your account details</p>

        <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            {user.photoURL
              ? <img src={user.photoURL} referrerPolicy="no-referrer" className="w-16 h-16 rounded-full object-cover border-2 border-[#d4a843]/30" />
              : <span className="w-16 h-16 rounded-full flex items-center justify-center text-[#0a0a0c] text-xl font-bold"
                  style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>
                  {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                </span>}
            <div>
              <p className="text-sm font-medium text-[#f5f5f7]">{user.displayName || "User"}</p>
              <p className="text-[12px] text-[#48484a]">{user.email}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className={lbl}>Display Name</label>
            <input className={inp} value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="mb-5">
            <label className={lbl}>Email</label>
            <input className={inp} value={user.email || ""} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
          </div>

          <div className="mb-6">
            <label className={lbl}>Member Since</label>
            <input className={inp} value={user.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : "—"} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
          </div>

          <button onClick={handleSave} disabled={saving}
            className="w-full py-3 rounded-xl text-sm font-bold text-[#0a0a0c] border-none cursor-pointer transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#d4a843,#b8862e)" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
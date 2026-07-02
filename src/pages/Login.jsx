import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { handleGoogleLogin, handleEmailLogin } from "../Config";
import admins from "../admin.json";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Redirect based on whether the signed-in UID is an admin
  const redirectAfterAuth = (user) => {
     console.log("Logged in UID:", user.uid);
  console.log("Admin UIDs:", admins.adminUIDs);
    if (admins.adminUIDs.includes(user.uid)) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await handleEmailLogin(email, password);
      redirectAfterAuth(user);
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "Incorrect email or password."
          : err.code === "auth/user-not-found"
          ? "No account found with this email."
          : "Sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await handleGoogleLogin();
      redirectAfterAuth(user);
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex relative overflow-hidden font-sans">
      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 70%)", top: "-200px", left: "-200px" }} />
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,168,67,0.05) 0%, transparent 70%)", bottom: "-100px", right: "-100px" }} />

      <div className="flex-1 flex flex-col justify-center px-10 py-16 md:px-20 relative z-10">

        <button onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-[#48484a] text-sm bg-transparent border-none cursor-pointer mb-12 p-0 w-fit transition-colors duration-200 hover:text-[#aeaeb2]">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to store
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)", boxShadow: "0 4px 16px rgba(212,168,67,0.2)" }}>
              <svg width="16" height="16" fill="#0a0a0c" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-[#f5f5f7] text-xl tracking-wide" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
              Vivid <em className="not-italic font-light" style={{ color: "#d4a843" }}>Tech</em>
            </span>
          </div>
          <h1 className="text-[#f5f5f7] leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", fontWeight: 500 }}>
            Welcome back.
          </h1>
          <p className="text-sm text-[#48484a] tracking-wide">Sign in to your account to continue shopping.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
            <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth={2} viewBox="0 0 24 24" className="flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <button onClick={handleGoogle} disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm text-[#8e8e93] border border-white/10 bg-white/[0.04] cursor-pointer mb-2 transition-all duration-200 hover:bg-white/[0.07] hover:border-white/[0.15] hover:text-[#f5f5f7] disabled:opacity-50 disabled:cursor-not-allowed">
          <FcGoogle size={18} />
          {loading ? "Connecting…" : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[10px] tracking-[0.1em] uppercase text-[#3a3a3c]">or sign in with email</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#48484a] mb-2">Email address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-[#f5f5f7] outline-none tracking-wide transition-all duration-200 placeholder-[#3a3a3c] focus:border-[#d4a843]/40 focus:bg-white/[0.05]" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#48484a]">Password</label>
              <a href="#" className="text-[11px] text-[#d4a843] no-underline transition-opacity hover:opacity-75">Forgot password?</a>
            </div>
            <div className="relative">
              <input type={showPass ? "text" : "password"} placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 pr-11 text-sm text-[#f5f5f7] outline-none tracking-wide transition-all duration-200 placeholder-[#3a3a3c] focus:border-[#d4a843]/40 focus:bg-white/[0.05]" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#48484a] flex items-center transition-colors duration-200 hover:text-[#aeaeb2]">
                {showPass ? (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-[#0a0a0c] tracking-wide border-none cursor-pointer mt-2 transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)" }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-[#48484a] mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#d4a843] no-underline transition-opacity hover:opacity-75">Create one</Link>
        </p>
      </div>

      <div className="hidden md:flex w-[420px] flex-col items-center justify-center px-10 py-16 relative overflow-hidden border-l border-white/[0.05]"
        style={{ background: "linear-gradient(160deg, #111113 0%, #0d0d10 100%)" }}>
        <div className="absolute w-[300px] h-[300px] rounded-full border border-[#d4a843]/[0.08] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[180px] h-[180px] rounded-full border border-[#d4a843]/[0.12] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-[18px] flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, #d4a843 0%, #b8862e 100%)", boxShadow: "0 8px 32px rgba(212,168,67,0.3)" }}>
            <svg width="30" height="30" fill="#0a0a0c" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-[#f5f5f7] leading-tight mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", fontWeight: 500 }}>
            The future of<br /><em className="not-italic" style={{ color: "#d4a843" }}>tech retail.</em>
          </h2>
          <p className="text-sm text-[#48484a] leading-relaxed max-w-[240px] mx-auto">
            Access exclusive deals, track your orders, and manage your wishlist — all in one place.
          </p>
          <div className="flex flex-col gap-2.5 mt-8">
            {["Exclusive member pricing", "Order tracking", "Faster checkout"].map((f) => (
              <div key={f} className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#d4a843" }} />
                <span className="text-xs text-[#636366] tracking-wide">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
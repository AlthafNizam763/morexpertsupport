"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("more_auth");
    if (auth === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate network delay
    setTimeout(() => {
      if (userId === "Ajmal@321" && passkey === "Expert321") {
        localStorage.setItem("more_auth", "true");
        localStorage.setItem("more_user", userId);
        router.push("/dashboard");
      } else {
        setError("Invalid User ID or Passkey. Please try again.");
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b72b5] via-[#0f4c81] to-[#041e42] flex items-center justify-center p-6 selection:bg-white/30 selection:text-white relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/20">

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-white to-white/80 rounded-2xl flex items-center justify-center p-3 mb-6 shadow-lg shadow-black/10 border border-white/40">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                alt="MoRe Experts Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">MoRe Experts</h1>
            <div className="flex items-center gap-1.5 mt-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em]">Secure Portal</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest pl-4">
                User ID
              </label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your ID"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/30 transition-all placeholder:text-white/20 font-medium text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest pl-4">
                Access Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/30 transition-all placeholder:text-white/20 font-medium text-white"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-100 text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-[#1b72b5] rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-black/10 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-blue-200/60 font-medium tracking-wide">
            Protected by MoRe Security Systems
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-blue-200/40 font-medium">
          © 2026 MoRe Experts Professional Services
        </p>
      </motion.div>
    </div>
  );
}

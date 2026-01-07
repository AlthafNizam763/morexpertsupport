"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";
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
      if (userId === "bondi" && passkey === "123456") {
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
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 selection:bg-slate-blue selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center p-4 mb-6 shadow-2xl overflow-hidden border border-black/5">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=MoRe"
              alt="MoRe Experts Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">MoRe Experts</h1>
          <p className="text-ash mt-2 text-sm font-medium uppercase tracking-[0.2em]">Support Portal</p>
        </div>

        <div className="bg-white dark:bg-dark border border-ash/10 rounded-3xl p-8 shadow-xl">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black dark:text-white">Welcome back</h2>
            <p className="text-ash text-sm mt-1">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-ash uppercase tracking-widest pl-1">
                User ID
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-5 h-5 text-ash" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID"
                  required
                  className="w-full bg-secondary-white dark:bg-black border border-ash/10 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-black dark:text-white placeholder:text-ash/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-ash uppercase tracking-widest pl-1">
                Passkey
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-ash" />
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-secondary-white dark:bg-black border border-ash/10 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-slate-blue transition-all text-black dark:text-white placeholder:text-ash/50"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-4 rounded-xl bg-red-light border border-red-500/10 text-black text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4 text-red-500" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-blue text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-slate-blue/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Login to Support
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-600 leading-relaxed uppercase tracking-widest font-medium">
            Contact your administrator if you&apos;ve lost your passkey.
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
          © 2026 MoRe Experts Professional Services
        </p>
      </motion.div>
    </div>
  );
}

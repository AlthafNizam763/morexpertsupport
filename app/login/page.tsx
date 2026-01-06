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
            router.push("/");
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
                router.push("/");
            } else {
                setError("Invalid User ID or Passkey. Please try again.");
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-6 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center p-4 mb-6 shadow-2xl">
                        <img
                            src="/logo.png"
                            alt="MoRe Experts Logo"
                            className="w-full h-full object-contain invert brightness-200"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">MoRe Experts</h1>
                    <p className="text-zinc-500 mt-2 text-sm font-medium uppercase tracking-[0.2em]">Support Portal</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Welcome back</h2>
                        <p className="text-zinc-500 text-sm mt-1">Please enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
                                User ID
                            </label>
                            <div className="relative flex items-center">
                                <User className="absolute left-4 w-5 h-5 text-zinc-400" />
                                <input
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="Enter User ID"
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
                                Passkey
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 text-zinc-400" />
                                <input
                                    type="password"
                                    value={passkey}
                                    onChange={(e) => setPasskey(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black dark:bg-white text-white dark:text-black rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-black/10"
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

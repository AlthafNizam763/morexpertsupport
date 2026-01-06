"use client";

import Image from "next/image";

import Link from "next/link";
import { HelpCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem("more_auth");
        setTimeout(() => setIsAuth(auth === "true"), 0);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("more_auth");
        localStorage.removeItem("more_user");
        router.push("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-black/80 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-black rounded-xl flex items-center justify-center p-2 shadow-lg">
                        <Image
                            src="/logo.png"
                            alt="MoRe Experts Logo"
                            width={40}
                            height={40}
                            className="w-full h-full object-contain invert brightness-200"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
                        MoRe Experts <span className="text-zinc-400 dark:text-zinc-500 font-normal">Support</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="#"
                        className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                        App Guide
                    </Link>
                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />

                    {isAuth && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    )}

                    <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                        <HelpCircle className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

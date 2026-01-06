"use client";

import { Home, MessageSquare, FileText, Settings, Clock, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: FileText, label: "Services", href: "#" },
    { icon: MessageSquare, label: "Chat", href: "#" },
    { icon: Clock, label: "History", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-20 lg:w-24 h-screen bg-black flex flex-col items-center py-8 fixed left-0 top-0 z-[60]">
            <div className="mb-12">
                <Menu className="w-6 h-6 text-zinc-500 cursor-pointer hover:text-white transition-colors" />
            </div>

            <div className="flex-1 flex flex-col gap-8">
                <div className="bg-white rounded-2xl p-3 flex items-center justify-center shadow-lg group cursor-pointer hover:scale-105 transition-transform">
                    <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                </div>

                <nav className="flex flex-col gap-6">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "p-3 rounded-2xl transition-all duration-300 group relative",
                                    isActive
                                        ? "bg-white text-black"
                                        : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                                )}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-800 cursor-pointer hover:border-white transition-colors">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="Avatar" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    );
}

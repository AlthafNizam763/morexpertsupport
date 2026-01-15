"use client";

import { Home, MessageSquare, FileText, Settings, Clock, Menu, Users, Bell, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    // { icon: FileText, label: "Services", href: "#" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    // { icon: Clock, label: "History", href: "#" },
    // { icon: Settings, label: "Settings", href: "#" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("more_auth");
        router.push("/");
    };

    return (
        <div className="w-24 h-screen bg-slate-blue flex flex-col items-center py-10 fixed left-0 top-0 z-[60] shadow-xl">
            <div className="mb-10">
                <Menu className="w-6 h-6 text-white cursor-pointer hover:scale-110 transition-transform" />
            </div>

            <nav className="flex flex-col gap-8">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 group relative",
                                isActive
                                    ? "bg-white text-slate-blue shadow-lg scale-110"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />

                            {/* Label Tooltip */}
                            <span className="absolute left-full ml-6 px-3 py-1.5 bg-secondary text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest border border-ash/20 shadow-2xl">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col items-center gap-8 pb-10">
                <button
                    onClick={handleLogout}
                    className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300 group relative"
                >
                    <LogOut className="w-6 h-6 stroke-[2px]" />
                    <span className="absolute left-full ml-6 px-3 py-1.5 bg-secondary text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest shadow-2xl">
                        Logout
                    </span>
                </button>

                {/* <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-dark cursor-pointer hover:border-white transition-all transform hover:scale-110 shadow-lg flex items-center justify-center bg-zinc-900">
                    <User className="w-6 h-6 text-ash" />
                </div> */}
            </div>
        </div>
    );
}

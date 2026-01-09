"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import {
    Search,
    Bell,
    Plus,
    ChevronDown,
    FileText,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    Settings,
    User,
    Mail,
    Shield,
    Activity,
    Users
} from "lucide-react";
import { motion } from "framer-motion";

interface UserData {
    _id: string;
    name: string;
    email: string;
    package: string;
    status: "Active" | "Inactive";
    profilePic?: string;
}

interface Notification {
    _id: string;
    title: string;
    description: string;
    time: string;
    type: "update" | "offer" | "success" | "warning";
    isRead: boolean;
}

export default function DashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<UserData[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const auth = localStorage.getItem("more_auth");
        if (auth !== "true") {
            router.push("/");
        } else {
            fetchData();
        }
    }, [router]);

    const fetchData = async () => {
        try {
            const [usersRes, notifRes] = await Promise.all([
                fetch("/api/users"),
                fetch("/api/notifications")
            ]);

            let usersData = [];
            let notifData = [];

            if (usersRes.ok) {
                usersData = await usersRes.json();
            }

            if (notifRes.ok) {
                notifData = await notifRes.json();
            }

            // Ensure data is array before setting state
            setUsers(Array.isArray(usersData) ? usersData : []);
            setNotifications(Array.isArray(notifData) ? notifData : []);

            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            setUsers([]);
            setNotifications([]);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-ash/10 border-t-slate-blue rounded-full"
                />
            </div>
        );
    }

    const activeUsers = users.filter(u => u.status === "Active").length;
    const totalUsers = users.length;
    const activityPercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
    const recentUsers = users.slice(0, 3);
    const recentNotifications = notifications.slice(0, 3);

    const getPackageStyles = (pkg: string) => {
        switch (pkg) {
            case "Silver": return "bg-gradient-to-br from-[#C0C0C0] to-[#8E8E8E] text-white";
            case "Silver2": return "bg-gradient-to-br from-[#757575] to-[#424242] text-white";
            case "Golden": return "bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] text-white";
            case "Golden2": return "bg-gradient-to-br from-[#F5A623] to-[#D48806] text-black";
            case "Premium": return "bg-gradient-to-br from-[#0F0F0B] to-[#1C1C1C] text-white";
            default: return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans flex text-zinc-900 dark:text-white selection:bg-slate-blue selection:text-white">
            <Sidebar />

            <main className="flex-1 ml-24 p-10 max-w-[1600px] mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-12 flex-1">
                        <h1 className="text-[2.5rem] font-bold tracking-tight">Dashboard</h1>
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl py-4 pl-14 pr-6 text-sm focus:outline-none shadow-sm placeholder:text-zinc-400 border border-black/5 dark:border-white/5"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="w-12 h-12 bg-slate-blue text-white flex items-center justify-center rounded-2xl shadow-xl hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                        </button>
                        <Link href="/notifications" className="relative p-2">
                            <Bell className="w-6 h-6 text-ash" />
                            {notifications.some(n => !n.isRead) && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink rounded-full border-2 border-white dark:border-black" />
                            )}
                        </Link>
                        <div className="flex items-center gap-4 ml-4">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 shadow-sm border border-black/5 dark:border-white/10" />
                            <div className="hidden lg:block">
                                <p className="text-sm font-bold leading-tight uppercase tracking-tight">Bondi R</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Support Lead</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    <div className="xl:col-span-8 space-y-10">
                        {/* Recent Users Section */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold tracking-tight">Recent Users</h2>
                                <Link href="/users" className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-5 py-2.5 rounded-2xl text-[13px] font-bold shadow-sm cursor-pointer border border-black/5 dark:border-white/10 hover:bg-zinc-50 transition-colors">
                                    View All <ChevronDown className="w-4 h-4 text-zinc-400 -rotate-90" />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center justify-between p-4 rounded-[2rem] hover:bg-ash/5 dark:hover:bg-ash/10 border border-transparent transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                {user.profilePic ? (
                                                    <img src={user.profilePic} className="w-14 h-14 rounded-2xl object-cover bg-zinc-100" />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                        <User className="w-6 h-6 text-zinc-400" />
                                                    </div>
                                                )}
                                                <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-black rounded-full", user.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-400')} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base">{user.name}</h4>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-16">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                                getPackageStyles(user.package || "None")
                                            )}>
                                                {user.package || "No Package"}
                                            </span>
                                            <button className="p-2 text-zinc-300 hover:text-black dark:hover:text-white transition-colors">
                                                <MoreHorizontal className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {recentUsers.length === 0 && (
                                    <div className="p-8 text-center text-zinc-400 font-bold">No users found</div>
                                )}
                            </div>
                        </div>

                        {/* Recent Notifications Section */}
                        <div className="grid lg:grid-cols-12 gap-10 items-start">
                            <div className="lg:col-span-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold tracking-tight">Recent Notifications</h2>
                                    <Link href="/notifications" className="text-xs font-bold text-zinc-400 hover:text-slate-blue transition-colors">View All</Link>
                                </div>

                                <div className="space-y-4">
                                    {recentNotifications.map((notif) => (
                                        <div key={notif._id} className="flex items-center justify-between p-4 bg-white dark:bg-black shadow-sm border border-ash/10 rounded-[1.75rem] group">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                                                    notif.type === 'offer' ? "bg-emerald-500/10 text-emerald-500" :
                                                        notif.type === 'warning' ? "bg-amber-500/10 text-amber-500" :
                                                            "bg-blue-500/10 text-blue-500"
                                                )}>
                                                    <Bell className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm">{notif.title}</h4>
                                                    <p className="text-[11px] font-medium text-zinc-400 max-w-[200px] truncate">{notif.description}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{notif.time}</span>
                                        </div>
                                    ))}
                                    {recentNotifications.length === 0 && (
                                        <div className="p-8 text-center text-zinc-400 font-bold bg-white dark:bg-zinc-900 rounded-[2rem] border border-ash/10">
                                            Time for a coffee break ☕<br />No new notifications.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats Card: Quick Add */}
                            <div className="lg:col-span-4 h-full">
                                <div className="bg-slate-blue text-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-blue/20 text-center flex flex-col items-center h-full border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                    <div className="relative mb-6">
                                        <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center backdrop-blur-md">
                                            <User className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black">{totalUsers} Users</h3>
                                    <p className="text-[11px] text-white/60 font-bold uppercase tracking-widest mt-1 mb-8">Registered on Platform</p>
                                    <Link href="/users" className="w-full py-4 bg-white text-slate-blue rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all mt-auto">
                                        Manage Users
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="xl:col-span-4 space-y-10">
                        <section className="bg-white dark:bg-black rounded-[3rem] p-10 border border-black/5 dark:border-white/10 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-xl font-black">Quick Stats</h2>
                                <Activity className="w-5 h-5 text-zinc-300" />
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">Total Users</h4>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{totalUsers} Registered</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-lg">{totalUsers}</span>
                                </div>

                                <div className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">Active Users</h4>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{activeUsers} Online</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-lg">{activeUsers}</span>
                                </div>

                                <div className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 text-zinc-500">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">Premium</h4>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                                                {users.filter(u => u.package?.includes('Premium')).length} Users
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-black text-lg">{users.filter(u => u.package?.includes('Premium')).length}</span>
                                </div>
                            </div>

                            <div className="mt-16">
                                <h3 className="text-xl font-black mb-10">User Activity</h3>
                                <div className="flex flex-col items-center">
                                    <div className="relative w-48 h-48 mb-10">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle
                                                cx="50" cy="50" r="42"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="10"
                                                strokeDasharray="1 4"
                                                className="text-zinc-100 dark:text-zinc-800"
                                            />
                                            <circle
                                                cx="50" cy="50" r="42"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                strokeDasharray="264"
                                                strokeDashoffset={264 * (1 - (activityPercentage / 100))}
                                                strokeLinecap="round"
                                                className="text-slate-blue transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-[2.5rem] font-black tracking-tighter transition-all">{activityPercentage}%</span>
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Platform Load</span>
                                        </div>
                                        <div className="h-2 w-full bg-ash/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${activityPercentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-slate-blue rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

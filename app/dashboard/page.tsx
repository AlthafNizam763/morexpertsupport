"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import {
    Bell,
    ChevronDown,
    MoreHorizontal,
    Clock,
    Settings,
    User,
    MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface Feedback {
    id: string;
    createdAt: string;
    feedbackText: string;
    name: string;
    profilePic: string;
    rating: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<UserData[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

    useEffect(() => {
        if (feedbacks.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [feedbacks.length]);

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
            const [usersRes, notifRes, feedbackRes] = await Promise.all([
                fetch("/api/users"),
                fetch("/api/notifications"),
                fetch("/api/feedbacks")
            ]);

            let usersData = [];
            let notifData = [];
            let feedbackData = [];

            if (usersRes.ok) {
                usersData = await usersRes.json();
            }

            if (notifRes.ok) {
                notifData = await notifRes.json();
            }

            if (feedbackRes.ok) {
                feedbackData = await feedbackRes.json();
            }

            // Ensure data is array before setting state
            setUsers(Array.isArray(usersData) ? usersData : []);
            setNotifications(Array.isArray(notifData) ? notifData : []);
            setFeedbacks(Array.isArray(feedbackData) ? feedbackData : []);

            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            setUsers([]);
            setNotifications([]);
            setFeedbacks([]);
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

            <main className="flex-1 ml-24 p-8 w-full bg-gray-light min-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-blue">More Expert Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-slate-blue/10 flex items-center justify-center text-slate-blue">
                                <Bell className="w-5 h-5" />
                            </div>
                            {notifications.some(n => !n.isRead) && (
                                <span className="w-2 h-2 bg-pink rounded-full" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <div className="xl:col-span-8 space-y-8">
                        {/* Blue Banner */}
                        <div className="relative bg-slate-blue rounded-[2rem] p-8 md:p-10 text-white overflow-hidden shadow-lg shadow-slate-blue/20">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                                <div className="space-y-4 max-w-lg">
                                    <div className="flex items-center gap-2 text-blue-100 bg-white/10 w-fit px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold leading-tight">Good Day, Future Expert!</h1>
                                    <p className="text-blue-100 font-medium">Have a nice {new Date().toLocaleDateString('en-US', { weekday: 'short' })}! Check your dashboard for latest updates.</p>
                                </div>
                                <div className="hidden md:block">
                                    {/* Abstract Illustration Placeholder */}
                                    <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                                        <User className="w-24 h-24 text-white opacity-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40 group hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Users</span>
                                    <MoreHorizontal className="w-5 h-5 text-zinc-300" />
                                </div>
                                <div>
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-4xl font-bold text-slate-blue">{totalUsers}</span>
                                        <span className="text-xs font-bold text-emerald-500 mb-1.5">+2%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-blue w-[70%] rounded-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40 group hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Users</span>
                                    <MoreHorizontal className="w-5 h-5 text-zinc-300" />
                                </div>
                                <div>
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-4xl font-bold text-emerald-500">{activeUsers}</span>
                                        <span className="text-xs font-bold text-emerald-500 mb-1.5">Online</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[45%] rounded-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40 group hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Premium</span>
                                    <MoreHorizontal className="w-5 h-5 text-zinc-300" />
                                </div>
                                <div>
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-4xl font-bold text-purple-500">{users.filter(u => u.package?.includes('Premium')).length}</span>
                                        <span className="text-xs font-bold text-purple-500 mb-1.5">VIP</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[60%] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Users Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-lg font-bold tracking-tight text-slate-blue">Recent Activity</h2>
                                </div>

                                <div className="relative w-full aspect-square max-w-[250px] mx-auto mb-6 flex flex-col items-center justify-center">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#4D72F0" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 * (1 - (activityPercentage / 100))} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-slate-800">{activityPercentage}%</span>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Efficiency</span>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-8">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-slate-800">{totalUsers}</div>
                                        <div className="text-[10px] uppercase font-bold text-zinc-400">Total</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-emerald-500">{activeUsers}</div>
                                        <div className="text-[10px] uppercase font-bold text-zinc-400">Active</div>
                                    </div>

                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-lg font-bold tracking-tight text-slate-blue">Recent Users</h2>
                                    <Link href="/users" className="text-slate-blue font-bold text-xs hover:underline">See All</Link>
                                </div>

                                <div className="space-y-6">
                                    {recentUsers.map((user) => (
                                        <div key={user._id} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-blue group-hover:bg-slate-blue group-hover:text-white transition-colors">
                                                    {user.profilePic ? <img src={user.profilePic} className="w-full h-full rounded-2xl object-cover" /> : <User className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-800">{user.name}</h4>
                                                    <p className="text-[11px] text-zinc-400 font-medium">{user.package || "No Package"}</p>
                                                </div>
                                            </div>
                                            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-300 hover:bg-slate-50 hover:text-slate-blue transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="xl:col-span-4 space-y-8">
                        {/* Profile Card */}
                        <div className="bg-slate-blue rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lg shadow-slate-blue/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <h3 className="text-sm font-bold uppercase tracking-widest opacity-80">My Profile</h3>
                                <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 mx-auto rounded-full border-4 border-white/20 p-1 mb-4">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" className="w-full h-full rounded-full bg-white" />
                                </div>
                                <h2 className="text-xl font-bold mb-1">Ajmal</h2>
                                <p className="text-sm text-blue-100 uppercase tracking-widest font-medium">Owner</p>
                                <div className="flex items-center justify-center gap-1.5 mt-2 text-blue-200">
                                    <MapPin className="w-3 h-3" />
                                    <span className="text-xs">Kulathupuzha, Kerala</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10 relative z-10">
                                <div className="text-center">
                                    <span className="block text-xs text-blue-200 mb-1">Feedback</span>
                                    <span className="block font-bold">{feedbacks.length}</span>
                                </div>
                                <div className="text-center border-l border-white/10">
                                    <span className="block text-xs text-blue-200 mb-1">Resumes</span>
                                    <span className="block font-bold">2745</span>
                                </div>
                                <div className="text-center border-l border-white/10">
                                    <span className="block text-xs text-blue-200 mb-1">Placed Candidates</span>
                                    <span className="block font-bold">86%</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                                <h4 className="text-sm font-bold opacity-80 mb-4">Recent Feedback</h4>
                                <div className="h-20 relative">
                                    <AnimatePresence mode="wait">
                                        {feedbacks.length > 0 && feedbacks[currentFeedbackIndex] && (
                                            <motion.div
                                                key={feedbacks[currentFeedbackIndex].id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute inset-0 flex gap-3 text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0">
                                                    {feedbacks[currentFeedbackIndex].profilePic ? (
                                                        <img src={feedbacks[currentFeedbackIndex].profilePic} alt={feedbacks[currentFeedbackIndex].name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <User className="w-full h-full p-1.5 text-blue-100" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <h4 className="font-bold text-xs text-white truncate">{feedbacks[currentFeedbackIndex].name}</h4>
                                                        <div className="flex text-yellow-400 scale-[0.7] origin-right">
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg key={i} className={`w-3 h-3 ${i < feedbacks[currentFeedbackIndex].rating ? "fill-current" : "text-white/20"}`} viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-blue-100 line-clamp-2 leading-relaxed">{feedbacks[currentFeedbackIndex].feedbackText}</p>
                                                    <p className="text-[9px] text-blue-300/60 mt-1">{new Date(feedbacks[currentFeedbackIndex].createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {feedbacks.length === 0 && (
                                        <p className="text-center text-blue-200/60 text-xs py-2">No feedback yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Calendar Section (Live) */}
                        <div className="bg-slate-blue rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lg shadow-slate-blue/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest opacity-80">Calendar</h3>
                                <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-1 text-xs font-bold">
                                    <span>{new Date().toLocaleString('default', { month: 'long' })}</span>
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-center">
                                {(() => {
                                    const today = new Date();
                                    const currentDay = today.getDate();
                                    // Start from Sunday of current week
                                    const startOfWeek = new Date(today);
                                    startOfWeek.setDate(today.getDate() - today.getDay());

                                    return Array.from({ length: 7 }, (_, i) => {
                                        const d = new Date(startOfWeek);
                                        d.setDate(startOfWeek.getDate() + i);
                                        const dayName = d.toLocaleDateString('default', { weekday: 'short' });
                                        const dateNum = d.getDate();
                                        const isToday = dateNum === currentDay && d.getMonth() === today.getMonth();

                                        return (
                                            <div key={i} className={cn("space-y-2 opacity-80", isToday && "opacity-100")}>
                                                <span className="text-[10px] uppercase font-bold">{dayName}</span>
                                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", isToday && "bg-white text-slate-blue")}>
                                                    {dateNum}
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Notifications / Scheduled Events */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold tracking-tight text-slate-blue">Add Notification</h2>
                                <MoreHorizontal className="w-5 h-5 text-zinc-300" />
                            </div>
                            <div className="space-y-6">
                                {recentNotifications.map((notif, i) => (
                                    <div key={notif._id} className="relative pl-6 border-l-2 border-slate-100 pb-2 last:pb-0">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-blue border-2 border-white ring-1 ring-slate-100" />
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{notif.time}</p>
                                        <h4 className="font-bold text-sm text-slate-800">{notif.title}</h4>
                                        <p className="text-xs text-zinc-500 mt-1 truncate">{notif.description}</p>
                                    </div>
                                ))}
                                {recentNotifications.length === 0 && (
                                    <p className="text-center text-zinc-400 text-sm">No events scheduled.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

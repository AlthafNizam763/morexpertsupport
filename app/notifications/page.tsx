"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Bell, Search, CheckCircle2, Clock, Info, AlertTriangle, Trash2, Settings, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";


interface Notification {
    _id: string;
    title: string;
    description: string;
    time: string;
    type: "update" | "offer" | "success" | "warning";
    isRead: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
    const [newNotif, setNewNotif] = useState<{ title: string; description: string; type: "update" | "offer" }>({ title: "", description: "", type: "update" });
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            // Handle non-200 responses
            if (!res.ok) {
                console.error("Failed to fetch notifications:", await res.text());
                setNotifications([]);
                return;
            }
            const data = await res.json();
            // Ensure data is array
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setNotifications([]);
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem("more_auth");
        if (auth !== "true") {
            router.push("/");
        } else {
            setIsLoading(false);
            fetchNotifications();
        }
    }, [router]);

    if (isLoading) return null;

    const handleBroadcast = async () => {
        if (!newNotif.title || !newNotif.description) return;
        setIsSending(true);
        try {
            const res = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newNotif),
            });
            if (res.ok) {
                const broadcasted = await res.json();
                setNotifications([broadcasted, ...notifications]);
                setIsBroadcastModalOpen(false);
                setNewNotif({ title: "", description: "", type: "update" });
            }
        } catch (error) {
            console.error("Failed to broadcast:", error);
        } finally {
            setIsSending(false);
        }
    };



    const deleteNotification = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setNotifications(notifications.filter(n => n._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const deleteAll = async () => {
        try {
            const res = await fetch("/api/notifications?id=all", { method: "DELETE" });
            if (res.ok) {
                setNotifications([]);
            }
        } catch (error) {
            console.error("Failed to delete all notifications:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "update": return <Info className="w-5 h-5 text-blue-500" />;
            case "offer": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            default: return <Bell className="w-5 h-5 text-rose-500" />;
        }
    };

    return (
        <div className="h-screen bg-gray-light font-sans flex text-black selection:bg-slate-blue selection:text-white overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-24 h-screen overflow-hidden bg-gray-light p-10 flex flex-col">
                <div className="w-full mx-auto flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-10 shrink-0">
                        <div className="flex items-center gap-12 flex-1">
                            <h1 className="text-[2.5rem] font-black tracking-tight uppercase italic">Notifications</h1>
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/30" />
                                <input
                                    type="text"
                                    placeholder="Search updates or offers..."
                                    className="w-full bg-white border-transparent rounded-3xl py-3 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-slate-blue/20 transition-all placeholder:text-zinc-400 shadow-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => setIsBroadcastModalOpen(true)}
                                className="bg-slate-blue text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-blue/20"
                            >
                                Broadcast Notification
                            </button>
                            <button
                                onClick={deleteAll}
                                className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-ash hover:bg-ash/5 transition-all"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-5">
                        <AnimatePresence initial={false}>
                            {notifications.map((notif) => (
                                <motion.div
                                    key={notif._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={cn(
                                        "group flex items-center gap-8 p-8 rounded-[2.5rem] transition-all relative overflow-hidden border",
                                        notif.isRead
                                            ? "bg-white border-slate-100 shadow-sm hover:shadow-md"
                                            : "bg-white border-slate-blue/40 shadow-md shadow-slate-blue/5"
                                    )}
                                >
                                    {!notif.isRead && (
                                        <div className="absolute top-0 left-0 w-2 h-full bg-slate-blue" />
                                    )}
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-ash/5 ring-1 ring-white/5 shadow-inner">
                                        {getIcon(notif.type)}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className={cn(
                                                "font-black text-lg tracking-tight",
                                                notif.isRead ? "text-ash/70" : "text-black dark:text-slate-blue"
                                            )}>
                                                {notif.title}
                                            </h3>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                notif.type === "update" ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                                            )}>
                                                {notif.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-ash font-medium leading-relaxed max-w-2xl">
                                            {notif.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-8 shrink-0">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-ash/30 uppercase tracking-[0.2em]">
                                            <Clock className="w-3.5 h-3.5" />
                                            {notif.time}
                                        </div>

                                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => deleteNotification(notif._id)}
                                                className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-2xl transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {notifications.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-32 text-center"
                            >
                                <div className="w-24 h-24 bg-ash/5 rounded-[2.5rem] flex items-center justify-center mb-8 ring-1 ring-white/5 shadow-2xl">
                                    <Bell className="w-10 h-10 text-ash/20" />
                                </div>
                                <h3 className="text-2xl font-black mb-3">Clear as a summer sky</h3>
                                <p className="text-sm text-ash/50 max-w-sm font-medium">
                                    All caught up! No active updates or offers to display right now.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Broadcast Modal */}
                <AnimatePresence>
                    {isBroadcastModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => !isSending && setIsBroadcastModalOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-xl bg-white dark:bg-dark-gray p-10 rounded-[3rem] shadow-2xl border border-ash/10"
                            >
                                <h2 className="text-3xl font-black uppercase italic tracking-tight mb-2">Broadcast New</h2>
                                <p className="text-ash font-bold text-xs uppercase tracking-widest mb-10">Push system updates or promotional offers</p>

                                <div className="space-y-8">
                                    <div className="flex gap-4 p-1.5 bg-ash/5 rounded-2xl">
                                        {(["update", "offer"] as const).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setNewNotif({ ...newNotif, type })}
                                                className={cn(
                                                    "flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                                                    newNotif.type === type
                                                        ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xl"
                                                        : "text-ash hover:text-dark dark:hover:text-white"
                                                )}
                                            >
                                                {type} Notification
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-ash ml-2">Notification Title</label>
                                            <input
                                                type="text"
                                                value={newNotif.title}
                                                onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                                                placeholder="e.g. System Performance Boost"
                                                className="w-full bg-ash/5 dark:bg-black border border-ash/10 rounded-2xl py-5 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-slate-blue/20 transition-all text-slate-blue"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-ash ml-2">Message Description</label>
                                            <textarea
                                                rows={4}
                                                value={newNotif.description}
                                                onChange={(e) => setNewNotif({ ...newNotif, description: e.target.value })}
                                                placeholder="What should the users know about this?"
                                                className="w-full bg-ash/5 dark:bg-black border border-ash/10 rounded-2xl py-5 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-slate-blue/20 transition-all resize-none text-slate-blue"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            onClick={() => !isSending && setIsBroadcastModalOpen(false)}
                                            className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-ash hover:bg-ash/5 transition-all"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={handleBroadcast}
                                            disabled={isSending || !newNotif.title || !newNotif.description}
                                            className="flex-[1.5] py-5 rounded-2xl bg-slate-blue text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-blue/20 disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {isSending ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                                    />
                                                    Broadcasting...
                                                </>
                                            ) : "Push Notification"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

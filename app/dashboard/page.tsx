"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SupportChat } from "@/components/SupportChat";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import {
    Search,
    Bell,
    Plus,
    ChevronDown,
    FileText,
    MoreHorizontal,
    Calendar,
    CheckCircle2,
    Clock,
    Settings,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = localStorage.getItem("more_auth");
        if (auth !== "true") {
            router.push("/");
        } else {
            setTimeout(() => setIsLoading(false), 0);
        }
    }, [router]);

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

    const experts = [
        { name: "Prof. David", info: "4 hours lecture", price: "$100/hr", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
        { name: "Prof. Lily", info: "2 hours lecture", price: "$120/hr", isActive: true, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily" },
        { name: "Prof. Alex", info: "4 hours lecture", price: "$150/hr", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans flex text-zinc-900 dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <Sidebar />

            <main className="flex-1 ml-24 p-10 max-w-[1600px] mx-auto">
                {/* Header Bar */}
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
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink rounded-full border-2 border-white dark:border-black" />
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
                    {/* Main Content Area */}
                    <div className="xl:col-span-8 space-y-10">
                        {/* Support Experts Section */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold tracking-tight">Support Experts</h2>
                                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-5 py-2.5 rounded-2xl text-[13px] font-bold shadow-sm cursor-pointer border border-black/5 dark:border-white/10">
                                    English <ChevronDown className="w-4 h-4 text-zinc-400" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {experts.map((exp, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-[2rem] transition-all cursor-pointer group",
                                            exp.isActive
                                                ? 'bg-slate-blue text-white shadow-2xl scale-[1.01] shadow-slate-blue/40'
                                                : 'hover:bg-ash/5 dark:hover:bg-ash/10 border border-transparent'
                                        )}
                                    >
                                        <div className="flex items-center gap-6">
                                            <img src={exp.image} className={cn("w-14 h-14 rounded-2xl", exp.isActive ? 'bg-zinc-800' : 'bg-zinc-200 dark:bg-zinc-800')} />
                                            <div>
                                                <h4 className="font-bold text-base">{exp.name}</h4>
                                                {exp.isActive && <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Active Now</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-16">
                                            <p className={cn("text-xs font-bold uppercase tracking-wider", exp.isActive ? 'text-zinc-500' : 'text-zinc-400')}>{exp.info}</p>
                                            <span className="text-sm font-black w-20 text-right">{exp.price}</span>
                                            <button className={cn("p-2 transition-colors", exp.isActive ? 'text-zinc-600 hover:text-white' : 'text-zinc-300 hover:text-black dark:hover:text-white')}>
                                                <MoreHorizontal className="w-6 h-6 rotate-90" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <div className="grid lg:grid-cols-12 gap-10 items-start">
                            <div className="lg:col-span-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold tracking-tight">Schedule</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-zinc-400">Oct 08, 2026</span>
                                        <div className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-2xl text-[11px] font-bold shadow-lg">
                                            Prof Lily <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { day: "12", month: "Dec", weekday: "Monday", time: "10:00am-12:00pm" },
                                        { day: "13", month: "Dec", weekday: "Tuesday", time: "02:00pm-04:00pm", active: true },
                                        { day: "14", month: "Dec", weekday: "Wednesday", time: "08:00am-10:00am" },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center justify-between group">
                                            <div className={cn(
                                                "w-28 h-20 rounded-[1.75rem] flex flex-col items-center justify-center transition-all",
                                                s.active
                                                    ? 'bg-slate-blue text-white shadow-2xl scale-105 z-10 shadow-slate-blue/40'
                                                    : 'bg-white dark:bg-black shadow-sm border border-ash/10'
                                            )}>
                                                <span className="text-2xl font-black leading-none">{s.day}</span>
                                                <div className="flex flex-col items-center mt-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{s.month}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{s.weekday}</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 px-10 text-right">
                                                <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                                    {s.time}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Expert Profile Card */}
                            <div className="lg:col-span-4 h-full">
                                <div className="bg-white dark:bg-black rounded-[2.5rem] p-8 shadow-sm text-center flex flex-col items-center h-full border border-black/5 dark:border-white/10">
                                    <div className="relative mb-6">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily" className="w-24 h-24 rounded-[2rem] border-4 border-white dark:border-zinc-900 shadow-xl" />
                                        <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-10" />
                                    </div>
                                    <h3 className="text-lg font-black">Prof. Lily</h3>
                                    <div className="space-y-1 mt-2 mb-8">
                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">5 years Experience</p>
                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">Master's in Language</p>
                                    </div>
                                    <button className="w-full py-4 bg-slate-blue text-white rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all mt-auto shadow-slate-blue/20">
                                        Book Online
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="xl:col-span-4 space-y-10">
                        <section className="bg-white dark:bg-black rounded-[3rem] p-10 border border-black/5 dark:border-white/10 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-xl font-black">My Courses</h2>
                                <MoreHorizontal className="w-6 h-6 text-zinc-300" />
                            </div>

                            <div className="space-y-8">
                                {[
                                    { label: "English", sub: "20 Hours", icon: CheckCircle2, color: "text-black dark:text-white" },
                                    { label: "Spoken course", sub: "40 Hour", icon: FileText, color: "text-black dark:text-white" },
                                    { label: "Writing course", sub: "20 Hour", icon: Clock, color: "text-black dark:text-white" },
                                    { label: "Language course", sub: "20 Hour", icon: Settings, color: "text-black dark:text-white" },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-5">
                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-900", p.color)}>
                                                <p.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm tracking-tight">{p.label}</h4>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{p.sub}</p>
                                            </div>
                                        </div>
                                        <MoreHorizontal className="w-5 h-5 text-zinc-200 rotate-90" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16">
                                <h3 className="text-xl font-black mb-10">Account Progress</h3>
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
                                                strokeDashoffset={264 * (1 - 0.7)}
                                                strokeLinecap="round"
                                                className="text-slate-blue"
                                            />
                                            {/* Gauge markers */}
                                            <circle
                                                cx="50" cy="50" r="42"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                strokeDasharray="2 6"
                                                className="text-black/10 dark:text-white/10"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-[2.5rem] font-black tracking-tighter transition-all">70%</span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Progress</span>
                                        </div>
                                        <div className="h-2 w-full bg-ash/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "70%" }}
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

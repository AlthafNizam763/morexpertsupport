"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SupportChat } from "@/components/SupportChat";
import { Sidebar } from "@/components/Sidebar";
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

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("more_auth");
    if (auth !== "true") {
      router.push("/login");
    } else {
      setTimeout(() => setIsLoading(false), 0);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full"
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
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-black font-sans flex text-zinc-900 dark:text-white">
      <Sidebar />

      <main className="flex-1 ml-20 lg:ml-24 p-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-8 flex-1">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-white dark:bg-zinc-900 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white dark:bg-zinc-900 rounded-2xl relative shadow-sm">
              <Bell className="w-5 h-5 text-zinc-500" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 ml-4 bg-white dark:bg-zinc-900 p-1 pl-4 rounded-2xl shadow-sm border border-zinc-50">
              <span className="text-sm font-bold">Bondi</span>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" className="w-10 h-10 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Find Teacher / Experts Section */}
            <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold tracking-tight">Support Experts</h2>
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 cursor-pointer">
                  Available <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-4">
                {experts.map((exp, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 rounded-3xl transition-all cursor-pointer ${exp.isActive ? 'bg-[#F8F9FB] dark:bg-zinc-800/50 shadow-inner' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'}`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={exp.image} className="w-12 h-12 rounded-2xl bg-zinc-200" />
                      <div>
                        <h4 className="font-bold text-sm">{exp.name}</h4>
                        <p className="text-xs text-zinc-400 font-medium">{exp.info}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className="text-sm font-bold">{exp.price}</span>
                      <div className="flex items-center gap-3 grayscale brightness-0 dark:invert">
                        <Image
                          src="/logo.png"
                          alt="MoRe Experts Logo"
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain invert"
                        />
                        <span className="font-bold text-sm">MoRe Experts</span>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-zinc-300" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Schedule / Status Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold tracking-tight">Schedule</h2>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Oct 08, 2026</div>
                </div>

                <div className="space-y-6">
                  {[
                    { day: "12", month: "Dec", weekday: "Monday", time: "10:00am-12:00pm" },
                    { day: "13", month: "Dec", weekday: "Tuesday", time: "02:00pm-04:00pm", active: true },
                    { day: "14", month: "Dec", weekday: "Wednesday", time: "08:00am-10:00am" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-6 group">
                      <div className={`w-16 h-20 rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${s.active ? 'bg-black text-white shadow-xl scale-110' : 'bg-white border border-zinc-100 dark:bg-zinc-800 group-hover:border-black'}`}>
                        <span className="text-lg font-bold leading-none">{s.day}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">{s.month}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm ${s.active ? 'text-black dark:text-white' : 'text-zinc-400'}`}>{s.weekday}</h4>
                        <p className="text-[11px] font-bold text-zinc-300 mt-0.5 tracking-tight">{s.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Status / Resume widget */}
              <div className="bg-[#E9F4FF] dark:bg-zinc-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="relative mb-6">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily" className="w-20 h-20 rounded-[2rem] border-4 border-white shadow-xl relative z-10" />
                  <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                </div>
                <h3 className="font-bold">Prof. Lily</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">Lead Resume Expert</p>
                <div className="mt-8 w-full p-4 bg-black rounded-2xl text-white font-bold text-sm cursor-pointer hover:bg-zinc-800 transition-colors">
                  Contact Now
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            {/* Support Chat Tile */}
            <SupportChat />

            {/* Courses / Packages Progress */}
            <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight mb-8">Service Plan</h2>

              <div className="space-y-6">
                {[
                  { label: "Silver Package", value: 70, color: "bg-blue-500", icon: CheckCircle2 },
                  { label: "Word Document", value: 40, color: "bg-emerald-500", icon: FileText },
                  { label: "PDF Document", value: 90, color: "bg-orange-500", icon: Clock },
                ].map((p, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 group-hover:scale-110 transition-transform`}>
                          <p.icon className="w-4 h-4 text-zinc-400" />
                        </div>
                        <span className="text-sm font-bold">{p.label}</span>
                      </div>
                      <span className="text-xs font-bold text-zinc-400">{p.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.value}%` }}
                        className={`h-full ${p.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Circle Visual */}
              <div className="mt-12 flex flex-col items-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-zinc-100 dark:text-zinc-800"
                    />
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="282.7"
                      strokeDashoffset="84.8"
                      strokeLinecap="round"
                      className="text-black dark:text-white"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">70%</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Complete</span>
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

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Search, MoreHorizontal, Check, CheckCheck, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: "user" | "support";
    content: string;
    timestamp: string;
    status: "sent" | "delivered" | "read";
};

type Conversation = {
    id: string;
    user: {
        name: string;
        avatar: string;
        status: "online" | "offline";
        lastSeen?: string;
    };
    messages: Message[];
    unreadCount: number;
};

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: "1",
        user: {
            name: "Bondi",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky",
            status: "online",
        },
        unreadCount: 2,
        messages: [
            { id: "m1", role: "user", content: "Hey, I'm having trouble downloading my Silver package resume.", timestamp: "10:30 AM", status: "read" },
            { id: "m2", role: "support", content: "Hello Bondi! I can help with that. Are you seeing any specific error message?", timestamp: "10:32 AM", status: "read" },
            { id: "m3", role: "user", content: "It just says 'Generating...' and never finishes.", timestamp: "10:33 AM", status: "read" },
        ]
    },
    {
        id: "2",
        user: {
            name: "David",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            status: "offline",
            lastSeen: "2h ago"
        },
        unreadCount: 0,
        messages: [
            { id: "d1", role: "user", content: "Is the Golden package worth the upgrade?", timestamp: "Yesterday", status: "read" },
            { id: "d2", role: "support", content: "Absolutely! You get Word exports and 24/7 expert review.", timestamp: "Yesterday", status: "read" },
        ]
    },
    {
        id: "3",
        user: {
            name: "Lily",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
            status: "online",
        },
        unreadCount: 0,
        messages: [
            { id: "l1", role: "user", content: "When will my cover letter be ready?", timestamp: "9:00 AM", status: "read" },
        ]
    }
];

export function SupportChat({ isFullHeight }: { isFullHeight?: boolean }) {
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0].id);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const activeConversation = conversations.find(c => c.id === activeId) || conversations[0];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeId, conversations]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: crypto.randomUUID(),
            role: "support",
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sent"
        };

        setConversations(prev => prev.map(conv =>
            conv.id === activeId
                ? { ...conv, messages: [...conv.messages, newMessage] }
                : conv
        ));
        setInput("");
    };

    return (
        <div className={cn(
            "flex w-full bg-white dark:bg-black overflow-hidden",
            isFullHeight ? "h-screen" : "h-[650px] rounded-[3rem] border border-ash/10 shadow-2xl"
        )}>
            {/* Custom Scrollbar Styling */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(128, 128, 128, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(128, 128, 128, 0.2);
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                }
            `}</style>

            {/* Sidebar */}
            <div className="w-[400px] border-r border-ash/5 flex flex-col bg-white dark:bg-zinc-950/20 h-full">
                <div className="p-8 border-b border-ash/5">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            {isFullHeight && (
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="p-2.5 -ml-2.5 hover:bg-ash/10 rounded-2xl transition-all group"
                                >
                                    <Home className="w-5 h-5 text-ash group-hover:text-white" />
                                </button>
                            )}
                            <h3 className="text-2xl font-black tracking-tight uppercase italic">Live Support</h3>
                        </div>
                        <button className="p-2 hover:bg-ash/5 rounded-xl transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-ash" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/30" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full bg-ash/5 dark:bg-dark border border-ash/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-blue/20 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
                    {conversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setActiveId(conv.id)}
                            className={cn(
                                "w-full p-6 flex items-center gap-5 transition-all relative group",
                                activeId === conv.id ? "bg-slate-blue/5 dark:bg-slate-blue/10" : "hover:bg-ash/5"
                            )}
                        >
                            {activeId === conv.id && (
                                <motion.div layoutId="active-chat" className="absolute left-0 top-0 bottom-0 w-1 bg-slate-blue" />
                            )}
                            <div className="relative shrink-0">
                                <img src={conv.user.avatar} className="w-14 h-14 rounded-2xl bg-ash/5 object-cover ring-1 ring-white/10" />
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-black rounded-full",
                                    conv.user.status === "online" ? "bg-emerald-500" : "bg-zinc-400"
                                )} />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <h4 className="font-bold text-base truncate">{conv.user.name}</h4>
                                    <span className="text-[10px] text-ash font-bold uppercase tracking-wider">{conv.messages[conv.messages.length - 1]?.timestamp}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm text-ash truncate leading-relaxed">
                                        {conv.messages[conv.messages.length - 1]?.content}
                                    </p>
                                    {conv.unreadCount > 0 && (
                                        <span className="shrink-0 bg-slate-blue text-white text-[10px] font-black h-5 min-w-5 rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-slate-blue/20">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-black">
                {/* Chat Header */}
                <div className="p-8 border-b border-ash/5 flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-xl">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-ash/5 flex items-center justify-center ring-1 ring-white/10">
                            <img src={activeConversation.user.avatar} className="w-14 h-14 rounded-2xl" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg leading-tight tracking-tight uppercase italic">{activeConversation.user.name}</h3>
                            <div className="flex items-center gap-2.5 mt-1.5">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    activeConversation.user.status === "online" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-zinc-400"
                                )} />
                                <span className="text-[10px] text-ash font-black uppercase tracking-[0.2em]">
                                    {activeConversation.user.status === "online" ? "Active Now" : `Last seen ${activeConversation.user.lastSeen}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Thread */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8 bg-ash/5 dark:bg-black/20 scroll-smooth"
                >
                    <AnimatePresence initial={false}>
                        {activeConversation.messages.map((msg, i) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex flex-col max-w-[70%] gap-2.5",
                                    msg.role === "support" ? "ml-auto items-end" : "items-start"
                                )}
                            >
                                <div className={cn(
                                    "px-7 py-4.5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm transition-all",
                                    msg.role === "support"
                                        ? "bg-slate-blue text-white rounded-tr-none shadow-lg shadow-slate-blue/10"
                                        : "bg-white dark:bg-dark text-black dark:text-white border border-ash/5 rounded-tl-none shadow-black/5 dark:shadow-white/5 shadow-2xl"
                                )}>
                                    {msg.content}
                                </div>
                                <div className="flex items-center gap-2.5 px-2">
                                    <span className="text-[10px] text-ash font-black uppercase tracking-widest">{msg.timestamp}</span>
                                    {msg.role === "support" && (
                                        <div className="flex text-slate-blue scale-110">
                                            {msg.status === "read" ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-8 bg-white dark:bg-black border-t border-ash/5">
                    <div className="flex gap-5 items-center bg-secondary-white dark:bg-dark rounded-[2.5rem] px-8 py-5 border border-ash/5 focus-within:border-slate-blue/30 focus-within:ring-4 focus-within:ring-slate-blue/5 transition-all shadow-sm">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder={`Reply to ${activeConversation.user.name}...`}
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-ash/30 font-bold"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-3.5 rounded-2xl bg-slate-blue text-white disabled:opacity-20 transition-all hover:scale-110 active:scale-90 shadow-xl shadow-slate-blue/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

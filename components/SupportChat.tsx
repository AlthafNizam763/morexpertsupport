"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Search, MoreHorizontal, Check, CheckCheck, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import { cn } from "@/lib/utils";

type Message = {
    _id: string;
    role: "user" | "support";
    text: string;
    timestamp: string;
    createdAt?: string;
};

type ConversationData = {
    _id: string;
    userName: string;
    userProfilePic: string;
    lastMessage?: string;
    lastMessageTime?: string;
    status: "online" | "offline" | "active";
    unreadCount: number;
    updatedAt: string;
};

const isUserOnline = (updatedAt: string) => {
    if (!updatedAt) return false;
    const diff = Date.now() - new Date(updatedAt).getTime();
    // Consider online if active in last 5 minutes (300000 ms)
    return diff < 5 * 60 * 1000;
};



export function SupportChat({ isFullHeight }: { isFullHeight?: boolean }) {
    const [conversations, setConversations] = useState<ConversationData[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [isLoadingConv, setIsLoadingConv] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryId = searchParams?.get('id');

    const activeConversation = conversations.find(c => c._id === activeId);

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/chat/conversations");
            if (res.ok) {
                const data = await res.json();
                const convs = Array.isArray(data) ? data : [];
                setConversations(convs);

                if (convs.length > 0 && !activeId) {
                    if (queryId) {
                        // Check if queryId exists in fetched conversations
                        const exists = convs.some((c: ConversationData) => c._id === queryId);
                        if (exists) {
                            setActiveId(queryId);
                        } else {
                            setActiveId(convs[0]._id);
                        }
                    } else {
                        setActiveId(convs[0]._id);
                    }
                }
            } else {
                console.error("Failed to fetch conversations:", await res.text());
                setConversations([]);
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            setConversations([]);
        } finally {
            setIsLoadingConv(false);
        }
    };

    // React to queryId changes
    useEffect(() => {
        if (queryId) {
            setActiveId(queryId);
        }
    }, [queryId]);

    const fetchMessages = async (id: string) => {
        setIsLoadingMessages(true);
        try {
            const res = await fetch(`/api/chat/messages?conversationId=${id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(Array.isArray(data) ? data : []);
            } else {
                console.error("Failed to fetch messages:", await res.text());
                setMessages([]);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            setMessages([]);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeId) {
            fetchMessages(activeId);

            // Connect to Socket.IO
            const socket = io({
                path: "/api/socket/io",
                addTrailingSlash: false,
            });

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
                socket.emit("join_conversation", activeId);
            });

            socket.on("new_message", (message: Message) => {
                console.log("New message received via socket:", message);
                // Only append if it belongs to the current conversation
                // and avoid duplicates if we just sent it (though usually good to handle via ID check)
                setMessages((prev) => {
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });

                // Update conversation last message in list locally
                setConversations(prev => prev.map(c =>
                    c._id === activeId ? {
                        ...c,
                        lastMessage: message.text,
                        lastMessageTime: new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        updatedAt: message.createdAt || new Date().toISOString()
                    } : c
                ));
            });

            // Mark as read
            const markAsRead = async () => {
                try {
                    await fetch("/api/chat/conversations", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ conversationId: activeId })
                    });

                    // Update local state
                    setConversations(prev => prev.map(c =>
                        c._id === activeId ? { ...c, unreadCount: 0 } : c
                    ));
                } catch (error) {
                    console.error("Failed to mark as read:", error);
                }
            };
            markAsRead();

            return () => {
                socket.disconnect();
            };
        }
    }, [activeId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, activeId]);

    const handleSend = async () => {
        if (!input.trim() || !activeId) return;

        const payload = {
            conversationId: activeId,
            role: "support",
            text: input,
            sender: "MoRe Support"
        };

        try {
            const res = await fetch("/api/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                // Listener will auto-update messages and conversation list
                setInput("");
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
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
                            key={conv._id}
                            onClick={() => setActiveId(conv._id)}
                            className={cn(
                                "w-full p-6 flex items-center gap-5 transition-all relative group",
                                activeId === conv._id ? "bg-slate-blue/5 dark:bg-slate-blue/10" : "hover:bg-ash/5"
                            )}
                        >
                            {activeId === conv._id && (
                                <motion.div layoutId="active-chat" className="absolute left-0 top-0 bottom-0 w-1 bg-slate-blue" />
                            )}
                            <div className="relative shrink-0">
                                {conv.userProfilePic ? (
                                    <img src={conv.userProfilePic} className="w-14 h-14 rounded-2xl bg-ash/5 object-cover ring-1 ring-white/10" />
                                ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-ash/5 flex items-center justify-center ring-1 ring-white/10">
                                        <User className="w-6 h-6 text-ash/40" />
                                    </div>
                                )}
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-black rounded-full",
                                    isUserOnline(conv.updatedAt) ? "bg-emerald-500" : "bg-zinc-400"
                                )} />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <h4 className="font-bold text-base truncate">{conv.userName}</h4>
                                    <span className="text-[10px] text-ash font-bold uppercase tracking-wider">
                                        {conv.updatedAt
                                            ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : conv.lastMessageTime}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm text-ash truncate leading-relaxed">
                                        {conv.lastMessage}
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
                            {activeConversation && <img src={activeConversation.userProfilePic} className="w-14 h-14 rounded-2xl" />}
                        </div>
                        <div>
                            <h3 className="font-black text-lg leading-tight tracking-tight uppercase italic">{activeConversation?.userName || "Select Chat"}</h3>
                            <div className="flex items-center gap-2.5 mt-1.5">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    (activeConversation && isUserOnline(activeConversation.updatedAt)) ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-zinc-400"
                                )} />
                                <span className="text-[10px] text-ash font-black uppercase tracking-[0.2em]">
                                    {(activeConversation && isUserOnline(activeConversation.updatedAt)) ? "Active Now" : "Offline"}
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
                    {!activeConversation ? (
                        <div className="h-full flex flex-col items-center justify-center text-ash gap-4">
                            <div className="w-20 h-20 rounded-[2rem] bg-ash/5 flex items-center justify-center">
                                <User className="w-10 h-10 opacity-20" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest">Select a conversation to start</p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={msg._id}
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
                                        {msg.text}
                                    </div>
                                    <div className="flex items-center gap-2.5 px-2">
                                        <span className="text-[10px] text-ash font-black uppercase tracking-widest">
                                            {msg.createdAt
                                                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : msg.timestamp}
                                        </span>
                                        {msg.role === "support" && (
                                            <div className="flex text-emerald-500 scale-110">
                                                <CheckCheck className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-8 bg-white dark:bg-black border-t border-ash/5">
                    <div className="flex gap-5 items-center bg-secondary-white dark:bg-dark rounded-[2.5rem] px-8 py-5 border border-ash/5 focus-within:border-slate-blue/30 focus-within:ring-4 focus-within:ring-slate-blue/5 transition-all shadow-sm">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder={activeConversation ? `Reply to ${activeConversation.userName}...` : "Select a conversation..."}
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

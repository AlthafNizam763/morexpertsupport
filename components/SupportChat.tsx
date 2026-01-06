"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    status?: "Completed" | "Pending" | "In Progress";
    type?: "text" | "status" | "document";
};

// SUGGESTIONS removed for now as input is simplified

export function SupportChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your MoRe Experts Support Assistant. How can I help you with your resume or app navigation today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Mock API Response based on keywords
        setTimeout(() => {
            let response = "I'm sorry, I couldn't find specific information on that. Would you like to check your package details or contact our human support via WhatsApp?";

            const lowerText = text.toLowerCase();
            if (lowerText.includes("resume") || lowerText.includes("status")) {
                response = "You can check your resume status in the 'Resume Making' section. It will show as 'Completed', 'Pending', or 'In Progress'. If it's completed, you can download the PDF or Word file directly.";
            } else if (lowerText.includes("package") || lowerText.includes("golden") || lowerText.includes("silver")) {
                response = "MoRe Experts offers Silver, Golden, and Premium packages. Each has different features, like PDF only for Silver or both PDF and Word for Premium. You can see your current package in your profile.";
            } else if (lowerText.includes("download")) {
                response = "To download your documents, go to the 'Resume Making' section within the app. Look for the download icon next to your completed files.";
            } else if (lowerText.includes("profile") || lowerText.includes("details")) {
                response = "You can update your personal details in the 'Profile' section of the app. Please ensure your contact info is up to date!";
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: response,
                },
            ]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[520px] w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-black dark:text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">MoRe Assistant</h3>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Active Support</span>
                    </div>
                </div>
                <button className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <Settings className="w-4 h-4 text-zinc-400" />
                </button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth bg-zinc-50/30 dark:bg-black/20"
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "flex w-full gap-3",
                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "max-w-[85%] rounded-[1.5rem] px-5 py-3.5 text-sm leading-relaxed",
                                msg.role === "assistant"
                                    ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 shadow-sm border border-zinc-100 dark:border-zinc-700 rounded-tl-none"
                                    : "bg-black text-white dark:bg-white dark:text-black shadow-lg rounded-tr-none"
                            )}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="bg-white dark:bg-zinc-800 rounded-[1.5rem] rounded-tl-none px-5 py-3.5 flex items-center gap-3 shadow-sm border border-zinc-100 dark:border-zinc-700">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-50 dark:border-zinc-800">
                <div className="flex gap-2 items-center bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl px-4 py-3 border border-transparent focus-within:border-zinc-200 dark:focus-within:border-zinc-700 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Search help..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                        className="p-2 rounded-xl bg-black dark:bg-white text-white dark:text-black disabled:opacity-20 transition-opacity shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

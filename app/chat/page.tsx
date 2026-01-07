"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { SupportChat } from "@/components/SupportChat";

export default function ChatPage() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const auth = localStorage.getItem("more_auth");
        if (auth !== "true") {
            router.push("/");
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) return null;
    return (
        <div className="h-screen w-screen bg-white dark:bg-black font-sans flex text-black dark:text-white selection:bg-slate-blue selection:text-white overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-24 flex flex-col h-screen overflow-hidden bg-white dark:bg-black">
                <SupportChat isFullHeight />
            </main>
        </div>
    );
}

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

function formatTimestamp(date: Date | string | number): string {
    const d = new Date(date); // Handle Date object, ISO string, or timestamp number
    if (isNaN(d.getTime())) return typeof date === 'string' ? date : '';

    // Format: 20 January 2026 at 12:31:00 UTC+5:30
    // en-GB typically outputs "20 January 2026 at 12:31:00" in Node/recent browsers
    // We force Asia/Kolkata timezone
    return d.toLocaleString('en-GB', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }) + " UTC+5:30";
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    console.log("GET /api/chat/messages - conversationId:", conversationId);

    if (!conversationId) {
        return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    try {
        // Mobile App uses subcollection: conversations/{userId}/messages
        const snapshot = await db.collection('conversations')
            .doc(conversationId)
            .collection('messages')
            // .orderBy('createdAt', 'asc') // Removed to avoid index requirement
            .get();

        console.log(`GET /api/chat/messages - Found ${snapshot.docs.length} messages`);

        const messages = snapshot.docs
            .map(doc => {
                const data = doc.data();
                return {
                    _id: doc.id,
                    ...data,
                    // Safe convert potential Timestamps to strings
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                    timestamp: formatTimestamp(data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || data.timestamp))
                };
            })
            .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log("POST /api/chat/messages - Payload:", JSON.stringify(data));

        const messageData = {
            ...data,
            createdAt: new Date().toISOString(),
            timestamp: formatTimestamp(new Date())
        };

        const docRef = await db.collection('conversations')
            .doc(data.conversationId)
            .collection('messages')
            .add(messageData);
        const message = { _id: docRef.id, ...messageData };

        // Update the conversation's last message
        await db.collection('conversations').doc(data.conversationId).update({
            lastMessage: data.text,
            lastMessageTime: message.timestamp,
            updatedAt: new Date().toISOString()
        });

        // Emit socket event
        const io = (global as any).io;
        if (io) {
            io.to(data.conversationId).emit("new_message", message);
            io.emit("new_message_notification", {
                conversationId: data.conversationId,
                ...message
            });
        }

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 400 });
    }
}

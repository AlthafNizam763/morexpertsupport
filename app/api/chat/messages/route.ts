import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
        return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    try {
        const snapshot = await db.collection('messages')
            .where('conversationId', '==', conversationId)
            .orderBy('createdAt', 'asc')
            .get();

        const messages = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const messageData = {
            ...data,
            createdAt: new Date().toISOString(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const docRef = await db.collection('messages').add(messageData);
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

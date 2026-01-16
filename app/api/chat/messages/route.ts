import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

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
                    timestamp: typeof data.timestamp === 'object' ? new Date((data.timestamp._seconds || 0) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : data.timestamp
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
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

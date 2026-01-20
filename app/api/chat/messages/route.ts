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
                    // Return valid Date/Timestamp data, let JSON serialization handle stringification if needed,
                    // or convert to date object if it's a Firestore Timestamp
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : (data.timestamp ? new Date(data.timestamp) : new Date(data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt))
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

        // Use Date objects for Firestore (stored as Timestamp)
        const now = new Date();
        const messageData = {
            ...data,
            createdAt: now,
            timestamp: now
        };

        const docRef = await db.collection('conversations')
            .doc(data.conversationId)
            .collection('messages')
            .add(messageData);

        // For the response, we return the object. Date objects will be serialized to ISO strings by NextResponse.json
        const message = { _id: docRef.id, ...messageData };

        // Update the conversation's last message
        await db.collection('conversations').doc(data.conversationId).update({
            lastMessage: data.text,
            lastMessageTime: now,
            updatedAt: now
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

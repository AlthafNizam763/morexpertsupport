import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    try {
        if (userId) {
            // Optimization: If userId is provided, the conversation ID IS the userId
            const doc = await db.collection('conversations').doc(userId).get();
            if (doc.exists) {
                const data = doc.data()!;
                // Sanitize single doc
                const sanitized = {
                    _id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
                    lastMessageTime: typeof data.lastMessageTime === 'object' ? new Date((data.lastMessageTime._seconds || 0) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : data.lastMessageTime
                };
                return NextResponse.json([sanitized]);
            } else {
                return NextResponse.json([]);
            }
        }

        // Admin View: Fetch all
        const query = db.collection('conversations');
        // .orderBy('updatedAt', 'desc') // Removed to avoid index requirement
        const snapshot = await query.get();
        const conversations = snapshot.docs
            .map(doc => {
                const data = doc.data();
                return {
                    _id: doc.id,
                    ...data,
                    // Safe convert potential Timestamps to strings
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
                    lastMessageTime: typeof data.lastMessageTime === 'object' ? new Date((data.lastMessageTime._seconds || 0) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : data.lastMessageTime
                };
            })
            .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, userName, userProfilePic } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "UserId is required" }, { status: 400 });
        }

        const convRef = db.collection('conversations').doc(userId);
        const doc = await convRef.get();

        if (doc.exists) {
            return NextResponse.json({ _id: doc.id, ...doc.data() });
        }

        const newConv = {
            userId,
            userName,
            userProfilePic,
            lastMessage: "Conversation started",
            lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unreadCount: 0,
            status: "offline",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await convRef.set(newConv);
        return NextResponse.json({ _id: userId, ...newConv });

    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { conversationId } = await request.json();

        if (!conversationId) {
            return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
        }

        await db.collection('conversations').doc(conversationId).update({
            unreadCount: 0
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating conversation:", error);
        return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    try {
        let query: FirebaseFirestore.Query = db.collection('conversations');

        if (userId) {
            query = query.where('userId', '==', userId);
        }

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

        // Check if conversation already exists for this user
        // Note: Ideally we want one conversation per user for support chat
        const existingSnapshot = await db.collection('conversations')
            .where('userId', '==', userId)
            .get();

        if (!existingSnapshot.empty) {
            const doc = existingSnapshot.docs[0];
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

        const docRef = await db.collection('conversations').add(newConv);
        return NextResponse.json({ _id: docRef.id, ...newConv });

    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await db.collection('conversations').orderBy('updatedAt', 'desc').get();
        const conversations = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}

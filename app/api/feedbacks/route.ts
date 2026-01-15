import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await db.collection('feedback').orderBy('createdAt', 'desc').get();
        const feedbacks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
    }
}

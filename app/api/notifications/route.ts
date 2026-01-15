import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await db.collection('notifications').orderBy('createdAt', 'desc').get();
        const notifications = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const notificationData = {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const docRef = await db.collection('notifications').add(notificationData);
        return NextResponse.json({ _id: docRef.id, ...notificationData }, { status: 201 });
    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json({ error: "Failed to create notification" }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id === 'all') {
            const batch = db.batch();
            const snapshot = await db.collection('notifications').get();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            return NextResponse.json({ message: "All notifications deleted" });
        } else if (id) {
            await db.collection('notifications').doc(id).delete();
            return NextResponse.json({ message: "Notification deleted" });
        } else {
            return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error deleting notification(s):", error);
        return NextResponse.json({ error: "Failed to delete notification(s)" }, { status: 500 });
    }
}

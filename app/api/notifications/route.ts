import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        return NextResponse.json(notifications);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const notification = await Notification.create(data);
        return NextResponse.json(notification, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create notification" }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id === 'all') {
            await Notification.deleteMany({});
            return NextResponse.json({ message: "All notifications deleted" });
        } else if (id) {
            await Notification.findByIdAndDelete(id);
            return NextResponse.json({ message: "Notification deleted" });
        } else {
            return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete notification(s)" }, { status: 500 });
    }
}

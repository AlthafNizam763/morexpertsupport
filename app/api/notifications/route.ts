import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";

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

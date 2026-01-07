import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Conversation } from "@/lib/models/Chat";

export async function GET() {
    try {
        await dbConnect();
        const conversations = await Conversation.find({}).sort({ updatedAt: -1 });
        return NextResponse.json(conversations);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Message, Conversation } from "@/lib/models/Chat";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
        return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    try {
        await dbConnect();
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const message = await Message.create(data);

        // Update the conversation's last message
        await Conversation.findByIdAndUpdate(data.conversationId, {
            lastMessage: data.text,
            lastMessageTime: message.timestamp,
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send message" }, { status: 400 });
    }
}

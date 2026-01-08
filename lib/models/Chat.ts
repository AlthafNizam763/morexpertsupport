import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: String, required: true },
    text: { type: String, required: true },
    role: { type: String, enum: ["user", "support"], required: true },
    timestamp: { type: String, default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
}, { timestamps: true });

const ConversationSchema = new Schema({
    participants: [{ type: String }], // User IDs or names
    userName: { type: String, required: true },
    userProfilePic: { type: String },
    lastMessage: { type: String },
    lastMessageTime: { type: String },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    unreadCount: { type: Number, default: 0 }
}, { timestamps: true });

const Message = models.Message || model("Message", MessageSchema);
const Conversation = models.Conversation || model("Conversation", ConversationSchema);

export { Message, Conversation };

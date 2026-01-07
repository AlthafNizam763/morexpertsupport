import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: ["update", "offer", "success", "warning"],
        default: "update"
    },
    isRead: { type: Boolean, default: false },
    time: { type: String, default: "Just now" }
}, { timestamps: true });

const Notification = models.Notification || model("Notification", NotificationSchema);
export default Notification;

import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    package: {
        type: String,
        enum: ["Silver 1", "Silver 2", "Golden", "Platinum", "Premium", "None"],
        default: "None"
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    dob: { type: String },
    gender: { type: String },
    mobile: { type: String },
    linkedin: { type: String },
    address: { type: String },
    documents: [{
        name: { type: String },
        status: { type: String, enum: ["Pending", "Uploaded", "Verified"], default: "Pending" },
        uploadDate: { type: Date }
    }]
}, { timestamps: true });

const User = models.User || model("User", UserSchema);
export default User;

import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
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
    profilePic: { type: String },
    documents: {
        idProof: { type: String },
        serviceGuide: { type: String },
        contract: { type: String },
        coverLetter: { type: String }
    }
}, { timestamps: true });

if (process.env.NODE_ENV === "development") {
    delete models.User;
}

const User = models.User || model("User", UserSchema);
export default User;

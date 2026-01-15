import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';


export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const rawData = await request.json();

        // Sanitize data -> remove undefined which might cause "invalid nested entity" in Firestore
        // Also handle cases where documents might have null/undefined values
        const data = { ...rawData };
        if (data.documents) {
            const cleanDocs: any = {};
            for (const [key, value] of Object.entries(data.documents)) {
                if (value !== undefined && value !== null) {
                    cleanDocs[key] = value;
                }
            }
            data.documents = cleanDocs;
        }

        console.log("UPDATE USER DATA (Sanitized):", JSON.stringify(data, null, 2));

        const userRef = db.collection('users').doc(id);

        await userRef.update({
            ...data,
            updatedAt: new Date().toISOString()
        });

        const doc = await userRef.get();
        if (!doc.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ _id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userRef = db.collection('users').doc(id);

        // Check if exists first (optional, but good for consistent behavior)
        const doc = await userRef.get();
        if (!doc.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

        await userRef.delete();
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

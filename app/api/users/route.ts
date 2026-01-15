import { NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
        const users = snapshot.docs.map(doc => ({
            _id: doc.id, // Map doc ID to _id for frontend compatibility
            ...doc.data()
        }));
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { email, password, name, ...otherData } = data;

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Create User in Firebase Authentication
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: name,
        });

        const uid = userRecord.uid;

        // 2. Store User Details in Firestore using the Auth UID
        const userData = {
            name,
            email,
            ...otherData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await db.collection('users').doc(uid).set(userData);

        const user = { _id: uid, ...userData };

        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 400 });
    }
}

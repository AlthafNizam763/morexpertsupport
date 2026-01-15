
import fetch from 'node-fetch';

async function run() {
    try {
        console.log("Fetching users...");
        const usersRes = await fetch('http://localhost:3000/api/users');
        if (!usersRes.ok) {
            console.error("Failed to fetch users:", await usersRes.text());
            return;
        }
        const users = await usersRes.json();
        if (users.length === 0) {
            console.log("No users found to update.");
            return;
        }

        const user = users[0];
        console.log(`Attempting to update user: ${user._id}`);

        // Simulate the payload that might be causing the issue
        const payload = {
            ...user,
            documents: {
                idProof: "some-base64-string",
                serviceGuide: undefined, // undefined might be stripped by JSON.stringify
                contract: null // null might be preserved
            }
        };

        // Clean up payload slightly as frontend probably does
        const body = JSON.stringify(payload);
        console.log("Sending payload:", body);

        const updateRes = await fetch(`http://localhost:3000/api/users/${user._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        if (!updateRes.ok) {
            console.error("Update failed:", await updateRes.text());
        } else {
            console.log("Update successful:", await updateRes.json());
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

run();

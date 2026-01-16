
const BASE_URL = "http://localhost:3000";

async function run() {
    try {
        const userId = "mobile-sync-user-01";

        console.log("\n--- 1. Creating Conversation (Admin Side) ---");
        // This ensures the parent doc exists
        await fetch(`${BASE_URL}/api/chat/conversations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, userName: "Mobile Sync User", userProfilePic: "" })
        });

        console.log("\n--- 2. Sending Message (Simulating Admin Reply) ---");
        // This uses the NEW logic: writes to conversations/userId/messages
        const msgRes = await fetch(`${BASE_URL}/api/chat/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                conversationId: userId,
                role: "support",
                text: "Hello from Admin to Mobile App!",
                sender: "Admin"
            })
        });

        if (!msgRes.ok) throw new Error(await msgRes.text());
        console.log("Message Sent Successfully.");

        console.log("\n--- 3. Fetching Messages (Admin Side) ---");
        // This uses the NEW logic: reads from conversations/userId/messages
        const fetchRes = await fetch(`${BASE_URL}/api/chat/messages?conversationId=${userId}`);
        const messages = await fetchRes.json();

        console.log(`Fetched ${messages.length} messages.`);
        if (messages.length > 0 && messages[0].text === "Hello from Admin to Mobile App!") {
            console.log("SUCCESS: Message read/write from subcollection works!");
        } else {
            console.error("FAILURE: Could not retrieve message from subcollection.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

run();

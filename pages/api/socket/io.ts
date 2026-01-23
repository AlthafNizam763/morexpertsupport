import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: any) => {
    if (!res.socket.server.io) {
        console.log("*First use, starting socket.io*");
        const httpServer: NetServer = res.socket.server;
        const io = new ServerIO(httpServer, {
            path: "/api/socket/io",
            addTrailingSlash: false,
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        io.on("connection", (socket) => {
            console.log("New socket connection:", socket.id);

            socket.on("join_conversation", (conversationId) => {
                console.log(`Socket ${socket.id} joining room: ${conversationId}`);
                socket.join(conversationId);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
        (global as any).io = io; // Attach to global for App Router access
    } else {
        // Ensure global.io is set even if already running (e.g. after hot reload)
        if (!(global as any).io) {
            (global as any).io = res.socket.server.io;
        }
    }
    res.end();
};

export default ioHandler;

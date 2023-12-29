import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";

const getRandomString = () => {
    const result = Math.random().toString(36).slice(-5) + Date.now().toString(36).slice(-3);
    return result;
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });
        res.socket.server.io = io;

        const rooms: string[] = [];

        io.on('connection', (socket) => {
            const getRoomId = () => {
                const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);
                return joinedRoom ? joinedRoom : socket.id;
            };

            let once = true;
            if (once) {
                socket.emit('get_rooms', rooms);
                once = false;
            }

            socket.on('send_message', (msg) => {
                io.to(getRoomId()).emit("receive_message", msg);
            })

            socket.on("create_room", () => {
                let roomId: string;
                do {
                    roomId = getRandomString();
                } while (rooms.includes(roomId));
                rooms.push(roomId);
                io.emit('get_rooms', rooms);
                socket.emit('created', roomId);
            });

            socket.on("join_room", (roomId) => {
                if (getRoomId() !== socket.id) socket.leave(getRoomId());
                if (rooms.includes(roomId) && ![...socket.rooms].includes(roomId)) {
                    socket.join(roomId);
                } else {
                    //not exist
                }
            });

            socket.on("draw", (path) => {
                socket.broadcast
                    .to(getRoomId())
                    .emit("user_draw", path);
            })
        })

    }

    res.end();
}

export default ioHandler;
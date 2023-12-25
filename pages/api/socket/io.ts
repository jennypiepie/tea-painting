import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            const getRoomId = () => {
                const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);
                return joinedRoom ? joinedRoom : socket.id;
            };

            socket.on('send_message', (msg) => {
                // console.log([...socket.rooms]);
                io.to(getRoomId()).emit("receive_message", msg);
                // io.emit('receive_message', msg)
            })

            socket.on("create_room", (roomId) => {
                // let roomId: string;
                // do {
                //     roomId = Math.random().toString(36).substring(2, 6);
                // } while (rooms.has(roomId));

                socket.join(roomId);
                // io.to(socket.id).emit("created", roomId);
            });

            socket.on("join_room", (roomId) => {
                socket.join(roomId);
            });
        })

    }

    res.end();
}

export default ioHandler;
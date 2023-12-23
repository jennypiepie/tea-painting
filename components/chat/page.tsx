'use client';

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSocketStore } from "@/stores/useSocketStore";

export default function Chat() {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const { socket, setSocket, setIsConnected } = useSocketStore();

    useEffect(() => {
        socketInitialzer();
    }, [])

    const socketInitialzer = async () => {
        const clientIO = io(`${process.env.NEXT_PUBLIC_URL}`, {
            path: '/api/socket/io',
            addTrailingSlash: false,
        });

        clientIO.on("connect", () => {
            setIsConnected(true);
        });

        clientIO.on("disconnect", () => {
            setIsConnected(false);
            console.log(clientIO.id);
        });

        clientIO.on('receive-message', (data: any) => {
            // console.log(data);
            const { username, message } = data;
            setMessage(`${username}: ${message}`)
        })

        setSocket(clientIO);
    }

    const handleSubmit = () => {
        !!socket && socket.emit('send-message', {
            username,
            message: 'hi'
        });
    }

    return (<>
        <span>username</span>
        <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
        <br />
        <div>Chat</div>
        <p>{message}</p>
    </>)
}

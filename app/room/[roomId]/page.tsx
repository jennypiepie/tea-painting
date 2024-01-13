'use client';

import Auth from "@/components/auth";
import Canvas from "@/components/canvas";
import Chat from "@/components/chat";
import { useSocketStore } from "@/stores/useSocketStore";
import { useEffect } from "react";

function Room({ params }: { params: { roomId: string } }) {
    const { socket, rooms } = useSocketStore();

    useEffect(() => {
        socket.emit("join_room", params.roomId);
    }, [])


    if (!rooms.some((room) => room.roomId === params.roomId)) {
        return <div>room not exist</div>
    }

    return (<>
        <Chat />
        <Canvas />
    </>)
}

export default Auth(Room);
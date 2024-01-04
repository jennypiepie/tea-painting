'use client';

import Canvas from "@/components/canvas";
import Chat from "@/components/chat";
import { useSocketStore } from "@/stores/useSocketStore";
import { useEffect } from "react";

export default function Room({ params }: { params: { roomId: string } }) {
    const { socket } = useSocketStore();

    useEffect(() => {
        socket.emit("join_room", params.roomId);
    }, [])
    return (<>
        <Chat />
        <Canvas />
    </>)
}
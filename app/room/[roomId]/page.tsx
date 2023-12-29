'use client';

import Canvas from "@/components/canvas/page";
import Chat from "@/components/chat/page";
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
'use client';

import Auth from "@/components/auth";
import Canvas from "@/components/canvas";
import Chat from "@/components/chat";
import { useSocketStore } from "@/stores/useSocketStore";
import { useEffect } from "react";
import { redirect } from "next/navigation";

function Room({ params }: { params: { roomId: string } }) {
    const { socket } = useSocketStore();

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem('persist-storage') || '');
        const roomId = data.state.roomId;
        if (!roomId || roomId !== params.roomId) {
            redirect("/room");
        } else {
            socket.emit("join_room", params.roomId);
        }
    }, [])

    return (<>
        <Chat />
        <Canvas />
    </>)
}

export default Auth(Room);
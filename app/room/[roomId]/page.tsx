'use client';

import Canvas from "@/components/canvas/page";
import Chat from "@/components/chat/page";
import { useEffect } from "react";

export default function Room({ params }: { params: { roomId: string } }) {

    useEffect(() => {
        // console.log(params.roomId);
    }, [])
    return (<>
        <Chat />
        <Canvas />
    </>)
}
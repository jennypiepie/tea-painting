'use client';

import Auth from "@/components/auth";
import Canvas from "@/components/canvas";
import Chat from "@/components/chat";
import { useAsyncStore } from "@/hooks/useAsyncStore";
import { usePersistStore } from "@/stores/usePersistStore";
import Link from "next/link";

function Room({ params }: { params: { roomId: string } }) {
    const roomId = useAsyncStore(usePersistStore, state => state.roomId);

    if (!roomId) {
        return <div>loading</div>
    } else if (roomId !== params.roomId) {
        return (<>
            <div>room not exist or didn't joined room</div>
            <Link href='/my'>create new Room/ joined room</Link>
        </>)
    }

    return (<>
        <Chat />
        <Canvas />
    </>)
}

export default Auth(Room);
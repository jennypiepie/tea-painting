'use client';
import { useSocketStore } from "@/stores/useSocketStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from 'react';

export default function My() {
    const { rooms, socket } = useSocketStore();
    const [roomId, setRoomId] = useState('');
    const [noRoom, setNoRoom] = useState(false);
    const router = useRouter();

    const createRoom = () => {
        socket.emit("create_room");
    }

    const joinRoom = () => {
        if (rooms.includes(roomId)) {
            setNoRoom(false);
            router.push(`/room/${roomId}`);
        } else {
            setNoRoom(true);
        }
    }

    useEffect(() => {
        socket.on('created', (roomId: string) => {
            router.push(`/room/${roomId}`);
        })
    }, [])

    return (
        <div>
            <span>roomId: </span>
            <input className="border" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <div onClick={joinRoom}>Join</div>
            {noRoom && <div>The roomId does not exist.<Link href='/room'>create a new room?</Link></div>}
            <div className="
                absolute-center
                w-32 h-10 bg-cyan-300 text-center leading-10
                rounded-full cursor-pointer"
                onClick={createRoom}
            >
                create room
            </div>
        </div>
    )
}
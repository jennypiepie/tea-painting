'use client';
import { useSocketStore } from "@/stores/useSocketStore";
import { useUserStore } from "@/stores/useUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {

    const { name, setUser } = useUserStore();
    const { socket, rooms, } = useSocketStore();
    const [roomId, setRoomId] = useState('');
    const [noRoom, setNoRoom] = useState(false);
    const router = useRouter();

    const joinRoom = () => {
        if (rooms.includes(roomId)) {
            setNoRoom(false);
            router.push(`/room/${roomId}`);
        } else {
            setNoRoom(true);
        }
    }

    return (
        <div>
            <span>username: </span>
            <input className="border" value={name} onChange={(e) => setUser(e.target.value)} />
            <span>roomId: </span>
            <input className="border" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <div onClick={joinRoom}>Join</div>
            {noRoom && <div>The roomId does not exist.<Link href='/room'>create a new room?</Link></div>}
        </div>
    )
}
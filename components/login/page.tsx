'use client';
import { useSocketStore } from "@/stores/useSocketStore";
import { useUserStore } from "@/stores/useUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {

    const { name, setUser } = useUserStore();
    const { socket } = useSocketStore();
    const [roomId, setRoomId] = useState('');
    const router = useRouter();

    const joinRoom = () => {
        socket.emit("join_room", roomId);
        router.push(`/room/${roomId}`);
    }

    return (
        <div>
            <span>username: </span>
            <input className="border" value={name} onChange={(e) => setUser(e.target.value)} />
            <span>roomId: </span>
            <input className="border" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <div onClick={joinRoom}>Join</div>
        </div>
    )
}
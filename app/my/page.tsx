'use client';
import Auth from "@/components/auth";
import { usePersistStore } from "@/stores/usePersistStore";
import { useSocketStore } from "@/stores/useSocketStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from 'react';

function My() {
    const { rooms, socket } = useSocketStore();
    const { setSize } = usePersistStore();

    const [noRoom, setNoRoom] = useState(false);
    const router = useRouter();

    const createRoom = (width: number, height: number) => {
        !!setSize && setSize(width, height);
        socket.emit("create_room", { width, height });
    }

    const joinRoom = (roomId: string) => {
        const room = rooms.find(room => room.roomId === roomId);
        if (room) {
            setNoRoom(false);
            !!setSize && setSize(room.width, room.height);
            router.push(`/room/${roomId}`);
        } else {
            setNoRoom(true);
        }
    }

    useEffect(() => {
        const roomCreated = (roomId: string) => {
            router.push(`/room/${roomId}`);
        }
        socket.on('created', roomCreated);
        return () => {
            socket.off('created', roomCreated);
        }
    }, [])

    return (
        <div>
            {noRoom && <div>The roomId does not exist.create a new room?</div>}
            <ul>
                <li onClick={() => createRoom(1920, 1080)}>1920*1080</li>
                <li onClick={() => createRoom(1080, 1920)}>1080*1920</li>
                <li onClick={() => createRoom(800, 600)}>800*600</li>
            </ul>
            <div className="flex bg-slate-200">
                {rooms.map((room) => {
                    return <div key={room.roomId}>
                        <div className="w-28 h-28 bg-slate-400 rounded-lg m-4"
                            onClick={() => joinRoom(room.roomId)}>
                            {room.roomId}
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Auth(My);
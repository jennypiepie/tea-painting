'use client';
import Auth from "@/components/auth";
import { usePersistStore } from "@/stores/usePersistStore";
import { useSocketStore } from "@/stores/useSocketStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from 'react';

function My() {
    const { socket } = useSocketStore();
    const { setRoom } = usePersistStore();

    const [roomId, setRoomId] = useState('');
    const [noRoom, setNoRoom] = useState(false);
    const router = useRouter();

    const createRoom = (width: number, height: number) => {
        socket.emit("create_room", { width, height });
    }

    const joinRoom = () => {
        socket.emit("check", roomId);
    }

    useEffect(() => {
        const roomCreated = (res: any) => {
            setRoom(res.width, res.height, res.roomId);
            router.push(`/room/${res.roomId}`);
        }

        const roomJoined = (res: any) => {
            if (res.exist) {
                setNoRoom(false);
                setRoom(res.width, res.height, res.roomId);
                router.push(`/room/${res.roomId}`);
            } else {
                setNoRoom(true);
            }
        }
        socket.on('created', roomCreated);
        socket.on('room_exist', roomJoined);

        return () => {
            socket.off('created', roomCreated);
            socket.off('room_exist', roomJoined);
        }
    }, [])

    return (
        <div>
            <span>roomId: </span>
            <input className="border" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            {noRoom && <span>The roomId does not exist.create a new room?</span>}
            <div onClick={joinRoom}>Join</div>
            <ul>
                <li onClick={() => createRoom(1920, 1080)}>1920*1080</li>
                <li onClick={() => createRoom(1080, 1920)}>1080*1920</li>
                <li onClick={() => createRoom(800, 600)}>800*600</li>
            </ul>
        </div>
    )
}

export default Auth(My);
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
    const [visible, setVisible] = useState(false);
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
        <div className="w-screen h-screen bg-slate-100">
            <div className="absolute-center flex w-64 bg-green-400 p-2 rounded-2xl justify-between">
                <span className="text-lg font-bold">roomId: </span>
                <input className="w-28 bg-green-400 outline-none"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <div className="cursor-pointer bg-stone-800 text-white w-12 flex justify-center items-center rounded-xl font-semibold"
                    onClick={joinRoom}>
                    Join
                </div>
            </div>
            {noRoom && <p>The roomId does not exist.create a new room?</p>}
            <div className="w-24 h-10 bg-stone-800 text-white font-bold
            flex justify-center items-center rounded-3xl"
                onClick={() => setVisible(true)}
            >
                Create
            </div>
            {visible && <ul className="bg-stone-200 w-32 p-2 rounded-xl cursor-pointer">
                <li className="rounded py-1 px-2 hover:text-white hover:bg-stone-800" onClick={() => createRoom(1920, 1080)}>1920*1080</li>
                <li className="rounded py-1 px-2 hover:text-white hover:bg-stone-800" onClick={() => createRoom(1080, 1920)}>1080*1920</li>
                <li className="rounded py-1 px-2 hover:text-white hover:bg-stone-800" onClick={() => createRoom(800, 600)}>800*600</li>
            </ul>}
        </div>
    )
}

export default Auth(My);
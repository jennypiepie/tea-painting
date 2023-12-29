'use client';
import { useSocketStore } from '@/stores/useSocketStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Room() {
    const { socket } = useSocketStore();
    const router = useRouter();

    const createRoom = () => {
        socket.emit("create_room");
    }
    useEffect(() => {
        socket.on('created', (roomId: string) => {
            router.push(`/room/${roomId}`);
        })
    }, [])
    return (<>
        <div className="
        absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]
        w-32 h-10 bg-cyan-300 text-center leading-10
        rounded-full cursor-pointer"
            onClick={createRoom}
        >
            create room
        </div>
    </>)
}
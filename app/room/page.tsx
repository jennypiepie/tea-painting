'use client';
import { useSocketStore } from '@/stores/useSocketStore';
import { useRouter } from 'next/navigation';

const getRandomString = () => {
    const result = Math.random().toString(36).slice(-5) + Date.now().toString(36).slice(-3);
    return result;
};

export default function Room() {
    const { socket } = useSocketStore();
    const router = useRouter();
    const createRoom = () => {
        const roomId = getRandomString();
        socket.emit("create_room", roomId);
        router.push(`/room/${roomId}`);
    }
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
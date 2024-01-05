'use client';
import { useAsyncStore } from "@/hooks/useAsyncStore";
import { usePersistStore } from "@/stores/usePersistStore";
import { useRouter } from "next/navigation";


export default function Login() {
    const name = useAsyncStore(usePersistStore, state => state.name);
    const { setUser } = usePersistStore();

    const router = useRouter();

    return (
        <div className="absolute-center">
            <span>username: </span>
            <input className="border" value={name || ''} onChange={(e) => setUser && setUser(e.target.value)} />
            <div className="
                w-20 h-8 bg-green-500 rounded-full text-center leading-8 cursor-pointer"
                onClick={() => router.push('/my')}
            >
                submit
            </div>
        </div>
    )
}
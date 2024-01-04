'use client';
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";


export default function Login() {
    const { name, setUser } = useUserStore();
    const router = useRouter();

    return (
        <div className="absolute-center">
            <span>username: </span>
            <input className="border" value={name} onChange={(e) => setUser(e.target.value)} />
            <div className="
                w-20 h-8 bg-green-500 rounded-full text-center leading-8 cursor-pointer"
                onClick={() => router.push('/my')}
            >
                submit
            </div>
        </div>
    )
}
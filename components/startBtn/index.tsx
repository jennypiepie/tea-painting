'use client';
import { useRouter } from "next/navigation";

export default function StartBtn() {
    const router = useRouter();

    return (
        <div className="
            absolute-center w-28 h-10 bg-cyan-300 text-center leading-10
            rounded-full cursor-pointer"
            onClick={() => router.push('/create-account')}
        >
            Get Start
        </div>
    )
}

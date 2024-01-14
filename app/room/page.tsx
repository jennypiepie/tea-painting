'use client';

import Link from "next/link";

export default function Room() {
    return (<>
        <div className="absolute-center text-2xl font-bold">
            <div>room not exist or didn't joined room</div>
            <Link href='/my' className="underline decoration-solid">create or join room?</Link>
        </div>
    </>)
}
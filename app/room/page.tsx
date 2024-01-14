'use client';

import Link from "next/link";

export default function Room() {
    return (<>
        <div>room not exist or didn't joined room</div>
        <Link href='/my'>create or join room?</Link>
    </>)
}
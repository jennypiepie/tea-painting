'use client';

import { useState } from "react";
import { useSocketStore } from "@/stores/useSocketStore";
import { useAsyncStore } from "@/hooks/useAsyncStore";
import { usePersistStore } from "@/stores/usePersistStore";

const dateFormat = (time: Date) => {
    // const day = time.getDate();
    // const month = time.getMonth();
    // const year = time.getFullYear();
    const hour = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
    const minute = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
    const res = `${hour}:${minute}`
    return res;
}

export default function Chat() {
    const [message, setMessage] = useState("");
    const { messageList, sendMessage } = useSocketStore();
    const name = useAsyncStore(usePersistStore, state => state.name);

    const handleSubmit = () => {
        const tString = dateFormat(new Date());
        !!message &&
            sendMessage({
                username: name,
                message: message,
                time: tString,
            })
        setMessage('');
    }

    return (
        <div className="
        absolute right-2 bottom-2 
        w-64 h-72 min-w-[220px] box-border
        p-2 z-10 bg-white rounded-lg
        flex flex-col justify-between border cursor-default
        ">
            <div className="h-10 bg-slate-300">Chat</div>
            <div className="flex-auto">
                {messageList.map((item, index) => {
                    return <div key={index}>{item}</div>
                })}
            </div>
            <div className="
            h-10 w-full p-2 flex justify-between
            rounded-2xl bg-stone-800 
            ">
                <div className="flex-auto px-2">
                    <input
                        className="w-full bg-stone-800 text-white outline-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div className="w-[50px] bg-green-300 ml-2 rounded-lg text-center align-middle">
                    <button onClick={handleSubmit}>Send</button>
                </div>
            </div>
        </div>
    )
}

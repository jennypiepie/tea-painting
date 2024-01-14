'use client';

import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "@/stores/useSocketStore";
import { useAsyncStore } from "@/hooks/useAsyncStore";
import { usePersistStore } from "@/stores/usePersistStore";
import ChatItem from "./chatItem";
import SVG from "../svgs";

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
    const contextRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        contextRef.current!.scrollTop = contextRef.current!.scrollHeight;
    }, [messageList.length])

    return (
        <div className="
        absolute right-2 bottom-2 
        w-64 h-72 box-border
        p-2 z-10 bg-white rounded-lg
        flex flex-col justify-between border cursor-default
        ">
            <div className="h-10 border-b-2 border-stone-800 font-bold">Chat</div>
            <div className="flex-auto overflow-auto m-1" ref={contextRef}>
                {messageList.map((item, index) => <ChatItem message={item} key={index} isSelf={item.split(',')[0] === name} />)}
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
                <div className="w-14 h-6 bg-green-400 ml-2 rounded-lg cursor-pointer" onClick={handleSubmit}>
                    {SVG.send({
                        style: {
                            width: '100%',
                            height: '100%',
                            fill: 'white',
                        },
                    })}
                </div>
            </div>
        </div>
    )
}

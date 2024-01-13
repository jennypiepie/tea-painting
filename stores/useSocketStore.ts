import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { combine } from "zustand/middleware";

interface Point {
    x: number,
    y: number
}

export interface Execution {
    type: "Draw" | "Eraser" | "Undo" | "Redo" | "BgColor" | "Clear";
    points?: Point[];
    color?: string;
    lineWidth?: number;
}

interface ISocketStore {
    socket: Socket;
    isConnected: boolean;
    messageList: string[];
    execution: Execution | null;
}
const clientIO = io(`${process.env.NEXT_PUBLIC_URL}`, {
    path: '/api/socket/io',
    addTrailingSlash: false,
});

const initialState: ISocketStore = {
    socket: clientIO,
    isConnected: false,
    messageList: [],
    execution: null,
}

const mutations = (set: any, get: any) => {
    clientIO
        .on("connect", () => {
            set({ isConnected: true });
        })
        .on("disconnect", () => {
            set({ isConnected: false });
        })
        .on('receive_message', (data: any) => {
            const { username, message, time } = data;
            const newList = [...get().messageList, `${username || ''},${message},${time}`];
            set({ messageList: newList });
        })
        .on('execute_receive', (execution) => {
            set({ execution });
        })

    return {
        sendMessage(data: any) {
            clientIO.emit('send_message', {
                ...data
            })
        },
    };
};

export const useSocketStore = create(combine(initialState, mutations));
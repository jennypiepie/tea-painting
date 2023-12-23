import { Socket } from "socket.io-client";
import { create } from "zustand";

interface ISocketStore {
    socket: Socket | null;
    isConnected: boolean;
    setSocket: (socket: Socket) => void;
    setIsConnected: (isConnected: boolean) => void;
}

export const useSocketStore = create<ISocketStore>((set) => ({
    socket: null,
    isConnected: false,
    setSocket: (socket) => set(() => {
        return {
            socket
        }
    }),
    setIsConnected: (isConnected) => set(() => {
        return {
            isConnected
        }
    })
}))
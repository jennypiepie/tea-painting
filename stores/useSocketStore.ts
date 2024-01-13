import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { combine } from "zustand/middleware";

interface RoomInfo {
    roomId: string;
    width: number;
    height: number;
}

interface Point {
    x: number,
    y: number
}

export interface Execution {
    type: "Draw" | "Eraser" | "Undo" | "Redo" | "BgColor" | "Clear" | "Bucket";
    points?: Point[];
    color?: string;
    lineWidth?: number;
    point?: Point;
    colorArr?: number[];
}

interface ISocketStore {
    socket: Socket;
    isConnected: boolean;
    messageList: string[];
    rooms: RoomInfo[],
    execution: Execution | null;
    initial: any[];
}
const clientIO = io(`${process.env.NEXT_PUBLIC_URL}`, {
    path: '/api/socket/io',
    addTrailingSlash: false,
});

const initialState: ISocketStore = {
    socket: clientIO,
    isConnected: false,
    messageList: [],
    rooms: [],
    execution: null,
    initial: [],
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
        .on('get_rooms', (rooms: RoomInfo[]) => {
            set({ rooms });
        })
        .on('execute_receive', (execution) => {
            set({ execution });
        })
        .on('initial_state', (initial) => {
            set({ initial })
        });

    return {
        sendMessage(data: any) {
            clientIO.emit('send_message', {
                ...data
            })
        },
        clearInitial() {
            set({ initial: [] });
        }
    };
};

export const useSocketStore = create(combine(initialState, mutations));
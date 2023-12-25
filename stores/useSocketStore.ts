import { io } from "socket.io-client";
import { create } from "zustand";
import { combine } from "zustand/middleware";

// interface ISocketStore {
//     socket: Socket;
//     isConnected: boolean;
//     messageList: string[];
// }

const clientIO = io(`${process.env.NEXT_PUBLIC_URL}`, {
    path: '/api/socket/io',
    addTrailingSlash: false,
});

const initialState = {
    socket: clientIO,
    isConnected: false,
    messageList: [],
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
            const newList = [...get().messageList, `${username || 'visitor'}: ${message}————${time}`];
            // console.log(data);
            set({ messageList: newList });
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
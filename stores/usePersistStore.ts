import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IPersistStore {
    width: number;
    height: number;
    roomId: string;
    name: string;
    setUser: (name: string) => void;
    setRoom: (width: number, height: number, roomId: string) => void;
}

export const usePersistStore = create<IPersistStore>()(persist(
    (set) => ({
        width: 1920,
        height: 1080,
        roomId: '',
        name: '',
        setUser: (name: string) => set({ name }),
        setRoom: (width: number, height: number, roomId: string) => set(() => {
            return {
                roomId,
                width,
                height
            }
        })
    }),
    {
        name: 'persist-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
))
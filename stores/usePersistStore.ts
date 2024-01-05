import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IPersistStore {
    width: number;
    height: number;
    scale: number;
    name: string;
    setUser: (name: string) => void;
    setSize: (width: number, height: number) => void;
}

export const usePersistStore = create<IPersistStore>()(persist(
    (set) => ({
        width: 1920,
        height: 1080,
        scale: 0.5,
        name: 'visitor',
        setUser: (name: string) => set({ name }),
        setSize: (width: number, height: number) => set(() => {
            // const clientWidth = document.body.clientWidth;
            // const clientHeight = document.body.clientHeight;

            return {
                width,
                height
            }
        })
    }),
    {
        name: 'persist-storage',
        storage: createJSONStorage(() => localStorage),
    }
))
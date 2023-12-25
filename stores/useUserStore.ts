import { create } from "zustand";

interface IUserStore {
    name: string;
    setUser: (name: string) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
    name: '',
    setUser: (name) => set(() => {
        return {
            name
        }
    }),
}))
import Sketch from "@/lib/sketch";
import { create } from "zustand";

interface ISketchStore {
    sketch: Sketch | null;
    initSketch: (sketch: Sketch) => void;
}

export const useSketchStore = create<ISketchStore>((set) => ({
    sketch: null,
    initSketch: (sketch) => set(() => {
        return {
            sketch
        }
    }),
}))
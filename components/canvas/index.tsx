'use client';

import { useEffect, useRef } from "react";
import { useSocketStore } from "@/stores/useSocketStore";
import Toolbar from "../toolbar";
import { useSketchStore } from "@/stores/useSketchStore";
import Sketch from "@/lib/sketch";
import { usePersistStore } from "@/stores/usePersistStore";
import { useAsyncStore } from "@/hooks/useAsyncStore";

export default function Canvas() {
    const sketchRef = useRef<Sketch>();
    const { socket, operations } = useSocketStore();
    const { initSketch } = useSketchStore();
    const width = useAsyncStore(usePersistStore, state => state.width);
    const height = useAsyncStore(usePersistStore, state => state.height);
    const scale = useAsyncStore(usePersistStore, state => state.scale);

    useEffect(() => {
        if (width && height && scale) {
            sketchRef.current = new Sketch(socket);
            initSketch(sketchRef.current)
        }
        return () => sketchRef.current?.clear();
    }, [width, height, scale])

    useEffect(() => {
        if (operations.length !== 0 && !!sketchRef.current) {
            const { points, color, lineWidth } = operations[operations.length - 1];
            sketchRef.current.setPen({ color, lineWidth });
            sketchRef.current.draw(points);
        }
    }, [operations.length])

    return (<>
        <div className="absolute top-0 left-0 w-full h-full bg-gray-300">
            <Toolbar />
            <div
                className={"bg-white top-1/2 left-1/2 absolute"}
                style={{ width: width, height: height, transform: `translate(-50%, -50%) scale(${scale})` }}
            >
                <canvas
                    className="absolute top-0 left-0"
                    width={width} height={height}
                    id="canvas"
                >
                </canvas>
            </div>
        </div>
    </>)
}
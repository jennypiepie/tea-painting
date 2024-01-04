'use client';

import { useEffect, useRef } from "react";
import { useSocketStore } from "@/stores/useSocketStore";
import Toolbar from "../toolbar";
import { useSketchStore } from "@/stores/useSketchStore";
import Sketch from "@/lib/sketch";

export default function Canvas() {
    const sketchRef = useRef<Sketch>();
    const { socket, operations } = useSocketStore();
    const { initSketch } = useSketchStore();

    useEffect(() => {
        sketchRef.current = new Sketch(socket);
        initSketch(sketchRef.current)
        if (operations.length !== 0 && !!sketchRef.current) {
            const { points, color, lineWidth } = operations[operations.length - 1];
            sketchRef.current.setPen({ color, lineWidth });
            sketchRef.current.draw(points);

        }
        return () => sketchRef.current?.clear();
    }, [operations.length])

    return (<>
        <div className="absolute top-0 left-0 w-full h-full bg-gray-300">
            <Toolbar />
            <div className="bg-white w-[800px] h-[600px] absolute-center">
                <canvas
                    className="absolute top-0 left-0"
                    width="800" height="600"
                    id="canvas"
                >
                </canvas>
            </div>
        </div>/
    </>)
}
'use client';

import Sketch from "@/lib/sketch";
import { useEffect } from "react";
import { useSocketStore } from "@/stores/useSocketStore";

export default function Canvas() {
    const { socket, paths } = useSocketStore();
    let sketch: Sketch;

    useEffect(() => {
        !sketch && (sketch = new Sketch(socket));
        if (paths.length !== 0 && !!sketch) {
            const path = paths[paths.length - 1];
            const begin = path.shift();
            sketch.begin(begin.x, begin.y);
            while (path.length > 0) {
                const point = path.shift();
                sketch.draw(point.x, point.y);
            }
            sketch.ctx.closePath();
        }
    }, [paths.length])

    return (<>
        <div className="absolute top-0 left-0 w-full h-full bg-cyan-300">
            <canvas
                className="absolute bg-white top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]"
                width="800" height="600"
                id="canvas"
            >
            </canvas>
        </div>/
    </>)
}
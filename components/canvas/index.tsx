'use client';

import { useEffect, useRef } from "react";
import { useSocketStore } from "@/stores/useSocketStore";
import Toolbar from "../toolbar";
import { useSketchStore } from "@/stores/useSketchStore";
import Sketch from "@/lib/sketch";
import { usePersistStore } from "@/stores/usePersistStore";
import { useAsyncStore } from "@/hooks/useAsyncStore";

const debounce = (func: Function, delay: number) => {
    let timeId: number;
    return function (...args: any[]) {
        clearTimeout(timeId);
        timeId = setTimeout(() => {
            func(...args);
        }, delay) as unknown as number;
    }
}

export default function Canvas() {
    const sketchRef = useRef<Sketch>();
    const { socket, operations } = useSocketStore();
    const { initSketch } = useSketchStore();
    const width = useAsyncStore(usePersistStore, state => state.width);
    const height = useAsyncStore(usePersistStore, state => state.height);
    const containerRef = useRef<HTMLDivElement>(null);
    let scale2 = 0.5;

    const Scale = (delta: number) => {
        const maxScale = 5;
        const minScale = 0.1;
        if (delta > 0) {
            scale2 *= 1.1;
            if (scale2 > maxScale) {
                scale2 = maxScale;
            }
        } else {
            scale2 *= 0.9;
            if (scale2 < minScale) {
                scale2 = minScale;
            }
        }
        containerRef.current!.style.transform = `translate(-50%, -50%) scale(${scale2.toFixed(1)})`;
        sketchRef.current!.setScale(Number(scale2.toFixed(1)));
    }
    const onScale = debounce(Scale, 10);

    useEffect(() => {
        if (width && height && !sketchRef.current) {
            sketchRef.current = new Sketch(socket);
            initSketch(sketchRef.current)
        }
        return () => sketchRef.current?.clear();
    }, [width, height])

    useEffect(() => {
        if (operations.length !== 0 && !!sketchRef.current) {
            const { points, color, lineWidth } = operations[operations.length - 1];
            sketchRef.current.setPen({ color, lineWidth });
            sketchRef.current.draw(points);
        }
    }, [operations.length])

    return (<>
        <div
            className="absolute top-0 left-0 w-full h-full bg-gray-300 overflow-hidden"
            onWheel={(e) => onScale(e.deltaY)}
        >
            <Toolbar />
            <div
                ref={containerRef}
                id='canvas-container'
                className={"bg-white top-1/2 left-1/2 absolute"}
                style={{ width: width, height: height, transform: ` translate(-50%, -50%) scale(${0.5})` }}
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
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
    const { socket, execution } = useSocketStore();
    const { initSketch } = useSketchStore();
    const width = useAsyncStore(usePersistStore, state => state.width);
    const height = useAsyncStore(usePersistStore, state => state.height);
    const containerRef = useRef<HTMLDivElement>(null);
    let scale = 0.5;

    const Scale = (delta: number) => {
        const maxScale = 5;
        const minScale = 0.1;
        if (delta > 0) {
            scale *= 1.05;
            if (scale > maxScale) {
                scale = maxScale;
            }
        } else {
            scale *= 0.97;
            if (scale < minScale) {
                scale = minScale;
            }
        }
        containerRef.current!.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(1)})`;
        sketchRef.current!.setScale(Number(scale.toFixed(1)));
    }
    const onScale = debounce(Scale, 10);

    useEffect(() => {
        if (width && height && !sketchRef.current) {
            sketchRef.current = new Sketch(socket);
            initSketch(sketchRef.current)
        }
        return () => sketchRef.current?.destory();
    }, [width, height])

    useEffect(() => {
        if (execution !== null && !!sketchRef.current) {
            const { points, color, lineWidth, type } = execution;
            if (type === "Undo") {
                sketchRef.current.undo();
            } else if (type === "Redo") {
                sketchRef.current.redo();
            } else {
                if (type === "BgColor") {
                    sketchRef.current.setBg(color);
                } else if (type === "Clear") {
                    sketchRef.current.clear();
                } else {
                    sketchRef.current.setPen({ type, color, lineWidth });
                    sketchRef.current.draw(points!);
                }
                sketchRef.current.pushUndo(execution);
            }
        }
    }, [execution])

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
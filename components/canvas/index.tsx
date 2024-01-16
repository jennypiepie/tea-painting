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
    const { socket, execution, initial, clearInitial } = useSocketStore();
    const { initSketch } = useSketchStore();
    const width = useAsyncStore(usePersistStore, state => state.width);
    const height = useAsyncStore(usePersistStore, state => state.height);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (width && height && !sketchRef.current) {
            sketchRef.current = new Sketch(socket);
            initSketch(sketchRef.current)
        }
        return () => sketchRef.current?.destory();
    }, [width, height])

    const execute = (exe: any) => {
        sketchRef.current!.ctx.save();
        sketchRef.current!.preCtx.save();
        const { points, color, lineWidth, type, point, colorArr } = exe;
        if (type === "Undo") {
            sketchRef.current!.undo();
        } else if (type === "Redo") {
            sketchRef.current!.redo();
        } else {
            if (type === "Clear") {
                sketchRef.current!.clear();
            } else if (type === "Bucket") {
                sketchRef.current!.fill(point.x, point.y, colorArr);
            }
            else {
                sketchRef.current!.setPen({ type, color, lineWidth });
                sketchRef.current!.draw(points!);
            }
            sketchRef.current!.pushUndo(exe);
        }
        sketchRef.current!.ctx.restore();
        sketchRef.current!.preCtx.restore();
    }


    useEffect(() => {
        if (initial && initial.length !== 0 && !!sketchRef.current) {
            initial.forEach(exe => {
                execute(exe);
            })
            clearInitial();
        }

        return () => {
            clearInitial();
        }
    }, [initial, sketchRef.current])

    useEffect(() => {
        if (execution !== null && !!sketchRef.current) {
            execute(execution);
        }
    }, [execution])

    return (<>
        <div className="absolute top-0 left-0 w-full h-full bg-gray-300 overflow-hidden">
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
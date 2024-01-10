'use client';

import eventEmitter from "@/lib/eventEmitter";
import { useSketchStore } from "@/stores/useSketchStore";
import { useEffect, useRef, useState } from "react";

interface ICursorProps {
    point: { x: number, y: number }
}

export default function Cursor({ point }: ICursorProps) {
    const { sketch } = useSketchStore();
    const cursorRef = useRef<HTMLDivElement>(null);
    const [strawColor, setStrawColor] = useState('transparent');
    const size = 32;

    useEffect(() => {
        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
        }
        const strawColorChange = (color: string) => {
            setStrawColor(color);
        }
        const mouseMove = (e: MouseEvent) => {
            sketch?.cursorMove(e);
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX - size / 2}px, ${e.clientY - size / 2}px, 0)`;
            }
        };

        const mouseUp = (e: MouseEvent) => {
            sketch?.cursorUp(e);
        };

        eventEmitter.on('straw', strawColorChange);
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);

        return () => {
            eventEmitter.off('straw', setStrawColor);
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }
    }, [])

    return (
        <div
            className="w-[32px] h-[32px] rounded-full bg-transparent flex justify-center items-center absolute z-10"
            style={{
                border: `6px solid ${strawColor}`,
                width: size,
                height: size,
            }}
            ref={cursorRef} id="cursor"
        >
            +
        </div>
    )
}
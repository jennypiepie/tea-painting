'use client';

import eventEmitter from "@/lib/eventEmitter";
import { useSketchStore } from "@/stores/useSketchStore";
import { useEffect, useRef, useState } from "react";

interface IDropperProps {
    point: { x: number, y: number }
}

export default function Dropper({ point }: IDropperProps) {
    const { sketch } = useSketchStore();
    const dropperRef = useRef<HTMLDivElement>(null);
    const [dropperColor, setDropperColor] = useState('transparent');
    const size = 32;

    useEffect(() => {
        if (dropperRef.current) {
            dropperRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
        }
        const dropperColorChange = (color: string) => {
            setDropperColor(color);
        }
        const mouseMove = (e: MouseEvent) => {
            sketch?.dropperMove(e);
            if (dropperRef.current) {
                dropperRef.current.style.transform = `translate3d(${e.clientX - size / 2}px, ${e.clientY - size / 2}px, 0)`;
            }
        };

        const click = (e: MouseEvent) => {
            sketch?.dropperrClick(e);
        };

        eventEmitter.on('drop', dropperColorChange);
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('click', click);

        return () => {
            eventEmitter.off('drop', setDropperColor);
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('click', click);
        }
    }, [])

    return (
        <div
            className="w-[32px] h-[32px] rounded-full bg-transparent flex justify-center items-center absolute z-10"
            style={{
                border: `6px solid ${dropperColor}`,
                width: size,
                height: size,
            }}
            ref={dropperRef} id="dropper"
        >
            +
        </div>
    )
}
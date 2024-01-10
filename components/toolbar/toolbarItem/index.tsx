'use client';
import SVG from "@/components/svgs";

interface IToolbarProps {
    type: string;
    scale?: number;
    selected?: boolean;
    onClick: (e: any) => void;
}

export default function ToolbarItem({ onClick, type, scale = 0.8, selected = false }: IToolbarProps) {

    return (
        <div
            className={`w-8 h-8 rounded flex justify-center items-center ${selected ? 'bg-green-400' : "bg-stone-800"}`}
            onClick={(e) => onClick(e)}
        >
            {SVG[type as keyof typeof SVG]({
                style: {
                    width: '100%', height: '100%', fill: selected ? 'black' : 'white', transform: `scale(${scale})`
                }
            })}
        </div>
    )
}
'use client';

import { useState } from "react";
import Picker from "../picker";
import ToolbarItem from "./toolbarItem";
import { useSketchStore } from "@/stores/useSketchStore";


export default function Toolbar() {
    const [width, setWidth] = useState(1);
    const [isDrag, setIsDrag] = useState(false);
    const { sketch } = useSketchStore();

    const setPenWidth = (lineWidth: number) => {
        setWidth(lineWidth);
        sketch?.setPen({ lineWidth });
    }

    const changeState = () => {
        sketch?.state === "Drag" ?
            (sketch?.changeState("Draw"), setIsDrag(false)) :
            (sketch?.changeState("Drag"), setIsDrag(true));
    }

    return (
        <div className="absolute top-1/3 left-10 rounded-lg overflow-hidden z-10">
            <Picker />
            <input type="range" min="1" max="40" value={width} onChange={(e) => setPenWidth(Number(e.target.value))} />
            <span>{width}</span>
            <div className="w-8 h-8" style={{ background: isDrag ? 'green' : 'white' }} onClick={changeState}>Drag</div>
            {/* <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem /> */}
        </div>
    )
}
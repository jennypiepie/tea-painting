'use client';

import { useState } from "react";
import Picker from "../picker";
import ToolbarItem from "./toolbarItem";
import { useSketchStore } from "@/stores/useSketchStore";


export default function Toolbar() {
    const [width, setWidth] = useState(1);
    const { sketch } = useSketchStore();

    const setPenWidth = (lineWidth: number) => {
        setWidth(lineWidth);
        sketch?.setPen({ lineWidth });
    }

    return (
        <div className="absolute top-1/3 left-10 rounded-lg overflow-hidden">
            <Picker />
            <input type="range" min="1" max="20" value={width} onChange={(e) => setPenWidth(Number(e.target.value))} />
            {/* <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem /> */}
        </div>
    )
}
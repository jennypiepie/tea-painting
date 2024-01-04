'use client';

import { useSketchStore } from "@/stores/useSketchStore";
import { useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";

export default function Picker() {
    const [color, setColor] = useState("rgb(0,0,0,1)");
    const { sketch } = useSketchStore();

    const setPenColor = (color: string) => {
        setColor(color)
        sketch?.setPen({ color });
    }

    return (
        <div className="fixed top-2 left-2">
            <RgbaStringColorPicker color={color} onChange={(color) => setPenColor(color)} />
        </div>
    )
}

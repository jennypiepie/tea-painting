'use client';

import { useEffect, useState } from "react";
import Picker from "../picker";
import ToolbarItem from "./toolbarItem";
import { useSketchStore } from "@/stores/useSketchStore";
import { SketchState } from "@/lib/sketch";
import { useSocketStore } from "@/stores/useSocketStore";


export default function Toolbar() {
    const [width, setWidth] = useState(1);
    const [state, setState] = useState<SketchState>("Draw");
    const { socket } = useSocketStore();
    // const [undoAble, setUndoAble] = useState(false);
    // const [redoAble, setRedoAble] = useState(false);

    const { sketch } = useSketchStore();

    const setPenWidth = (lineWidth: number) => {
        setWidth(lineWidth);
        sketch?.setPen({ lineWidth });
    }

    const setDrag = () => {
        sketch?.state === "Drag" ? setState("Draw") : setState("Drag");
    }

    const setEraser = () => {
        sketch?.state === "Eraser" ? setState("Draw") : setState("Eraser");
    }

    const undo = () => {
        sketch?.undo();
        socket.emit('execute', { type: 'Undo' });
    }

    const redo = () => {
        sketch?.redo();
        socket.emit('execute', { type: 'Redo' });
    }

    useEffect(() => {
        sketch?.changeState(state);
    }, [state])

    return (
        <div className="absolute top-2 left-10 rounded-lg overflow-hidden z-10 select-none">
            <Picker />
            <div>
                <input type="range" min="1" max="40" value={width} onChange={(e) => setPenWidth(Number(e.target.value))} />
                <span>{width}</span>
            </div>
            <div className={`w-8 h-8 ${state === "Eraser" ? 'bg-green-400' : 'bg-white'}`}
                onClick={setEraser}
            >
                eraser
            </div>
            <div className={`w-8 h-8 ${state === "Drag" ? 'bg-green-400' : 'bg-white'}`}
                onClick={setDrag}
            >
                Drag
            </div>
            <div>
                <span className="bg-orange-200" onClick={undo}>undo</span>
                <span className="bg-orange-200 ml-2" onClick={redo}>redo</span>
            </div>
            <div className="w-8 h-8 bg-orange-200" onClick={() => sketch?.clear()}>Clear</div>
            <div className="w-8 h-8 bg-orange-200">Save</div>
            {/* <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem /> */}
        </div>
    )
}
'use client';

import { useState } from "react";
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

    const stateChange = (state: SketchState) => {
        setState(state);
        sketch?.changeState(state);
    }

    const undo = () => {
        sketch?.undo();
        socket.emit('execute', { type: 'Undo' });
    }

    const redo = () => {
        sketch?.redo();
        socket.emit('execute', { type: 'Redo' });
    }

    const setBg = () => {
        sketch?.setBg();
        socket.emit('execute', { type: 'BgColor', color: sketch?.bgColor });
        sketch?.pushUndo({ type: 'BgColor', color: sketch?.bgColor });
    }

    return (<>
        <div className="absolute z-10 select-none top-2 right-6">
            <Picker />
            <div>
                <input type="range" min="1" max="40" value={width} onChange={(e) => setPenWidth(Number(e.target.value))} />
                <span>{width}</span>
            </div>
        </div>
        <div className="absolute top-10 left-10 rounded-lg overflow-hidden text-sm text-white p-1 bg-stone-800">
            <div className={`w-8 h-8 rounded ${state === "Draw" ? 'bg-green-400' : 'bg-stone-800'}`}
                onClick={() => stateChange('Draw')}
            >
                pen
            </div>
            <div className={`w-8 h-8 rounded ${state === "Draw" ? 'bg-green-400' : 'bg-stone-800'}`}
            // onClick={() => stateChange('Draw')}
            >
                absorb
            </div>
            <div className={`w-8 h-8 rounded ${state === "Eraser" ? 'bg-green-400' : 'bg-stone-800'}`}
                onClick={() => stateChange('Eraser')}
            >
                eraser
            </div>
            <div className={`w-8 h-8 rounded ${state === "Drag" ? 'bg-green-400' : 'bg-stone-800'}`}
                onClick={() => stateChange('Drag')}
            >
                Drag
            </div>
            <div className={"w-8 h-8 bg-stone-800"}
                onClick={setBg}
            >
                BG
            </div>
            <div className="w-8 h-8 bg-stone-800" onClick={undo}>undo</div>
            <div className="w-8 h-8 bg-stone-800" onClick={redo}>redo</div>
            <div className="w-8 h-8 bg-stone-800" onClick={() => sketch?.clear()}>Clear</div>
            <div className="w-8 h-8 bg-stone-800">Save</div>
            {/* <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem />
            <ToolbarItem /> */}
        </div>
    </>)
}
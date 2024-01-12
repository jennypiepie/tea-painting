'use client';

import { useState } from "react";
import Picker from "../picker";
import ToolbarItem from "./toolbarItem";
import { useSketchStore } from "@/stores/useSketchStore";
import { SketchState } from "@/lib/sketch";
import { useSocketStore } from "@/stores/useSocketStore";
import Cursor from "../cursor";


export default function Toolbar() {
    const [state, setState] = useState<SketchState>("Draw");
    const [point, setPoint] = useState({ x: 0, y: 0 });
    const { socket } = useSocketStore();
    // const [undoAble, setUndoAble] = useState(false);
    // const [redoAble, setRedoAble] = useState(false);

    const { sketch } = useSketchStore();


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
        const isChange = sketch?.setBg();
        if (isChange) {
            socket.emit('execute', { type: 'BgColor', color: sketch?.bgColor });
            sketch?.pushUndo({ type: 'BgColor', color: sketch?.bgColor });
        }
    }

    const straw = (x: number, y: number) => {
        stateChange('Straw');
        setPoint({ x, y });
    }

    const clear = () => {
        sketch?.clear();
        socket.emit('execute', { type: 'Clear' });
        sketch?.pushUndo({ type: 'Clear' });
    }

    const save = () => {
        const dataUrl = sketch?.save()!;
        const el = document.createElement('a');
        el.href = dataUrl;
        el.download = 'download';

        const event = new MouseEvent('click');
        el.dispatchEvent(event);
    }

    return (<>
        {state === 'Straw' && <Cursor point={point} />}
        <div className="absolute z-10 select-none top-2 right-6">
            <Picker />
        </div>
        <div className="absolute top-10 left-10 rounded-lg overflow-hidden text-sm text-white p-1 bg-stone-800 select-none z-10 cursor-pointer">
            <ToolbarItem type="drag" onClick={() => stateChange('Drag')} selected={state === "Drag"} scale={0.7} />
            <ToolbarItem type="draw" onClick={() => stateChange('Draw')} selected={state === "Draw"} />
            <ToolbarItem type="eraser" onClick={() => stateChange('Eraser')} selected={state === "Eraser"} scale={0.7} />
            <ToolbarItem type="straw" onClick={(e) => straw(e.clientX, e.clientY)} selected={state === "Straw"} scale={0.7} />
            <ToolbarItem type="bg" onClick={setBg} />
            <ToolbarItem type="undo" onClick={undo} />
            <ToolbarItem type="redo" onClick={redo} />
            <ToolbarItem type="clear" onClick={clear} />
            <ToolbarItem type="save" onClick={save} scale={0.7} />
        </div>
    </>)
}
'use client';

import { useSketchStore } from "@/stores/useSketchStore";
import { useEffect, useReducer, useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";
import eventEmitter from "@/lib/eventEmitter";

interface ColorState {
    rgba: string,
    r: number,
    g: number,
    b: number,
    alpha: number,
    hex: string,
}

interface ColorAction {
    type: 'ColorChange';
    payload: ColorState;
}

const initialState = {
    rgba: "rgba(0,0,0,1)",
    r: 0,
    g: 0,
    b: 0,
    alpha: 100,
    hex: "000000",
};

function colorReducer(state: ColorState, { type, payload }: ColorAction) {
    switch (type) {
        case 'ColorChange':
            return {
                rgba: payload.rgba,
                r: payload.r,
                g: payload.g,
                b: payload.b,
                alpha: payload.alpha,
                hex: payload.hex,
            };
        default:
            throw new Error();
    }
}

export default function Picker() {
    const { sketch } = useSketchStore();
    const [state, dispatch] = useReducer(colorReducer, initialState);
    const [width, setWidth] = useState(1);

    const changeColor = (type: keyof ColorState, value: string) => {
        if (type !== 'hex' && type !== 'rgba' && !isRgbaColor(value)) return;
        if (type === 'hex' && !isHexColor(value)) return;
        const colorObj = colorConvert(type, value);
        sketch?.setPen({ color: colorObj.rgba });
        dispatch({
            type: 'ColorChange',
            payload: {
                ...colorObj
            }
        })
    }

    const isHexColor = (hex: string) => {
        return hex.length <= 6 && !isNaN(Number('0x' + (hex || 0)));
    }

    const isRgbaColor = (rgba: string) => {
        return !isNaN(Number(rgba)) && Number(rgba) < 256;
    }

    const colorConvert = (type: keyof ColorState, value: string) => {
        const arr = state.rgba.replace(/^rgba?\(|\s+|\)$/g, '').split(',').map(Number);
        let alpha = Math.round((arr[3] || 1) * 100);
        if (type === 'hex') {
            if (value.length !== 3 && value.length !== 6) {
                return {
                    ...state,
                    hex: value
                }
            }
            const hexString = value;
            if (value.length === 3) {
                value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
            }
            const r = parseInt(value.slice(0, 2), 16);
            const g = parseInt(value.slice(2, 4), 16);
            const b = parseInt(value.slice(4, 6), 16);
            return {
                rgba: `rgba(${r},${g},${b},${arr[3]})`,
                r,
                g,
                b,
                alpha,
                hex: hexString
            }
        } else if (type === 'rgba') {
            const arr = value.replace(/^rgba?\(|\s+|\)$/g, '').split(',').map(Number);
            const alpha = Math.round(arr[3] * 100);
            const hex = arr.slice(0, -1).map(item => item.toString(16).padStart(2, '0')).join('');
            return {
                rgba: value,
                r: arr[0],
                g: arr[1],
                b: arr[2],
                alpha,
                hex
            }
        } else {
            switch (type) {
                case "r": arr[0] = Number(value);
                    break;
                case "g": arr[1] = Number(value);
                    break;
                case "b": arr[2] = Number(value);
                    break;
                case "alpha": arr[3] = Math.round(Number(value) / 100);
                    break;
            }
            const hex = arr.slice(0, -1).map(item => item.toString(16).padStart(2, '0')).join('');
            return {
                rgba: `rgba(${arr.join(', ')})`,
                r: arr[0],
                g: arr[1],
                b: arr[2],
                alpha,
                hex
            }
        }
    }

    const colorItem = (type: keyof ColorState) => {
        if (type === 'rgba') return null;
        return (
            <div className={`text-center ${type === 'hex' ?
                'w-14 before:content-["#"] before:absolute before:right-[4.25rem] ml-2' :
                'w-8'}`}
                key={type}
            >
                <input type="text"
                    className="bg-stone-600 outline-none w-full rounded "
                    value={state[type]}
                    onChange={(e) => changeColor(type, e.target.value)}
                />
                <span className="inline-block capitalize">{type}</span>
            </div>
        )
    }

    const setPenWidth = (lineWidth: number) => {
        setWidth(lineWidth);
        sketch?.setPen({ lineWidth });
    }

    useEffect(() => {
        eventEmitter.on('colorChange', changeColor);
        return () => {
            eventEmitter.off('colorChange', changeColor);
        }
    }, [])

    return (
        <div className="top-2 left-2">
            <RgbaStringColorPicker color={state.rgba} onChange={(color) => changeColor('rgba', color)} />
            <div className="bg-stone-800 px-3 pb-4 w-60 rounded-b-xl text-white text-sm cursor-default">
                <div className="flex justify-between">
                    {Object.keys(state).map(key => colorItem(key as keyof ColorState))}
                </div>
                <div className="h-8 w-8 absolute pr-4 top-40 right-4 rounded-xl"
                    style={{ backgroundColor: `rgb(${state.r},${state.g},${state.b})` }}
                />
                <div className="flex justify-between mt-2">
                    <input
                        type="range"
                        min="1" max="40"
                        value={width}
                        onChange={(e) => setPenWidth(Number(e.target.value))} />
                    <span>{`${width}px`}</span>
                </div>
            </div>
        </div>
    )
}

import { Execution } from "@/stores/useSocketStore";
import { Socket } from "socket.io-client";
import eventEmitter from "./eventEmitter";

interface Point {
    x: number,
    y: number
}

interface PenConfig {
    type?: "Draw" | "Eraser";
    color?: string;
    lineWidth?: number;
}

export type SketchState = "Draw" | "Drag" | "Eraser" | "Straw";

class Sketch {
    canvas: HTMLCanvasElement;
    preview: HTMLCanvasElement;
    container: HTMLDivElement;
    width: number;
    height: number;
    scale: number;
    socket: Socket;
    ctx: CanvasRenderingContext2D;
    preCtx: CanvasRenderingContext2D;
    points: Point[];
    state: SketchState;
    dragStart: Point;
    tranlated: Point;
    offset: Point;
    isMouseDown: boolean;
    dpr: number;
    undoStack: Execution[];
    redoStack: Execution[];
    bgColor: string;
    strawColor: string;

    constructor(socket: Socket) {
        this.canvas = document.getElementById('canvas')! as HTMLCanvasElement;
        this.preview = this.canvas.cloneNode() as HTMLCanvasElement;
        this.container = document.getElementById('canvas-container')! as HTMLDivElement;
        this.canvas.parentElement!.appendChild(this.preview);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.scale = 0.5;
        this.ctx = this.canvas.getContext('2d')!;
        this.preCtx = this.preview.getContext('2d')!;
        this.ctx.lineJoin = this.preCtx.lineJoin = 'round';
        this.ctx.lineCap = this.preCtx.lineCap = 'round';
        this.socket = socket;
        this.points = [];
        this.state = 'Draw';
        this.dragStart = { x: 0, y: 0 };
        this.tranlated = { x: -this.width / 2, y: -this.height / 2 };;
        this.offset = { x: 0, y: 0 };
        this.isMouseDown = false;
        this.dpr = window.devicePixelRatio;
        this.ctx.scale(this.dpr, this.dpr);
        this.preCtx.scale(this.dpr, this.dpr);
        this.undoStack = [];
        this.redoStack = [];
        this.bgColor = 'rgba(0,0,0,1.0)';
        this.strawColor = 'rgba(255,255,255,1.0)';

        this.preview.addEventListener('mousedown', (e) => {
            this.mouseDown(e)
        })
        this.preview.addEventListener('mousemove', (e) => {
            this.mouseMove(e)
        })
        this.preview.addEventListener('mouseup', (e) => {
            this.mouseUp(e)
        })
    }

    mouseDown(e: MouseEvent) {
        if (this.state === "Drag") {
            this.dragStart = { x: e.x, y: e.y };
        }
        if (this.state === "Draw" || this.state === "Eraser") {
            const { x, y } = this.getPoint(e);
            this.points.push({ x, y });
        }
        this.isMouseDown = true;
    }

    mouseMove(e: MouseEvent) {
        if (!this.isMouseDown) return;
        const { x, y } = this.getPoint(e);
        if (this.state === "Drag") {
            this.offset = {
                x: e.x - this.dragStart.x + this.tranlated.x,
                y: e.y - this.dragStart.y + this.tranlated.y,
            }
            this.container.style.transform =
                `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale})`;
        }
        if (this.state === "Draw") {
            this.points.push({ x, y });
            this.preCtx.clearRect(0, 0, this.preview.width, this.preview.height);
            this.draw(this.points, this.preCtx);
        }
        if (this.state === "Eraser") {
            this.points.push({ x, y });
            this.draw(this.points);
        }
    }

    mouseUp(e: MouseEvent) {
        this.isMouseDown = false;
        if (this.state === "Drag") {
            this.tranlated = this.offset;
        }
        if (this.state === "Draw" || this.state === "Eraser") {
            this.end();
        }
    }

    cursorMove(e: MouseEvent) {
        const { x, y } = this.getPoint(e);
        const pixel = this.ctx.getImageData(x * this.dpr, y * this.dpr, 1, 1);
        const arr = pixel.data;
        const a = Math.round(arr[3] / 255 * 100) / 100;
        this.strawColor = `rgba(${arr[0]},${arr[1]},${arr[2]},${a})`;
        eventEmitter.emit('straw', this.strawColor);
    }

    cursorUp(e: MouseEvent) {
        if ((e.target as HTMLElement).id !== 'cursor' || this.strawColor === 'rgba(0,0,0,0)') return;
        eventEmitter.emit('colorChange', 'rgba', this.strawColor);
        this.setPen({ color: this.strawColor });
    }

    setPen(conf: PenConfig) {
        const {
            type,
            color = this.ctx.strokeStyle,
            lineWidth = this.ctx.lineWidth
        } = conf;
        type && (this.state = type);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.preCtx.strokeStyle = color;
        this.preCtx.lineWidth = lineWidth;
    }

    draw(points: Point[], ctx = this.ctx) {
        if (points.length < 2) return;
        const drawColor = this.ctx.strokeStyle;
        if (this.state === "Eraser") {
            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.strokeStyle = "rgba(0,0,0,1.0)";
        }
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.strokeStyle = drawColor;
    }

    end() {
        if (this.state === "Draw") {
            this.preCtx.clearRect(0, 0, this.preview.width, this.preview.height);
            this.draw(this.points);
        }
        this.socket.emit('execute', {
            type: this.state,
            points: this.points,
            color: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth
        });
        this.pushUndo({
            type: this.state as "Draw" | "Eraser",
            points: [...this.points],
            color: this.ctx.strokeStyle as string,
            lineWidth: this.ctx.lineWidth
        })
        this.points.length = 0;
    }

    pushUndo(exe: Execution) {
        const { type, points, color, lineWidth } = exe;
        this.undoStack.push({
            type,
            points,
            color,
            lineWidth
        });
        this.redoStack.length = 0;
    }

    getPoint(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.scale / this.dpr;
        const y = (e.clientY - rect.top) / this.scale / this.dpr;
        return {
            x,
            y
        }
    }

    setScale(scale: number) {
        this.scale = scale;
    }

    changeState(state: SketchState) {
        this.state = state;
        if (state === 'Straw') {
            document.body.style.cursor = 'none';
        } else {
            document.body.style.cursor = '';
        }
    }

    undo() {
        if (this.undoStack.length > 0 && this.redoStack.length < 5) {
            this.redoStack.push(this.undoStack.pop()!);
            this.clear();
            this.undoStack.forEach((exe) => {
                this.execute(exe);
            })
        }
    }

    redo() {
        if (this.undo.length > 0) {
            this.clear();
            this.undoStack.forEach((exe) => {
                this.execute(exe);
            })
        }
        if (this.redoStack.length > 0) {
            const exe = this.redoStack.pop()!;
            this.execute(exe);
            this.undoStack.push(exe);
        }
    }

    execute(exe: Execution) {
        if (exe.type === 'BgColor') {
            this.setBg(exe.color);
        } else if (exe.type === 'Clear') {
            this.clear();
        } else {
            const preState = this.state;
            const prePen = {
                color: this.ctx.strokeStyle as string,
                lineWidth: this.ctx.lineWidth
            }
            this.setPen({
                type: exe.type as "Draw" | "Eraser",
                color: exe.color,
                lineWidth: exe.lineWidth
            })
            this.draw(exe.points!);
            this.setPen(prePen);
            this.state = preState;
        }
    }

    setBg(color?: string) {
        if (!color && this.ctx.strokeStyle === this.bgColor) return false;
        this.bgColor = color || this.ctx.strokeStyle as string;
        this.canvas.style.backgroundColor = this.bgColor;
        return true;
    }

    clear() {
        this.canvas.style.backgroundColor = '#ffffff';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    save() {
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const copy = this.canvas.cloneNode() as HTMLCanvasElement;
        const copyCtx = copy.getContext('2d')!;

        copyCtx.fillStyle = this.bgColor;
        copyCtx.putImageData(imageData, 0, 0);
        copyCtx.globalCompositeOperation = 'destination-over';
        copyCtx.fillRect(0, 0, this.width, this.height);

        return copy.toDataURL();
    }

    destory() {
        this.preview.removeEventListener('mousedown', (e) => {
            this.mouseDown(e)
        })
        this.preview.removeEventListener('mousemove', (e) => {
            this.mouseMove(e)
        })
        this.preview.removeEventListener('mouseup', (e) => {
            this.mouseUp(e)
        })
    }
}

export default Sketch;
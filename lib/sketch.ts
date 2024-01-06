import { Execution } from "@/stores/useSocketStore";
import { Socket } from "socket.io-client";

interface Point {
    x: number,
    y: number
}

interface PenConfig {
    type?: "Stroke" | "Eraser";
    color?: string;
    lineWidth?: number;
}

export type SketchState = "Draw" | "Drag" | "Eraser";

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
    undoStack: any[];
    redoStack: any[];

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
        if (this.state === "Drag") {
            this.offset = {
                x: e.x - this.dragStart.x + this.tranlated.x,
                y: e.y - this.dragStart.y + this.tranlated.y,
            }
            this.container.style.transform =
                `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale})`;
        }
        if (this.state === "Draw") {
            const { x, y } = this.getPoint(e);
            this.points.push({ x, y });
            this.preCtx.clearRect(0, 0, this.preview.width, this.preview.height);
            this.draw(this.points, this.preCtx);
        }
        if (this.state === "Eraser") {
            const { x, y } = this.getPoint(e);
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

    setPen(conf: PenConfig) {
        const {
            type = this.state === "Eraser" ? "Eraser" : "Stroke",
            color = this.ctx.strokeStyle,
            lineWidth = this.ctx.lineWidth
        } = conf;
        this.state = type === "Eraser" ? "Eraser" : "Draw";
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
            type: this.state === "Draw" ? "Stroke" : "Eraser",
            points: this.points,
            color: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth
        });
        this.pushUndo({
            type: this.state === "Draw" ? "Stroke" : "Eraser",
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
    }

    undo() {
        if (this.undoStack.length > 0 && this.redoStack.length < 5) {
            this.redoStack.push(this.undoStack.pop());
            this.clear();
            this.undoStack.forEach((exe) => {
                this.setPen({
                    type: exe.type,
                    color: exe.color,
                    lineWidth: exe.lineWidth
                })
                this.draw(exe.points);
            })
        }
    }

    redo() {
        if (this.undo.length > 0) {
            this.clear();
            this.undoStack.forEach((exe) => {
                this.setPen({
                    type: exe.type,
                    color: exe.color,
                    lineWidth: exe.lineWidth
                })
                this.draw(exe.points);
            })
        }
        if (this.redoStack.length > 0) {
            const exe = this.redoStack.pop();
            this.setPen({
                type: exe.type,
                color: exe.color,
                lineWidth: exe.lineWidth
            })
            this.draw(exe.points);
            this.undoStack.push(exe);
        }
    }


    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
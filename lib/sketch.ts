import { Execution } from "@/stores/useSocketStore";
import { Socket } from "socket.io-client";
import eventEmitter from "./eventEmitter";
import { rgba2arr, hex2rgba } from '../utils/colorConvert';

interface Point {
    x: number,
    y: number
}

interface PenConfig {
    type?: "Draw" | "Eraser";
    color?: string;
    lineWidth?: number;
}

export type SketchState = "Draw" | "Drag" | "Eraser" | "Dropper" | "Bucket";

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
    dropperColor: string;

    constructor(socket: Socket) {
        this.canvas = document.getElementById('canvas')! as HTMLCanvasElement;
        this.preview = this.canvas.cloneNode() as HTMLCanvasElement;
        this.container = document.getElementById('canvas-container')! as HTMLDivElement;
        this.canvas.parentElement!.appendChild(this.preview);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.scale = 0.5;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true, })!;
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
        this.dropperColor = 'rgba(255,255,255,1.0)';

        this.preview.addEventListener('mousedown', (e) => {
            this.mouseDown(e)
        })
        this.preview.addEventListener('mousemove', (e) => {
            this.mouseMove(e)
        })
        this.preview.addEventListener('mouseup', (e) => {
            this.mouseUp(e)
        })

        this.preview.addEventListener("click", (e) => {
            this.click(e);
        });
    }

    click(e: MouseEvent) {
        if (this.state === "Bucket") {
            const { x, y } = this.getPoint(e);
            let arr = [];
            if ((this.ctx.strokeStyle as string).startsWith("#")) {
                arr = rgba2arr(hex2rgba(this.ctx.strokeStyle as string));
            } else {
                arr = rgba2arr(this.ctx.strokeStyle as string);
            }
            this.fill(x * this.dpr, y * this.dpr, arr);
            this.socket.emit('execute', {
                type: 'Bucket',
                point: { x: x * this.dpr, y: y * this.dpr },
                colorArr: arr,
            });
            this.pushUndo({
                type: 'Bucket',
                point: { x: x * this.dpr, y: y * this.dpr },
                colorArr: arr,
            })
        }
    }

    mouseDown(e: MouseEvent) {
        if (this.state === "Bucket") return;
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

    dropperMove(e: MouseEvent) {
        const { x, y } = this.getPoint(e);
        const pixel = this.ctx.getImageData(x * this.dpr, y * this.dpr, 1, 1);
        const arr = pixel.data;
        const a = Math.round(arr[3] / 255 * 100) / 100;
        this.dropperColor = `rgba(${arr[0]},${arr[1]},${arr[2]},${a})`;
        eventEmitter.emit('drop', this.dropperColor);
    }

    dropperrClick(e: MouseEvent) {
        if ((e.target as HTMLElement).id !== 'dropper' || this.dropperColor === 'rgba(0,0,0,0)') return;
        eventEmitter.emit('colorChange', 'rgba', this.dropperColor);
        this.setPen({ color: this.dropperColor });
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
        if (this.state === "Eraser") {
            this.ctx.save();
            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.strokeStyle = "rgba(0,0,0,1.0)";
        }
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        this.ctx.restore();
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
        const { type, points, color, lineWidth, point, colorArr } = exe;
        this.undoStack.push({
            type,
            points,
            color,
            lineWidth,
            point,
            colorArr
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
        if (state === 'Dropper') {
            document.body.style.cursor = 'none';
        } else {
            document.body.style.cursor = '';
        }
    }

    undo() {
        if (this.undoStack.length > 0 && this.redoStack.length < 10) {
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
        if (exe.type === 'Clear') {
            this.clear();
        } else if (exe.type === 'Bucket') {
            this.fill(exe.point!.x, exe.point!.y, exe.colorArr!);
        } else {
            const preState = this.state;
            this.ctx.save();
            this.preCtx.save();
            this.setPen({
                type: exe.type as "Draw" | "Eraser",
                color: exe.color,
                lineWidth: exe.lineWidth
            })
            this.draw(exe.points!);
            this.ctx.restore();
            this.preCtx.restore();
            this.state = preState;
        }
    }

    clear() {
        this.canvas.style.backgroundColor = '#ffffff';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    save() {
        return this.canvas.toDataURL();
    }

    fill(x: number, y: number, replacementColor: number[]) {
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const stack = [[x, y]];
        const targetColor = this.ctx.getImageData(x, y, 1, 1).data as unknown as number[];
        const getColorIndex = (x: number, y: number) => (y * width + x) * 4;

        const isColorMatch = (color1: number[], color2: number[]) => {
            for (let i = 0; i < 4; i++) {
                if (color1[i] !== color2[i]) {
                    return false;
                }
            }
            return true;
        };

        const setColor = (x: number, y: number, color: number[]) => {
            const index = getColorIndex(x, y);
            data[index] = color[0];
            data[index + 1] = color[1];
            data[index + 2] = color[2];
            data[index + 3] = color[3];
        };

        while (stack.length > 0) {
            const [currentX, currentY] = stack.pop()!;
            const currentIndex = getColorIndex(currentX, currentY);
            const currentColor = [
                data[currentIndex],
                data[currentIndex + 1],
                data[currentIndex + 2],
                data[currentIndex + 3],
            ];
            if (isColorMatch(currentColor, targetColor)) {
                setColor(currentX, currentY, replacementColor);
                if (currentX > 0) {
                    const leftColorIndex = getColorIndex(currentX - 1, currentY);
                    const leftColor = [
                        data[leftColorIndex],
                        data[leftColorIndex + 1],
                        data[leftColorIndex + 2],
                        data[leftColorIndex + 3],
                    ];
                    if (isColorMatch(leftColor, targetColor)) {
                        stack.push([currentX - 1, currentY]);
                    }
                }

                if (currentX < width - 1) {
                    const rightColorIndex = getColorIndex(currentX + 1, currentY);
                    const rightColor = [
                        data[rightColorIndex],
                        data[rightColorIndex + 1],
                        data[rightColorIndex + 2],
                        data[rightColorIndex + 3],
                    ];
                    if (isColorMatch(rightColor, targetColor)) {
                        stack.push([currentX + 1, currentY]);
                    }
                }

                if (currentY > 0) {
                    const topColorIndex = getColorIndex(currentX, currentY - 1);
                    const topColor = [
                        data[topColorIndex],
                        data[topColorIndex + 1],
                        data[topColorIndex + 2],
                        data[topColorIndex + 3],
                    ];
                    if (isColorMatch(topColor, targetColor)) {
                        stack.push([currentX, currentY - 1]);
                    }
                }

                if (currentY < height - 1) {
                    const bottomColorIndex = getColorIndex(currentX, currentY + 1);
                    const bottomColor = [
                        data[bottomColorIndex],
                        data[bottomColorIndex + 1],
                        data[bottomColorIndex + 2],
                        data[bottomColorIndex + 3],
                    ];
                    if (isColorMatch(bottomColor, targetColor)) {
                        stack.push([currentX, currentY + 1]);
                    }
                }
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
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
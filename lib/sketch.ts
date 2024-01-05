import { Socket } from "socket.io-client";

interface Point {
    x: number,
    y: number
}

interface PenConfig {
    color?: string;
    lineWidth?: number;
}

class Sketch {
    canvas: HTMLCanvasElement;
    preview: HTMLCanvasElement;
    container: HTMLDivElement;
    width: number;
    height: number;
    scale: number;
    socket: Socket;
    isDrawing: boolean;
    ctx: CanvasRenderingContext2D;
    preCtx: CanvasRenderingContext2D;
    points: Point[];
    state: string;
    dragStart: Point;
    tranlated: Point;
    offset: Point;
    isDraging: boolean;

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
        this.isDrawing = false;
        this.points = [];
        this.state = 'Draw';
        this.dragStart = { x: 0, y: 0 };
        this.tranlated = { x: -this.width / 2, y: -this.height / 2 };;
        this.offset = { x: 0, y: 0 };
        this.isDraging = false;

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
            this.isDraging = true;
        }
        if (this.state === "Draw") {
            const { x, y } = this.getPoint(e);
            this.points.push({ x, y });
            this.isDrawing = true;
        }
    }

    mouseMove(e: MouseEvent) {
        if (this.state === "Drag") {
            if (!this.isDraging) return;
            this.offset = {
                x: e.x - this.dragStart.x + this.tranlated.x,
                y: e.y - this.dragStart.y + this.tranlated.y,
            }
            this.container.style.transform =
                `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale})`;
        }
        if (this.state === "Draw") {
            if (!this.isDrawing) return;
            const { x, y } = this.getPoint(e);
            this.points.push({ x, y });
            this.preCtx.clearRect(0, 0, this.preview.width, this.preview.height);
            this.draw(this.points, this.preCtx);
        }
    }

    mouseUp(e: MouseEvent) {
        if (this.state === "Drag") {
            this.isDraging = false;
            this.tranlated = this.offset;
        }
        if (this.state === "Draw") {
            this.isDrawing = false;
            this.end();
        }
    }


    setPen(conf: PenConfig) {
        const {
            color = this.ctx.strokeStyle,
            lineWidth = this.ctx.lineWidth
        } = conf;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.preCtx.strokeStyle = color;
        this.preCtx.lineWidth = lineWidth;
    }

    draw(points: Point[], ctx = this.ctx) {
        if (points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }

    end() {
        this.preCtx.clearRect(0, 0, this.preview.width, this.preview.height);
        this.draw(this.points);
        this.socket.emit('draw', {
            type: 'Stroke',
            points: this.points,
            color: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth
        });
        this.points.length = 0;
    }

    getPoint(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.scale;
        const y = (e.clientY - rect.top) / this.scale;
        return {
            x,
            y
        }
    }

    setScale(scale: number) {
        this.scale = scale;
    }

    changeState(state: string) {
        this.state = state;
    }

    clear() {
        this.preview.removeEventListener('mousedown', (e) => {
            this.mouseDown(e)
        })
        this.preview.removeEventListener('mousemove', (e) => {
            this.mouseMove(e)
        })
        this.preview.removeEventListener('mouseup', (e) => {
            this.mouseUp(e)
        })
        // this.canvas.parentElement!.removeChild(this.preview);
    }
}

export default Sketch;
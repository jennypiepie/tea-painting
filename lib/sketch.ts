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
    width: number;
    height: number;
    socket: Socket;
    isDrawing: boolean;
    ctx: CanvasRenderingContext2D;
    preCtx: CanvasRenderingContext2D;
    points: Point[];

    constructor(socket: Socket) {
        this.canvas = document.getElementById('canvas')! as HTMLCanvasElement;
        this.preview = this.canvas.cloneNode() as HTMLCanvasElement;
        this.canvas.parentElement!.appendChild(this.preview);
        this.ctx = this.canvas.getContext('2d')!;
        this.preCtx = this.preview.getContext('2d')!;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx.lineJoin = 'round';
        this.socket = socket;
        this.isDrawing = false;
        this.points = [];
        this.ctx.lineWidth = 10;
        this.preCtx.lineWidth = 10;
        this.preCtx.strokeStyle = 'rgba(0,0,0,0.5)';
        this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';


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
        const { x, y } = this.getPoint(e);
        this.points.push({ x, y });
        this.isDrawing = true;
    }

    mouseMove(e: MouseEvent) {
        if (!this.isDrawing) return;
        const { x, y } = this.getPoint(e);
        this.points.push({ x, y });
        this.preCtx.clearRect(0, 0, this.preview.width, this.preview.height);
        this.draw(this.points, this.preCtx);
    }

    mouseUp(e: MouseEvent) {
        this.isDrawing = false;
        this.end();
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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return {
            x,
            y
        }
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
        this.canvas.parentElement!.removeChild(this.preview);
    }
}

export default Sketch;
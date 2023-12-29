import { Socket } from "socket.io-client";

class Sketch {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    socket: Socket;
    start: boolean;
    ctx: CanvasRenderingContext2D;
    path?: { x: number, y: number }[];

    constructor(socket: Socket) {
        this.canvas = document.getElementById('canvas')! as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.socket = socket;
        this.start = false;

        this.canvas.addEventListener('mousedown', (e) => {
            this.mouseDown(e)
        })
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseMove(e)
        })
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouseUp(e)
        })
    }
    mouseDown(e: MouseEvent) {
        this.start = true;
        const { x, y } = this.getPoint(e);
        this.begin(x, y);
    }

    mouseMove(e: MouseEvent) {
        if (!this.start) return;
        const { x, y } = this.getPoint(e);
        this.draw(x, y);
    }
    mouseUp(e: MouseEvent) {
        this.end();
        this.start = false;
    }

    public begin(x: number, y: number) {
        // this.ctx.strokeStyle = 'red';
        // this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.path = [];
        this.path[0] = { x, y };
    }

    public draw(x: number, y: number) {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.path?.push({ x, y });
    }

    public end() {
        this.ctx.closePath();
        this.socket.emit('draw', this.path);
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
}

export default Sketch;
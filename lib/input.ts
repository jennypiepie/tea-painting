import { Point } from "./sketch";

class Input {
    container: HTMLDivElement;
    width: number;
    height: number;
    dragStart: Point;
    tranlated: Point;
    offset: Point;
    isMouseDown: boolean;
    center: Point;
    rotateStart: number;
    rotated: number;
    rotate: number;
    scale: number;

    constructor({
        container, width, height
    }: {
        container: HTMLDivElement, width: number, height: number
    }) {
        this.container = container;
        this.width = width;
        this.height = height;
        this.dragStart = { x: 0, y: 0 };
        this.tranlated = { x: -this.width / 2, y: -this.height / 2 };
        this.offset = { x: -this.width / 2, y: -this.height / 2 };
        this.isMouseDown = false;
        this.center = { x: 0, y: 0 };
        this.rotateStart = 0;
        this.rotate = 0;
        this.rotated = 0;
        this.scale = 0.5;
    }

    wheel = (e: WheelEvent) => {
        const delta = e.deltaY;
        const maxScale = 5;
        const minScale = 0.1;
        if (delta > 0) {
            this.scale *= 1.05;
            if (this.scale > maxScale) {
                this.scale = maxScale;
            }
        } else {
            this.scale *= 0.97;
            if (this.scale < minScale) {
                this.scale = minScale;
            }
        }
        this.container.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale}) rotate(${this.rotate}rad)`;
    }

    dragMouseDown = (e: MouseEvent) => {
        this.dragStart = { x: e.x, y: e.y };
    }

    RotateMouseDown = (e: MouseEvent) => {
        this.center = this.getCenter();
        const dx = e.clientX - this.center.x;
        const dy = this.center.y - e.clientY;
        this.rotateStart = Math.atan2(dy, dx);
    }

    dragMouseMove = (e: MouseEvent) => {
        this.offset = {
            x: e.x - this.dragStart.x + this.tranlated.x,
            y: e.y - this.dragStart.y + this.tranlated.y,
        }
        this.container.style.transform =
            `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale}) rotate(${this.rotate}rad)`;
    }

    rotateMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - this.center.x;
        const dy = this.center.y - e.clientY;
        const end = Math.atan2(dy, dx);
        this.rotate = this.rotateStart - end + this.rotated;
        this.container.style.transform =
            `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale}) rotate(${this.rotate}rad)`;
    }

    dragMouseUp = () => {
        this.tranlated = this.offset;
    }

    rotateMouseUp = () => {
        this.rotated = this.rotate;
    }

    getCenter() {
        const rect = this.container.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        return {
            x,
            y
        }
    }
}

export default Input;
import { SVGProps } from "react";

const Pen = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            d="m22.017 3.874-.59 1.581a250.264 250.264 0 0 1-.732 1.697c-.678 1.455-1.612 3.156-2.727 4.33-1.066 1.12-2.674 2.153-3.962 2.886a4.996 4.996 0 0 1-1.36 4.557c-2.27 2.27-4.806 2.27-6.692 1.71-1.43-.426-2.606-1.198-3.73-2.148a.394.394 0 0 1 .027-.624l.5-.362c.672-.507 1.325-1.126 1.49-1.955.115-.925.18-1.43.197-1.513.138-.689.43-1.471 1.138-2.18a4.996 4.996 0 0 1 4.556-1.36c.733-1.287 1.766-2.895 2.886-3.96 1.174-1.116 2.875-2.05 4.33-2.728l1.697-.733 1.581-.589a1.094 1.094 0 0 1 1.391 1.39ZM11.98 11.293a5.041 5.041 0 0 1 1.227 1.228c.392-.227.795-.473 1.19-.732l-.03-.067a3.312 3.312 0 0 0-.66-.93 3.354 3.354 0 0 0-.817-.603l-.179-.086c-.259.395-.505.798-.732 1.19Zm7.442-6.215c-.383.159-.8.34-1.23.54-1.408.657-2.866 1.48-3.796 2.364a7.63 7.63 0 0 0-.47.493c.362.2.782.49 1.195.904.414.413.704.833.904 1.195.178-.156.344-.313.493-.47.884-.93 1.707-2.388 2.364-3.797.2-.43.381-.846.54-1.229Z"
        />
    </svg>
)

const Tube = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={800}
        height={800}
        viewBox="0 0 512 512"
        {...props}
    >
        <path d="M507.097 194.357 317.656 4.916a16.741 16.741 0 0 0-23.678 0l-47.36 47.359c-6.539 6.539-6.539 17.141 0 23.68l1.242 1.242L67.781 302.296a17.179 17.179 0 0 0-2.811 5.165l-22.43 67.291-32.722 32.724c-13.088 13.085-13.093 34.272-.001 47.361l47.36 47.361.001.001c13.054 13.054 34.301 13.056 47.36-.001l32.724-32.724 67.291-22.431a17.262 17.262 0 0 0 5.165-2.811l225.097-180.078 1.242 1.242c3.27 3.27 7.555 4.905 11.839 4.905s8.571-1.635 11.839-4.905l47.361-47.359a16.745 16.745 0 0 0 .001-23.68zM132.739 435.679l-56.405-56.405 11.839-35.52 80.085 80.085-35.519 11.84zm120.383-69.057-18.346-18.345c-6.529-6.529-6.529-17.152 0-23.68l71.04-71.04c6.528-6.527 17.151-6.529 23.681 0l28.869 28.869-105.244 84.196zm194.774-136.746-165.76-165.76 23.68-23.68 165.761 165.759-23.681 23.681z" />
    </svg>
)

const Eraser = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        className="bi bi-eraser-fill"
        viewBox="0 0 16 16"
        {...props}
    >
        <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
    </svg>
)

const Drag = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            d="M16.192 5.657a1 1 0 0 0 0-1.414l-2.828-2.829a2 2 0 0 0-2.829 0L7.708 4.243a1 1 0 1 0 1.414 1.414L11 3.778v7.272H3.728l1.879-1.878a1 1 0 0 0-1.415-1.415l-2.828 2.829a2 2 0 0 0 0 2.828l2.828 2.829a1 1 0 1 0 1.415-1.415L3.828 13.05H11v7.172l-1.879-1.879a1 1 0 1 0-1.414 1.414l2.829 2.829a2 2 0 0 0 2.828 0l2.828-2.829a1 1 0 0 0-1.414-1.414L13 20.121v-7.07h7.071l-1.778 1.777a1 1 0 0 0 1.414 1.415l2.828-2.829a2 2 0 0 0 0-2.828l-2.828-2.829a1 1 0 1 0-1.414 1.415l1.879 1.878H13V3.88l1.778 1.778a1 1 0 0 0 1.414 0Z"
        />
    </svg>
)

const Bucket = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        viewBox="0 0 48 48"
        {...props}
    >
        <g data-name="Layer 2">
            <path fill="none" d="M0 0h48v48H0z" data-name="invisible box" />
            <g data-name="Layer 6">
                <path d="M16.5 2.6a1.8 1.8 0 0 0-1.4-.6 2 2 0 0 0-1.4.6 1.9 1.9 0 0 0 0 2.8l5.7 5.6L6.2 24.1a3.9 3.9 0 0 0 0 5.6l13.2 13.1a3.8 3.8 0 0 0 2.8 1.2 3.9 3.9 0 0 0 2.8-1.2l16-15.9ZM9.1 26.9l13.1-13 13 13ZM41 32s-4 5.8-4 8a4 4 0 0 0 8 0c0-2.2-4-8-4-8Z" />
            </g>
        </g>
    </svg>
)

const Undo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            fillRule="evenodd"
            d="M10.707 4.293a1 1 0 0 1 0 1.414L8.414 8H13.5a5.5 5.5 0 1 1 0 11H11a1 1 0 1 1 0-2h2.5a3.5 3.5 0 1 0 0-7H8.414l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0Z"
            clipRule="evenodd"
        />
    </svg>
)

const Redo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            fillRule="evenodd"
            d="M13.293 4.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L15.586 10H10.5a3.5 3.5 0 1 0 0 7H13a1 1 0 1 1 0 2h-2.5a5.5 5.5 0 1 1 0-11h5.086l-2.293-2.293a1 1 0 0 1 0-1.414Z"
            clipRule="evenodd"
        />
    </svg>
)

const Clear = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            fillRule="evenodd"
            d="M18 4h1a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2-2h.996c.752-.637 1.843-1 3.004-1 1.16 0 2.252.363 3.004 1H16a2 2 0 0 1 2 2ZM6.268 6H5v15h14V6h-1.268A2 2 0 0 1 16 7H8a2 2 0 0 1-1.732-1ZM12 12.586l2.293-2.293 1.414 1.414L13.414 14l2.293 2.293-1.414 1.414L12 15.414l-2.293 2.293-1.414-1.414L10.586 14l-2.293-2.293 1.414-1.414L12 12.586Zm-1.843-8.93-.3.344H8v1h8V4h-1.858l-.299-.345C13.515 3.277 12.811 3 12 3c-.81 0-1.515.277-1.843.655Z"
        />
    </svg>
)

const Save = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            fillRule="evenodd"
            d="M18.172 1a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 23 5.828V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h14.172ZM4 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h1v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6h1a1 1 0 0 0 1-1V6.828a2 2 0 0 0-.586-1.414l-1.828-1.828A2 2 0 0 0 17.172 3H17v2a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V3H4Zm13 18v-6a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM9 3h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3Z"
            clipRule="evenodd"
        />
    </svg>
)

const SVG = {
    draw: Pen,
    eraser: Eraser,
    drag: Drag,
    straw: Tube,
    bg: Bucket,
    undo: Undo,
    redo: Redo,
    clear: Clear,
    save: Save,
}
export default SVG;
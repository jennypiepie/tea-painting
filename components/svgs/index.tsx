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

const Dropper = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={800}
        height={800}
        viewBox="0 0 377.161 377.161"
        {...props}
    >
        <path d="m309.592 178.351-15.088-15.088 68.012-68.012c19.527-19.526 19.527-51.184 0-70.711l-9.895-9.896c-19.527-19.526-51.185-19.526-70.711 0l-68.012 68.013-15.087-15.087c-16.271-16.271-42.654-16.271-58.926 0L129.28 78.176c-16.271 16.271-16.271 42.653 0 58.925l7.811 7.811L18.602 263.401C2.422 279.58.002 303.252 0 315.922c-.002 7.497 1.049 33.014 14.639 46.602 13.588 13.589 39.104 14.64 46.602 14.638 12.67-.002 36.342-2.421 52.52-18.601l118.49-118.488 7.811 7.811c16.271 16.271 42.652 16.271 58.924 0l10.607-10.607c16.27-16.272 16.27-42.654-.001-58.926zM82.24 327.041c-6.635 6.634-27.473 6.522-35.707 3.588-2.934-8.235-3.047-29.073 3.588-35.708l118.488-118.488 32.119 32.119L82.24 327.041z" />
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
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            d="M16.192 5.657a1 1 0 0 0 0-1.414l-2.828-2.829a2 2 0 0 0-2.829 0L7.708 4.243a1 1 0 1 0 1.414 1.414L11 3.778v7.272H3.728l1.879-1.878a1 1 0 0 0-1.415-1.415l-2.828 2.829a2 2 0 0 0 0 2.828l2.828 2.829a1 1 0 1 0 1.415-1.415L3.828 13.05H11v7.172l-1.879-1.879a1 1 0 1 0-1.414 1.414l2.829 2.829a2 2 0 0 0 2.828 0l2.828-2.829a1 1 0 0 0-1.414-1.414L13 20.121v-7.07h7.071l-1.778 1.777a1 1 0 0 0 1.414 1.415l2.828-2.829a2 2 0 0 0 0-2.828l-2.828-2.829a1 1 0 1 0-1.414 1.415l1.879 1.878H13V3.88l1.778 1.778a1 1 0 0 0 1.414 0Z"
        />
    </svg>
)

const Rotate = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            d="M16.75 22h-4.5C8.5 22 7 20.5 7 16.75v-4.5C7 8.5 8.5 7 12.25 7h4.5C20.5 7 22 8.5 22 12.25v4.5C22 20.5 20.5 22 16.75 22ZM2.75 10.5c.41 0 .75-.34.75-.75 0-2.96 2.06-5.44 4.83-6.09l-.27.45c-.21.36-.1.82.26 1.03.36.21.82.1 1.03-.26l1.05-1.75c.14-.23.14-.52.01-.75A.781.781 0 0 0 9.75 2C5.48 2 2 5.48 2 9.75c0 .41.34.75.75.75Z"
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

const Bg = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={800}
        height={800}
        viewBox="0 0 512 512"
        {...props}
    >
        <path d="M490.667 213.333H192c-11.797 0-21.333 9.557-21.333 21.333V448c0 11.776 9.536 21.333 21.333 21.333h298.667c11.797 0 21.333-9.557 21.333-21.333V234.667c0-11.776-9.536-21.334-21.333-21.334z" />
        <path d="M341.333 170.667V64c0-11.776-9.536-21.333-21.333-21.333H21.333C9.536 42.667 0 52.224 0 64v213.333c0 11.776 9.536 21.333 21.333 21.333H128v-64c0-35.285 28.715-64 64-64h149.333z" />
    </svg>
)

const Undo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
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

const Send = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.764 12H10.056M3 8h2.5M4 12h1.5m-1 4h1m4.462-3.51-.892 2.959c-.337 1.12-.506 1.68-.363 2.014a1 1 0 0 0 .687.578c.354.085.877-.177 1.924-.7l7.82-3.91c.921-.46 1.382-.69 1.53-1.002a1 1 0 0 0 0-.857c-.148-.312-.609-.542-1.53-1.003l-7.831-3.916c-1.044-.521-1.565-.782-1.92-.698a1 1 0 0 0-.686.577c-.144.334.023.893.357 2.01l.905 3.028a2.1 2.1 0 0 1 .086.344.994.994 0 0 1 0 .232c-.01.087-.036.173-.087.344Z"
        />
    </svg>
)

const SVG = {
    draw: Pen,
    eraser: Eraser,
    drag: Drag,
    rotate: Rotate,
    dropper: Dropper,
    bucket: Bucket,
    bg: Bg,
    undo: Undo,
    redo: Redo,
    clear: Clear,
    save: Save,
    send: Send,
}
export default SVG;
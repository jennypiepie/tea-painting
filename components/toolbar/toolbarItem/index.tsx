'use client';

interface IToolbarProps {
    onClick?: () => void;
}
export default function ToolbarItem({ onClick }: IToolbarProps) {

    return (
        <div
            className="w-10 h-10 bg-slate-600 flex 
            justify-center items-center text-white"
            onClick={onClick}
        >
            1
        </div>
    )
}
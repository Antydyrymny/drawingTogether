import { useEffect, useRef, useState } from 'react';
import type { Point, CtxOptions, Move } from '../utils/types';

type DrawProps = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    overlayRef: React.RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | undefined;
    octx: CanvasRenderingContext2D | undefined;
    options: CtxOptions;
    broadcastDrawing: (move: Move) => void;
    roomIsReady: boolean;
};

export default function useDraw({
    canvasRef,
    overlayRef,
    ctx,
    octx,
    options,
    broadcastDrawing,
    roomIsReady,
}: DrawProps) {
    const [drawingLine, setDrawingLine] = useState(false);
    const [drawingSquare, setDrawingSquare] = useState(false);
    const prevPoint = useRef<null | Point>(null);
    const curPath = useRef<[number, number][]>([]);

    const clear = () => {
        if (!canvasRef.current || !ctx) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const exportJpg = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const image = canvas.toDataURL('image/jpeg', 1.0);
        return image;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const overlay = overlayRef.current;

        if (!roomIsReady || !canvas || !overlay || !ctx || !octx) return;

        const setupCtxOptions = () => {
            ctx.strokeStyle = options.color;
            octx.strokeStyle = options.color;
            if (options.mode === 'erase') {
                ctx.lineWidth = 30;
                ctx.strokeStyle = '#f8f9fa';
                // ctx.globalCompositeOperation = 'destination-out';
            } else {
                ctx.lineWidth = 5;
                // ctx.globalCompositeOperation = 'source-over';
            }
        };

        const onMouseDown = (e: MouseEvent) => {
            setupCtxOptions();
            if (options.mode === 'rect') {
                setDrawingSquare(true);
                prevPoint.current = computePointInCanvas(e);
            } else setDrawingLine(true);
        };

        const computePointInCanvas = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            return { x, y };
        };

        const drawLine = (curPoint: Point) => {
            const startPoint = prevPoint.current ?? curPoint;
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(curPoint.x, curPoint.y);
            ctx.stroke();
        };

        const getSquare = (e: MouseEvent): [number, number, number, number] => {
            if (!prevPoint.current) return [0, 0, 0, 0];
            const curPoint = computePointInCanvas(e);
            return [
                prevPoint.current.x,
                prevPoint.current.y,
                curPoint.x - prevPoint.current.x,
                curPoint.y - prevPoint.current.y,
            ];
        };

        const onMove = (e: MouseEvent) => {
            if (!drawingLine && !drawingSquare) return;

            if (options.mode === 'rect') {
                octx.clearRect(0, 0, overlay.width, overlay.height);
                octx.strokeRect(...getSquare(e));
            } else {
                const curPoint = computePointInCanvas(e);
                curPath.current.push([curPoint.x, curPoint.y]);
                drawLine(curPoint);
                prevPoint.current = curPoint;
            }
        };

        const onMouseUp = (e: MouseEvent) => {
            setDrawingLine(false);
            setDrawingSquare(false);
            if (options.mode === 'rect') {
                octx.clearRect(0, 0, overlay.width, overlay.height);
                ctx.strokeRect(...getSquare(e));
                broadcastDrawing({ options, rect: [...getSquare(e)] });
            } else {
                broadcastDrawing({ options, path: curPath.current });
                curPath.current = [];
            }
            prevPoint.current = null;
        };

        overlay.addEventListener('mousedown', onMouseDown);
        overlay.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            overlay.removeEventListener('mousedown', onMouseDown);
            overlay.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [
        broadcastDrawing,
        canvasRef,
        overlayRef,
        ctx,
        octx,
        drawingLine,
        drawingSquare,
        options,
        roomIsReady,
    ]);

    return { clear, exportJpg };
}

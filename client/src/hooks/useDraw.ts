import { useEffect, useRef, useState } from 'react';
import type { Point, MyDraw, CtxOptions } from '../utils/types';

type useDrawProps = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | undefined;
    options: CtxOptions;
};

export default function useDraw({ canvasRef, ctx, options }: useDrawProps) {
    const [drawing, setDrawing] = useState(false);

    const prevPoint = useRef<null | Point>(null);

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
        if (!canvas || !ctx) return;

        const setupCtxOptions = () => {
            ctx.strokeStyle = options.color;
            if (options.mode === 'erase')
                ctx.globalCompositeOperation = 'destination-out';
            else ctx.globalCompositeOperation = 'source-over';
        };

        const myDraw = ({ prevPoint, curPoint, ctx, options }: MyDraw) => {
            if (options.mode === 'rect') return;
            setupCtxOptions();

            const startPoint = prevPoint ?? curPoint;
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(curPoint.x, curPoint.y);
            ctx.stroke();
        };

        const onMouseDown = () => setDrawing(true);

        const computePointInCanvas = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            return { x, y };
        };

        const onMove = (e: MouseEvent) => {
            if (!drawing) return;
            const curPoint = computePointInCanvas(e);
            myDraw({
                ctx,
                options,
                curPoint,
                prevPoint: prevPoint.current,
            });
            prevPoint.current = curPoint;
        };

        const onMouseUp = () => {
            setDrawing(false);
            prevPoint.current = null;
        };

        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [canvasRef, ctx, drawing, options]);

    return { canvasRef, clear, exportJpg };
}

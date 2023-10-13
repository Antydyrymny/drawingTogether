import { useEffect, useState } from 'react';
import useCanvasRef from './useCanvasRef';

export default function useCtx() {
    const [canvasRef, overlayRef] = useCanvasRef();

    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const [octx, setOCtx] = useState<CanvasRenderingContext2D>();

    useEffect(() => {
        const newCtx = canvasRef.current?.getContext('2d');
        const newOCtx = overlayRef.current?.getContext('2d');

        if (newCtx && newOCtx) {
            newCtx.fillStyle = '#f8f9fa';
            newCtx.fillRect(0, 0, newCtx.canvas.width, newCtx.canvas.height);
            newCtx.lineJoin = 'round';
            newCtx.lineCap = 'round';
            newOCtx.lineJoin = 'round';
            newOCtx.lineCap = 'round';
            newOCtx.lineWidth = 5;
            newOCtx.globalCompositeOperation = 'source-over';
            setCtx(newCtx);
            setOCtx(newOCtx);
        }
    }, [canvasRef, overlayRef]);

    return { canvasRef, overlayRef, ctx, octx };
}

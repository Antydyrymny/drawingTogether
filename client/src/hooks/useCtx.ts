import { useEffect, useState } from 'react';
import useCanvasRef from './useCanvasRef';

export default function useCtx() {
    const canvasRef = useCanvasRef();

    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    useEffect(() => {
        const newCtx = canvasRef.current?.getContext('2d');

        if (newCtx) {
            newCtx.fillStyle = 'white';
            newCtx.fillRect(0, 0, newCtx.canvas.width, newCtx.canvas.height);
            newCtx.lineJoin = 'round';
            newCtx.lineCap = 'round';
            setCtx(newCtx);
        }
    }, [canvasRef]);

    return { canvasRef, ctx };
}

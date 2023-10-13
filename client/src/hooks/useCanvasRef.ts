import { useRef } from 'react';

export default function useCanvasRef() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    return [canvasRef, overlayRef];
}

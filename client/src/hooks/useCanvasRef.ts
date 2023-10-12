import { useRef } from 'react';

export default function useCanvasRef() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    return canvasRef;
}

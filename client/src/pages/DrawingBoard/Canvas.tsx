import { memo } from 'react';
import { Button } from 'react-bootstrap';
import useCtx from '../../hooks/useCtx';
import useDraw from '../../hooks/useDraw';
import { useDrawMutation } from '../../app/services/api';
import useSubscribeToCanvasEvents from '../../hooks/useSubscribeToCanvasEvents';
import type { CtxOptions } from '../../utils/types';

type CanvasProps = {
    roomIsReady: boolean;
    options: CtxOptions;
};

const Canvas = memo(function Canvas({ options, roomIsReady }: CanvasProps) {
    const { canvasRef, ctx } = useCtx();
    const [broadcastDrawing] = useDrawMutation();
    const { exportJpg } = useDraw({
        canvasRef,
        ctx,
        options,
        broadcastDrawing,
        roomIsReady,
    });
    useSubscribeToCanvasEvents({ ctx, roomIsReady });

    return (
        <>
            <a
                href={!ctx ? '#' : exportJpg()}
                download='canvas.jpg'
                style={{ position: 'absolute', top: '2rem', left: '2rem' }}
            >
                <Button>Download</Button>
            </a>
            <canvas
                ref={canvasRef}
                height={600}
                width={600}
                className='bg-light border border-black rounded-md'
            >
                Drawing together - canvas
            </canvas>
        </>
    );
});

export default Canvas;

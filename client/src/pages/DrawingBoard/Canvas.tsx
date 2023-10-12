import { memo } from 'react';
import useCtx from '../../hooks/useCtx';
import useDraw from '../../hooks/useDraw';
import type { CtxOptions } from '../../utils/types';

const Canvas = memo(function Canvas({ options }: { options: CtxOptions }) {
    const { canvasRef, ctx } = useCtx();
    const { clear, drawJpg } = useDraw({ canvasRef, ctx, options });

    return (
        <canvas
            ref={canvasRef}
            height={600}
            width={600}
            className='bg-light border border-black rounded-md'
        >
            Drawing together - canvas
        </canvas>
    );
});

export default Canvas;

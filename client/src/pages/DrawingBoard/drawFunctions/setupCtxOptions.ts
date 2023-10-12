import { CtxOptions } from '../../../utils/types';

export default function setupCtxOptions(
    ctx: CanvasRenderingContext2D,
    options: CtxOptions
) {
    if (ctx) {
        ctx.strokeStyle = options.color;
        if (options.mode === 'erase') ctx.globalCompositeOperation = 'destination-out';
        else ctx.globalCompositeOperation = 'source-over';
    }
}

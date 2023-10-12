import { useEffect } from 'react';
import getSocket from '../app/services/getSocket';
import {
    ClientToServer,
    ServerToClient,
    Move,
    CtxOptions,
    PathMove,
} from '../utils/types';

type SubscribeToCanvasEvents = {
    ctx: CanvasRenderingContext2D | undefined;
    roomIsReady: boolean;
};

const socket = getSocket();

export default function useSubscribeToCanvasEvents({
    ctx,
    roomIsReady,
}: SubscribeToCanvasEvents) {
    useEffect(() => {
        if (!roomIsReady || !ctx) return;

        const setupCtxOptions = (options: CtxOptions) => {
            ctx.strokeStyle = options.color;
            if (options.mode === 'erase') {
                ctx.lineWidth = 30;
                ctx.globalCompositeOperation = 'destination-out';
            } else {
                ctx.lineWidth = 5;
                ctx.globalCompositeOperation = 'source-over';
            }
        };

        const draw = (move: Move) => {
            ctx.save();
            setupCtxOptions(move.options);
            if (move.options.mode === 'rect') {
                // const rectMove = move as unknown as RectMove;
            } else {
                const pathMove = move as unknown as PathMove;

                pathMove.path.forEach((coord, ind) => {
                    if (ind === 0) {
                        ctx.beginPath();
                        ctx.moveTo(coord[0], coord[1]);
                    } else {
                        ctx.lineTo(coord[0], coord[1]);
                    }
                });
                ctx.stroke();
            }
            ctx.restore();
        };

        socket.emit(ClientToServer.RequestingRoomData, (moves: Move[]) => {
            moves.forEach((move) => draw(move));
        });

        socket.on(ServerToClient.UserDrew, (move: Move) => {
            draw(move);
        });

        return () => {
            socket.off(ServerToClient.UserDrew);
        };
    }, [ctx, roomIsReady]);
}

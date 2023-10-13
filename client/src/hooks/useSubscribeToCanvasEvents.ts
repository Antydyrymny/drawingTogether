import { useEffect } from 'react';
import getSocket from '../app/services/getSocket';
import {
    ClientToServer,
    ServerToClient,
    Move,
    CtxOptions,
    PathMove,
    RectMove,
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
                ctx.strokeStyle = '#f8f9fa';
                // ctx.globalCompositeOperation = 'destination-out';
            } else {
                ctx.lineWidth = 5;
                // ctx.globalCompositeOperation = 'source-over';
            }
        };

        const draw = (move: Move) => {
            setupCtxOptions(move.options);
            if (move.options.mode === 'rect') {
                const rectMove = move as unknown as RectMove;
                ctx.strokeRect(...rectMove.rect);
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
        };

        socket.emit(ClientToServer.RequestingRoomData, (moves: Move[]) => {
            moves.forEach((move) => draw(move));
        });

        socket.on(ServerToClient.UserDrew, (move: Move) => {
            draw(move);
        });

        socket.on(ServerToClient.PollingRoomImg, () => {
            const newImg = ctx.canvas.toDataURL('image/jpeg', 0.1);
            socket.emit(ClientToServer.SendingUpdatedRoom, newImg);
        });

        return () => {
            socket.off(ServerToClient.UserDrew);
            socket.off(ServerToClient.PollingRoomImg);
        };
    }, [ctx, roomIsReady]);
}

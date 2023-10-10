import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getSocket from './getSocket';
import {
    // ServerToClient,
    ClientToServer,
    // Shape,
    // CtxMode,
    RoomPreview,
    // ClientRoom,
    // CtxOptions,
    // Move,
} from '../../utils/types';

export type RoomData = {
    message: string;
};

const baseUrl =
    import.meta.env.VITE_ENV === 'DEV'
        ? import.meta.env.VITE_DEV_URL
        : import.meta.env.VITE_SERVER_URL;

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
    }),
    endpoints: (builder) => ({
        getAllRooms: builder.query<RoomPreview[], void>({
            queryFn: () => {
                const socket = getSocket();
                return new Promise((resolve) => {
                    socket.emit(
                        ClientToServer.RequestingAllRooms,
                        (rooms: RoomPreview[]) => {
                            resolve({ data: rooms });
                        }
                    );
                });
            },
        }),
        createRoom: builder.mutation<string, void>({
            queryFn: () => {
                const socket = getSocket();
                return new Promise((resolve) => {
                    socket.emit(ClientToServer.CreatingRoom, (roomId: string) => {
                        resolve({ data: roomId });
                    });
                });
            },
        }),
    }),
});

export default apiSlice;

export const { useGetAllRoomsQuery } = apiSlice;

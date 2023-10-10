import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import getSocket from './getSocket';

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
        getRoomData: builder.query<{ results: RoomData }, string>({
            query: (roomId) => ({
                url: '/getRoom',
                params: { roomId },
            }),
        }),
    }),
});

export default apiSlice;

export const { useGetRoomDataQuery } = apiSlice;

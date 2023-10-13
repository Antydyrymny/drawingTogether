import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getSocket from './getSocket';
import {
    ClientToServer,
    ServerToClient,
    RoomPreview,
    Move,
    MouseMove,
    JoinRoomRequest,
    User,
    ClientUser,
    UpdatedRoomPreview,
} from '../../utils/types';
import { toast } from 'react-toastify';

export type RoomData = {
    message: string;
};

const baseUrl =
    import.meta.env.VITE_ENV === 'DEV'
        ? import.meta.env.VITE_DEV_URL
        : import.meta.env.VITE_SERVER_URL;

const socket = getSocket();

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
    }),
    tagTypes: ['AllRooms', 'userId'],
    endpoints: (builder) => ({
        getAllRooms: builder.query<RoomPreview[], void>({
            queryFn: () => {
                return new Promise((resolve) => {
                    socket.emit(
                        ClientToServer.RequestingAllRooms,
                        (rooms: RoomPreview[]) => {
                            resolve({ data: rooms });
                        }
                    );
                });
            },
            async onCacheEntryAdded(
                _,
                { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
            ) {
                try {
                    await cacheDataLoaded;
                    socket.on(ServerToClient.RoomCreated, (room: RoomPreview) => {
                        updateCachedData((draft) => {
                            toast.info(`New room created: ${room.roomName}`, {
                                autoClose: 2000,
                                hideProgressBar: true,
                            });
                            return [
                                ...draft,
                                { ...room, userNumber: room.userNumber - 1 },
                            ];
                        });
                    });
                    socket.on(
                        ServerToClient.RoomPreviewUpdated,
                        (roomUpdate: UpdatedRoomPreview) => {
                            updateCachedData((draft) => {
                                return draft.map((room) =>
                                    room.id === roomUpdate.id
                                        ? { ...room, image: roomUpdate.image }
                                        : room
                                );
                            });
                        }
                    );
                    socket.on(ServerToClient.RoomDeleted, (roomId: string) => {
                        updateCachedData((draft) => {
                            return draft.filter((room) => room.id !== roomId);
                        });
                    });
                    socket.on(
                        ServerToClient.UserJoinedRoom,
                        (_user: User, roomId: string) => {
                            updateCachedData((draft) => {
                                return draft.map((room) =>
                                    room.id === roomId
                                        ? { ...room, userNumber: room.userNumber + 1 }
                                        : room
                                );
                            });
                        }
                    );
                    socket.on(ServerToClient.UserLeft, (_user: User, roomId: string) => {
                        updateCachedData((draft) => {
                            return draft.map((room) =>
                                room.id === roomId
                                    ? { ...room, userNumber: room.userNumber - 1 }
                                    : room
                            );
                        });
                    });
                    await cacheEntryRemoved;

                    socket.off(ServerToClient.RoomCreated);
                    socket.off(ServerToClient.RoomDeleted);
                    socket.off(ServerToClient.RoomPreviewUpdated);
                    socket.off(ServerToClient.UserJoinedRoom);
                    socket.off(ServerToClient.UserLeft);
                } catch {
                    // if cacheEntryRemoved resolved before cacheDataLoaded,
                    // cacheDataLoaded throws
                }
            },
            providesTags: ['AllRooms'],
        }),
        createRoom: builder.mutation<string, string | undefined>({
            queryFn: (userName?) => {
                return new Promise((resolve) => {
                    socket.emit(
                        ClientToServer.CreatingRoom,
                        userName,
                        (roomId: string) => {
                            resolve({ data: roomId });
                        }
                    );
                });
            },
            invalidatesTags: ['AllRooms'],
        }),
        joiningRoom: builder.mutation<string, JoinRoomRequest>({
            queryFn: (joinRoomRequest) => {
                return new Promise((resolve) => {
                    socket.emit(
                        ClientToServer.JoiningRoom,
                        joinRoomRequest,
                        (userId: string) => {
                            resolve({ data: userId });
                        }
                    );
                });
            },
            invalidatesTags: ['AllRooms'],
        }),
        subscribeToRoomUsers: builder.query<ClientUser[], void>({
            queryFn: () => {
                return new Promise((resolve) => {
                    socket.emit(ClientToServer.RequestingUsers, (users: User[]) => {
                        resolve({
                            data: users.map((user) => expandUser(user)),
                        });
                    });
                });
            },
            async onCacheEntryAdded(
                _,
                { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
            ) {
                try {
                    await cacheDataLoaded;
                    socket.on(ServerToClient.UserJoinedRoom, (user: User) => {
                        updateCachedData((draft) => {
                            toast.success(`${user.name} joined!`, {
                                autoClose: 2000,
                                hideProgressBar: true,
                            });
                            return [...draft, expandUser(user)];
                        });
                    });
                    socket.on(ServerToClient.UserLeft, (user: User) => {
                        updateCachedData((draft) => {
                            toast.error(`${user.name} left!`, {
                                autoClose: 2000,
                                hideProgressBar: true,
                            });
                            return draft.filter((u) => u.id !== user.id);
                        });
                    });
                    socket.on(ServerToClient.UserMovedMouse, (coordinates: MouseMove) => {
                        updateCachedData((draft) => {
                            return draft.map((user) =>
                                user.id === coordinates.userId
                                    ? { ...user, x: coordinates.x, y: coordinates.y }
                                    : user
                            );
                        });
                    });
                    await cacheEntryRemoved;

                    socket.off(ServerToClient.UserJoinedRoom);
                    socket.off(ServerToClient.UserLeft);
                    socket.off(ServerToClient.UserMovedMouse);
                } catch {
                    // if cacheEntryRemoved resolved before cacheDataLoaded,
                    // cacheDataLoaded throws
                }
            },
        }),
        moveMouse: builder.mutation<void, MouseMove>({
            queryFn: (mouseMove) => {
                socket.emit(ClientToServer.MovingMouse, mouseMove);
                return { data: undefined };
            },
        }),
        draw: builder.mutation<void, Move>({
            queryFn: (move) => {
                socket.emit(ClientToServer.Drawing, move);
                return { data: undefined };
            },
        }),
        leaveRoom: builder.mutation<string, void>({
            queryFn: () => {
                return new Promise((resolve) => {
                    socket.emit(ClientToServer.LeavingRoom, (acknowledgement: string) => {
                        resolve({ data: acknowledgement });
                    });
                });
            },
            invalidatesTags: ['AllRooms'],
        }),
    }),
});

const expandUser = (user: User): ClientUser => ({ ...user, x: 0, y: 0 });

export default apiSlice;

export const {
    useGetAllRoomsQuery,
    useCreateRoomMutation,
    useJoiningRoomMutation,
    useSubscribeToRoomUsersQuery,
    useMoveMouseMutation,
    useDrawMutation,
    useLeaveRoomMutation,
} = apiSlice;

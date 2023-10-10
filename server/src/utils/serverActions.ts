import { v4 as uuidv4 } from 'uuid';
import { rooms } from '../data/data';
import type { RoomPreview, ClientRoom, Move } from './types';

export const getAllRooms = (): RoomPreview[] =>
    Array.from(rooms.entries()).map(([id, room]) => ({
        id,
        userNumber: room.users.size,
    }));

export const joinNewRoom = () => {};

export const createNewRoom = (roomId?: string) => {
    roomId = roomId || uuidv4();
    if (rooms.has(roomId)) return roomId;
    rooms.set(roomId, { users: new Map(), allMoves: [] });
    return roomId;
};

export const populateRoom = (roomId: string, userId: string, userName?: string) => {
    userName = setUserName(userName);
    if (!rooms.has(roomId)) {
        createNewRoom(roomId);
    }
    rooms.get(roomId).users.set(userId, userName);
    return userName;
};

export const getRoomData = (roomId: string): ClientRoom => {
    const room = rooms.get(roomId);
    return { ...room, users: Array.from(room.users.values()) };
};

export const addMove = (roomId: string, move: Move) => {
    const room = rooms.get(roomId);
    room.allMoves.push(move);
};

export const leaveFromRoom = (userId: string, roomId: string) => {
    const userName = rooms.get(roomId).users.get(userId);
    rooms.get(roomId).users.delete(userId);
    return userName;
};

const setUserName = (userName?: string) => userName || 'user#' + uuidv4();

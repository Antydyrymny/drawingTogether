import { v4 as uuidv4 } from 'uuid';
import { rooms } from '../data/data';
import type { RoomPreview, User, Move } from './types';

export const getAllRooms = (): RoomPreview[] =>
    Array.from(rooms.entries()).map(([id, room]) => ({
        id,
        roomName: room.roomName,
        userNumber: room.users.size,
    }));

export const getRoomPreview = (roomId: string): RoomPreview => {
    const room = rooms.get(roomId);
    return { id: roomId, roomName: room.roomName, userNumber: room.users.size };
};
export const createNewRoom = ({
    userName,
    roomId,
}: {
    userName?: string;
    roomId?: string;
}): [string, string] => {
    roomId = roomId || uuidv4();
    userName = setUserName(userName);
    if (rooms.has(roomId)) return [userName, roomId];
    rooms.set(roomId, { roomName: userName + `'s room`, users: new Map(), allMoves: [] });
    return [userName, roomId];
};

export const populateRoom = ({
    roomId,
    userId,
    userName,
}: {
    roomId: string;
    userId: string;
    userName?: string;
}) => {
    userName = setUserName(userName);
    if (!rooms.has(roomId)) {
        createNewRoom({ userName, roomId });
    }
    rooms.get(roomId).users.set(userId, userName);
    return userName;
};

export const getRoomData = (roomId: string, userId: string) => {
    const room = rooms.get(roomId);
    return {
        roomData: room.allMoves,
        roomUsers: Array.from(room.users.entries()).reduce(
            (acc: User[], [id, userName]) =>
                id !== userId ? acc.concat({ id, name: userName }) : acc,
            []
        ),
    };
};

export const addMove = (roomId: string, move: Move) => {
    const room = rooms.get(roomId);
    room.allMoves.push(move);
};

export const clearUserFromRoom = (userId: string, roomId: string) => {
    const room = rooms.get(roomId);
    const userName = room.users.get(userId);
    rooms.get(roomId).users.delete(userId);
    return userName;
};

export const deleteEmptyRoom = (roomId: string) => {
    const room = rooms.get(roomId);
    if (!room?.users?.size) {
        rooms.delete(roomId);
        return true;
    }
    return false;
};

const setUserName = (userName?: string) => userName || 'User#' + uuidv4().slice(0, 4);

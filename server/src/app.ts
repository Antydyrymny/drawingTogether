import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware';
import {
    getAllRooms,
    createNewRoom,
    populateRoom,
    getRoomData,
    addMove,
    leaveFromRoom,
} from './utils/serverActions';
import {
    ClientToServer,
    ServerToClient,
    ClientToServerEvents,
    ServerToClientEvents,
    Move,
} from './utils/types';

dotenv.config();

const app = express();
const server = createServer(app);
app.use(cors());
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
        origin: '*',
    },
});

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use(notFound);
app.use(errorHandler);

io.on(ClientToServer.Connection, (socket) => {
    const getUsersRoom = () =>
        Array.from(socket.rooms).find((room) => room !== socket.id);

    socket.on(ClientToServer.RequestingAllRooms, (acknowledgeAllRooms) => {
        createNewRoom();
        acknowledgeAllRooms(getAllRooms());
    });

    socket.on(ClientToServer.CreatingRoom, (acknowledgeCreating) => {
        const newRoomId = createNewRoom();
        acknowledgeCreating(newRoomId);
    });

    socket.on(ClientToServer.JoiningRoom, (roomId: string, userName?: string) => {
        const newUser = populateRoom(roomId, socket.id, userName);
        socket.join(roomId);
        socket.to(roomId).emit(ServerToClient.UserJoinedRoom, newUser);
        io.to(socket.id).emit(ServerToClient.RoomJoined, `Room:${roomId} joined`);
    });

    socket.on(ClientToServer.RequestingRoomData, () => {
        const roomId = getUsersRoom();
        io.to(socket.id).emit(ServerToClient.SendingRoomData, getRoomData(roomId));
    });

    socket.on(ClientToServer.Drawing, (move: Move) => {
        const roomId = getUsersRoom();
        addMove(roomId, move);
        socket.to(roomId).emit(ServerToClient.UserDrew, move);
    });

    socket.on(ClientToServer.LeavingRoom, () => {
        const roomId = getUsersRoom();
        const userName = leaveFromRoom(roomId, socket.id);
        socket.to(roomId).emit(ServerToClient.UserLeft, userName);
        socket.leave(roomId);
    });

    socket.on(ClientToServer.Disconnecting, () => {
        const roomId = getUsersRoom();
        if (!roomId) return;
        const userName = leaveFromRoom(roomId, socket.id);
        socket.leave(roomId);
        io.to(roomId).emit(ServerToClient.UserLeft, userName);
    });
});

export default server;

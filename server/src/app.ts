import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware';
import { roomsWaitingForUpdate } from './data/data';
import getRandomUser from './utils/getRandomUser';
import {
    getAllRooms,
    getRoomPreview,
    createNewRoom,
    populateRoom,
    getRoomData,
    addMove,
    clearUserFromRoom,
    deleteEmptyRoom,
    updateRoomImg,
} from './utils/serverActions';
import {
    ClientToServer,
    ServerToClient,
    ClientToServerEvents,
    ServerToClientEvents,
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
        Array.from(socket.rooms).find((room) => room !== socket.id && room !== 'lobby');

    socket.on(ClientToServer.RequestingAllRooms, (acknowledgeAllRooms) => {
        socket.join('lobby');
        acknowledgeAllRooms(getAllRooms());
    });

    socket.on(ClientToServer.CreatingRoom, (userName, acknowledgeCreating) => {
        const [verifiedUserName, newRoomId] = createNewRoom({ userName });
        populateRoom({
            roomId: newRoomId,
            userId: socket.id,
            userName: verifiedUserName,
        });
        socket.leave('lobby');
        socket.join(newRoomId);
        acknowledgeCreating(newRoomId);
        io.in('lobby').emit(ServerToClient.RoomCreated, getRoomPreview(newRoomId));
    });

    socket.on(ClientToServer.JoiningRoom, ({ roomId, userName }, acknowledgeJoining) => {
        const newUser = populateRoom({ roomId, userId: socket.id, userName });
        socket.leave('lobby');
        socket.join(roomId);
        socket
            .to(roomId)
            .to('lobby')
            .emit(
                ServerToClient.UserJoinedRoom,
                { id: socket.id, name: newUser },
                roomId
            );
        acknowledgeJoining(socket.id);
    });

    socket.on(ClientToServer.RequestingRoomData, (acknowledgeRoomData) => {
        const roomId = getUsersRoom();
        acknowledgeRoomData(getRoomData(roomId, socket.id).roomData);
    });

    socket.on(ClientToServer.RequestingUsers, (acknowledgeUsers) => {
        const roomId = getUsersRoom();
        acknowledgeUsers(getRoomData(roomId, socket.id).roomUsers);
    });

    socket.on(ClientToServer.MovingMouse, (mouseMove) => {
        const roomId = getUsersRoom();
        socket.to(roomId).emit(ServerToClient.UserMovedMouse, mouseMove);
    });

    socket.on(ClientToServer.Drawing, (move) => {
        const roomId = getUsersRoom();
        addMove(roomId, move);
        socket.to(roomId).emit(ServerToClient.UserDrew, move);
    });

    socket.on(ClientToServer.LeavingRoom, (acknowledgeLeaving) => {
        const roomId = onLeave();
        acknowledgeLeaving(`Room:${roomId} left`);
    });

    socket.on(ClientToServer.Disconnecting, () => {
        onLeave();
        socket.leave('lobby');
    });

    socket.on(ClientToServer.SendingUpdatedRoom, (newImg) => {
        const roomId = getUsersRoom();
        const newPreview = updateRoomImg(roomId, newImg);
        io.in('lobby').emit(ServerToClient.RoomPreviewUpdated, newPreview);
    });

    const onLeave = () => {
        const roomId = getUsersRoom();
        if (!roomId) return;
        const userName = clearUserFromRoom(socket.id, roomId);
        socket.leave(roomId);
        io.in(roomId).emit(
            ServerToClient.UserLeft,
            { id: socket.id, name: userName },
            roomId
        );
        io.in('lobby').emit(
            ServerToClient.UserLeft,
            { id: socket.id, name: userName },
            roomId
        );
        setTimeout(() => {
            if (deleteEmptyRoom(roomId))
                io.in('lobby').emit(ServerToClient.RoomDeleted, roomId);
        }, 1000);
        return roomId;
    };
});

setInterval(() => {
    roomsWaitingForUpdate.forEach((roomId) => {
        io.to(getRandomUser(roomId)).emit(ServerToClient.PollingRoomImg);
    });
    roomsWaitingForUpdate.clear();
}, 10000);

export default server;

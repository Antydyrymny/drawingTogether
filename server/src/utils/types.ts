import type { RgbaColor } from 'react-colorful';

export enum ClientToServer {
    Connection = 'connection',
    RequestingAllRooms = 'requestingAllRooms',
    CreatingRoom = 'creatingRoom',
    JoiningRoom = 'joiningRoom',
    RequestingRoomData = 'requestingRoomData',
    Drawing = 'drawing',
    LeavingRoom = 'leavingRoom',
    Disconnecting = 'disconnecting',
}

export enum ServerToClient {
    UserJoinedRoom = 'userJoinedRoom',
    RoomJoined = 'roomJoined',
    SendingRoomData = 'sendingRoomData',
    UserDrew = 'userDrew',
    UserLeft = 'userLeft',
}

export type ClientToServerEvents = {
    [ClientToServer.RequestingAllRooms]: (
        acknowledgeAllRooms: (rooms: RoomPreview[]) => void
    ) => void;
    [ClientToServer.CreatingRoom]: (
        acknowledgeCreating: (roomId: string) => void
    ) => void;
    [ClientToServer.JoiningRoom]: (roomId: string, userName?: string) => void;
    [ClientToServer.RequestingRoomData]: (roomId: string) => void;
    [ClientToServer.Drawing]: (move: Move) => void;
    [ClientToServer.LeavingRoom]: () => void;
};

export type ServerToClientEvents = {
    [ServerToClient.RoomJoined]: (message: string) => void;
    [ServerToClient.UserJoinedRoom]: (userName: string) => void;
    [ServerToClient.SendingRoomData]: (roomData: ClientRoom) => void;
    [ServerToClient.UserDrew]: (move: Move) => void;
    [ServerToClient.UserLeft]: (userName: string) => void;
};

export type Shape = 'line' | 'rect';
export type CtxMode = 'draw' | 'erase';

export type RoomPreview = {
    id: string;
    userNumber: number;
};

export type Room = {
    allMoves: Move[];
    users: Map<string, string>;
};

export type ClientRoom = {
    allMoves: Move[];
    users: string[];
};

export type CtxOptions = {
    lineWidth: number;
    lineColor: RgbaColor;
    fillColor: RgbaColor;
    shape: Shape;
    mode: CtxMode;
};

export type Move = {
    path: [number, number][];
};

// export type Move {
//     rect: {
//         width: number;
//         height: number;
//     };
//     path: [number, number][];
//     options: CtxOptions;
// }

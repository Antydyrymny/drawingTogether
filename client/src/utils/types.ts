export enum ClientToServer {
    Connection = 'connection',
    RequestingAllRooms = 'requestingAllRooms',
    CreatingRoom = 'creatingRoom',
    JoiningRoom = 'joiningRoom',
    RequestingRoomData = 'requestingRoomData',
    RequestingUsers = 'requestingUsers',
    Drawing = 'drawing',
    MovingMouse = 'movingMouse',
    LeavingRoom = 'leavingRoom',
    Disconnecting = 'disconnecting',
}

export enum ServerToClient {
    RoomCreated = 'roomCreated',
    RoomDeleted = 'roomDeleted',
    UserJoinedRoom = 'userJoinedRoom',
    UserMovedMouse = 'userMovedMouse',
    UserDrew = 'userDrew',
    UserLeft = 'userLeft',
}

export type CtxMode = 'line' | 'rect' | 'erase';

export type User = {
    id: string;
    name: string;
};

export type ClientUser = {
    id: string;
    name: string;
    x: number;
    y: number;
};

export type RoomPreview = {
    id: string;
    roomName: string;
    userNumber: number;
};

export type JoinRoomRequest = {
    roomId: string;
    userName?: string;
};

export type Room = {
    roomName: string;
    allMoves: Move[];
    users: Map<string, string>;
};

export type CtxOptions = {
    lineWidth: number;
    color: string;
    mode: CtxMode;
};

export type MouseMove = {
    userId: string;
    x: number;
    y: number;
};

export type Move = {
    rect?: {
        width: number;
        height: number;
    };
    path?: [number, number][];
    options: CtxOptions;
};

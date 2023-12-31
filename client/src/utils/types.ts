export enum ClientToServer {
    Connection = 'connection',
    RequestingAllRooms = 'requestingAllRooms',
    CreatingRoom = 'creatingRoom',
    JoiningRoom = 'joiningRoom',
    RequestingRoomData = 'requestingRoomData',
    RequestingUsers = 'requestingUsers',
    SendingUpdatedRoom = 'SendingUpdatedRoom',
    Drawing = 'drawing',
    MovingMouse = 'movingMouse',
    LeavingRoom = 'leavingRoom',
    Disconnecting = 'disconnecting',
}

export enum ServerToClient {
    RoomCreated = 'roomCreated',
    PollingRoomImg = 'pollingRoomImg',
    RoomPreviewUpdated = 'roomPreviewUpdated',
    UserJoinedRoom = 'userJoinedRoom',
    UserMovedMouse = 'userMovedMouse',
    UserDrew = 'userDrew',
    UserLeft = 'userLeft',
    RoomDeleted = 'roomDeleted',
}

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
    image: string;
};

export type UpdatedRoomPreview = {
    id: string;
    image: string;
};

export type JoinRoomRequest = {
    roomId: string;
    userName?: string;
};

export type CtxMode = 'line' | 'rect' | 'erase';
export type CtxPathMode = 'line' | 'erase';

export type CtxOptions = {
    color: string;
    mode: CtxMode;
};

export type MouseMove = {
    userId: string;
    x: number;
    y: number;
};

export type PathMove = {
    path: [number, number][];
    options: CtxPathMode;
};

export type RectMove = {
    rect: [number, number, number, number];
    options: 'rect';
};

export type Move = {
    rect?: [number, number, number, number];
    path?: [number, number][];
    options: CtxOptions;
};

export type Point = { x: number; y: number };

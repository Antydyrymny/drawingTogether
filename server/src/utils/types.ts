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

export type ClientToServerEvents = {
    [ClientToServer.RequestingAllRooms]: (
        acknowledgeAllRooms: (rooms: RoomPreview[]) => void
    ) => void;
    [ClientToServer.CreatingRoom]: (
        userName: string | undefined,
        acknowledgeCreating: (roomId: string) => void
    ) => void;
    [ClientToServer.JoiningRoom]: (
        joinRoomRequest: JoinRoomRequest,
        acknowledgeJoining: (response: string) => void
    ) => void;
    [ClientToServer.RequestingRoomData]: (
        acknowledgeRoomData: (roomData: Move[]) => void
    ) => void;
    [ClientToServer.RequestingUsers]: (acknowledgeUsers: (users: User[]) => void) => void;
    [ClientToServer.MovingMouse]: (mouseMove: MouseMove) => void;
    [ClientToServer.Drawing]: (move: Move) => void;
    [ClientToServer.LeavingRoom]: (
        acknowledgeLeaving: (response: string) => void
    ) => void;
};

export type ServerToClientEvents = {
    [ServerToClient.RoomCreated]: (roomPreview: RoomPreview) => void;
    [ServerToClient.UserJoinedRoom]: (user: User) => void;
    [ServerToClient.UserMovedMouse]: (mouseMove: MouseMove) => void;
    [ServerToClient.UserDrew]: (move: Move) => void;
    [ServerToClient.UserLeft]: (user: User) => void;
    [ServerToClient.RoomDeleted]: (roomId: string) => void;
};

export type CtxMode = 'line' | 'rect' | 'erase';

export type User = {
    id: string;
    name: string;
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

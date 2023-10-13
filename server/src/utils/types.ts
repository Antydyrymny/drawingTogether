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
        acknowledgeJoining: (userId: string) => void
    ) => void;
    [ClientToServer.RequestingRoomData]: (
        acknowledgeRoomData: (roomData: Move[]) => void
    ) => void;
    [ClientToServer.SendingUpdatedRoom]: (newRoomImg: string) => void;
    [ClientToServer.RequestingUsers]: (acknowledgeUsers: (users: User[]) => void) => void;
    [ClientToServer.MovingMouse]: (mouseMove: MouseMove) => void;
    [ClientToServer.Drawing]: (move: Move) => void;
    [ClientToServer.LeavingRoom]: (
        acknowledgeLeaving: (response: string) => void
    ) => void;
};

export type ServerToClientEvents = {
    [ServerToClient.RoomCreated]: (roomPreview: RoomPreview) => void;
    [ServerToClient.PollingRoomImg]: () => void;
    [ServerToClient.RoomPreviewUpdated]: (roomPreview: UpdatedRoomPreview) => void;
    [ServerToClient.UserJoinedRoom]: (user: User, roomId: string) => void;
    [ServerToClient.UserMovedMouse]: (mouseMove: MouseMove) => void;
    [ServerToClient.UserDrew]: (move: Move) => void;
    [ServerToClient.UserLeft]: (user: User, roomId: string) => void;
    [ServerToClient.RoomDeleted]: (roomId: string) => void;
};

export type User = {
    id: string;
    name: string;
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

export type Room = {
    roomName: string;
    allMoves: Move[];
    users: Map<string, string>;
    image: string;
};

export type CtxMode = 'line' | 'rect' | 'erase';

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
    rect?: [number, number, number, number];
    path?: [number, number][];
    options: CtxOptions;
};

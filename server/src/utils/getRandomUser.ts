import { rooms } from '../data/data';

export default function getRandomUser(roomId: string): string {
    const room = rooms.get(roomId);
    if (!room) return '';
    const randomInRange = (max: number, min = 0) =>
        Math.floor(Math.random() * (max - min)) + min;
    return Array.from(room.users.entries())[randomInRange(room.users.size)]?.[0] || '';
}

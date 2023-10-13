import type { Room } from 'src/utils/types';

export const rooms = new Map<string, Room>();
export const roomsWaitingForUpdate = new Set<string>();

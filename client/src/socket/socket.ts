import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL =
    import.meta.env.VITE_ENV === 'DEV'
        ? import.meta.env.VITE_DEV_URL
        : import.meta.env.VITE_SERVER_URL;

export const socket = io(URL, {
    autoConnect: false,
});

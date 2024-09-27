import { Store } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null; // Single socket instance

export const initializeeSocket = (store: Store, userId: string) => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
            query: { userId },
            transports: ['websocket']
        });

        socket.on('disconnect', () => {
            socket = null; // Reset on disconnect
        });

    }
};

export const getSocket = (): Socket | null => {
    return socket; // Return the socket instance
};

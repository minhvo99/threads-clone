/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const socket = io('https://api.holetex.com', {
    autoConnect: false,
    path: '/v1/we-connect/socket.io',
});

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
    const token = useSelector((state) => state.auth.accessToken); // Ensure auth state is accessed to trigger re-render on auth change
    useEffect(() => {
        socket.connect();
        socket.auth = { token };
        socket.on('connect', () => {
            console.log('Socket connected');
        });
        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.disconnect();
        };
    }, []);
    return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export default SocketProvider;

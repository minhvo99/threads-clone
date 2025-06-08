/* eslint-disable react-refresh/only-export-components */
import { Events } from '@libs/constants';
import { openSnakeBar } from '@redux/slices/snakeBarSlices';
import { rootApi } from '@services/rootApi';
import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const socket = io('https://api.holetex.com', {
    autoConnect: false,
    path: '/v1/we-connect/socket.io',
    transports: ['websocket'],
});

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
    const token = useSelector((state) => state.auth.accessToken); // Ensure auth state is accessed to trigger re-render on auth change
    const dispatch = useDispatch();
    useEffect(() => {
        if (!token) return;
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
    }, [token]);

    useEffect(() => {
        if (!socket) return;
        socket.on(Events.CREATE_NOTIFICATION_REQUEST, (data) => {
            // Optimistic update - thêm notification mới vào đầu list
            dispatch(
                rootApi.util.updateQueryData(
                    'getNotifications',
                    'allNotifications',
                    (draft) => {
                        const exists = draft.entities[data._id];
                        if (!exists) {
                            // Thêm notification mới
                            draft.entities[data._id] = data;
                            draft.ids.unshift(data._id);
                            draft.total = (draft.total || 0) + 1;
                        }
                    },
                ),
            );

            const message = data?.like
                ? `${data.author?.fullName} liked your thread`
                : `${data.author?.fullName} left a comment on your thread: ${(data.comment?.comment || '').slice(0, 20)}...`;
            dispatch(
                openSnakeBar({
                    type: 'info',
                    message: message,
                }),
            );
        });
        return () => {
            socket.off(Events.CREATE_NOTIFICATION_REQUEST);
        };
    }, [dispatch]);
    return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export default SocketProvider;

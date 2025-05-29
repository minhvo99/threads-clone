import { useDispatch } from 'react-redux';
import { logOut } from '@redux/slices/authSlices';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';

import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetPostsQuery } from '@services/postAPI';
import { throttle } from 'lodash';
import { useCreateNotificationMutation } from '@services/notificationAPI';
import { socket } from '@context/SocketProvider';
import { Events } from '@libs/constants';
export const useLogOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogOut = () => {
        dispatch(logOut());
        navigate('/login', { replace: true });
    };
    return { handleLogOut };
};

export const useDetectLayout = () => {
    const theme = useTheme();
    const isMediumLayout = useMediaQuery(theme.breakpoints.down('md'));

    return { isMediumLayout };
};

export const useUserInfor = () => {
    return useSelector((state) => state.auth.userInfor);
};

export const useLazyLoadPosts = () => {
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [hasMore, setHasMore] = useState(true);

    const {
        data = { ids: [], entities: [] },
        isFetching,
        refetch,
    } = useGetPostsQuery({ offset, limit });

    const posts = data.ids.map((id) => data.entities[id]);

    const prevPostCountRef = useRef(0);

    useEffect(() => {
        if (!isFetching && data && hasMore) {
            const currentPostCount = data.ids.length;
            const newFetchedCount = currentPostCount - prevPostCountRef.current;
            if (newFetchedCount === 0) {
                setHasMore(false);
            } else {
                prevPostCountRef.current = currentPostCount;
            }
        }
    }, [data, isFetching, hasMore]);

    const loadMore = useCallback(async () => {
        setOffset((offset) => offset + limit);
    }, []);

    useEffect(() => {
        refetch();
    }, [offset, refetch]);

    useInfiniteScroll({
        hasMore,
        loadMore,
        isFetching,
    });

    return { isFetching, posts };
};

export const useInfiniteScroll = ({
    hasMore,
    loadMore,
    isFetching,
    threshold = 50,
    throttleMs = 500,
}) => {
    const handleScroll = useMemo(() => {
        return throttle(() => {
            const scrollTop = document.documentElement.scrollTop; // b
            const scrollHeight = document.documentElement.scrollHeight; // a
            const clientHeight = document.documentElement.clientHeight; // c

            if (!hasMore) {
                return;
            }

            if (clientHeight + scrollTop + threshold >= scrollHeight && !isFetching) {
                loadMore();
            }
        }, throttleMs);
    }, [hasMore, isFetching, loadMore, threshold, throttleMs]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            handleScroll.cancel();
        };
    }, [handleScroll]);
};

export const useNotification = () => {
    const [createNotificationMution] = useCreateNotificationMutation();
    const { _id: currentUserId } = useUserInfor();

    const createNotification = async (
        receiverUserId,
        postId,
        notificationType,
        notificationTypeId,
    ) => {
        if (currentUserId === receiverUserId) {
            return;
        }
        const notification = await createNotificationMution({
            userId: receiverUserId,
            postId,
            notificationType,
            notificationTypeId,
        }).unwrap();
        socket.emit(Events.CREATE_NOTIFICATION, notification);
    };

    return { createNotification };
};

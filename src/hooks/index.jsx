import { useDispatch } from 'react-redux';
import { logOut } from '@redux/slices/authSlices';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';

import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetPostsQuery } from '@services/rootApi';
import { throttle } from 'lodash';
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
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const { data, isSuccess, isFetching } = useGetPostsQuery({ offset, limit });

    const previousDataRef = useRef();
    useEffect(() => {
        if (isSuccess && data && previousDataRef.current !== data) {
            if (!data.length) {
                setHasMore(false);
                return;
            }
            previousDataRef.current = data;
            setPosts((prevPosts) => {
                if (offset === 0) return data;
                return [...prevPosts, ...data];
            });
        }
    }, [data, isSuccess, offset]);

    const loadMore = useCallback(() => {
        setOffset((offset) => offset + limit);
    }, []);

    useInfiniteScroll({
        hasMore,
        loadMore,
        isFetching,
        offset,
        resetFn: () => {
            setOffset(0);
            setHasMore(true);
            previousDataRef.current = null;
        },
    });

    return { isFetching, posts };
};

export const useInfiniteScroll = ({
    hasMore,
    loadMore,
    isFetching,
    offset,
    resetFn,
    threshold = 50,
    throttleMs = 500,
}) => {
    const handleScroll = useMemo(() => {
        return throttle(() => {
            const scrollTop = document.documentElement.scrollTop; // b
            const scrollHeight = document.documentElement.scrollHeight; // a
            const clientHeight = document.documentElement.clientHeight; // c

            if (scrollTop < 100 && offset > 0) {
                resetFn();
                return;
            }

            if (!hasMore) {
                return;
            }

            if (clientHeight + scrollTop + threshold >= scrollHeight && !isFetching) {
                loadMore();
            }
        }, throttleMs);
    }, [hasMore, isFetching, loadMore, threshold, throttleMs, offset, resetFn]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            handleScroll.cancel();
        };
    }, [handleScroll]);
};

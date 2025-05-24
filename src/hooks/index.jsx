import { useDispatch } from 'react-redux';
import { logOut } from '@redux/slices/authSlices';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';

import { useSelector } from 'react-redux';
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

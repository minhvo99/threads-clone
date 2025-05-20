import React from 'react';
import { useDispatch } from 'react-redux';
import { logOut } from '@redux/slices/authSlices';
import { useNavigate } from 'react-router-dom';

const useLogOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogOut = () => {
        dispatch(logOut());
        navigate('/login', { replace: true });
    };
    return { handleLogOut };
};

export default useLogOut;

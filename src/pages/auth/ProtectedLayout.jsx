import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetAuthUserQuery } from '@services/rootApi';
import Loading from '@components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserInfor } from '@redux/slices/authSlices';
import Header from '@components/Header';

const ProtectedLayout = () => {
    const dispatch = useDispatch();
    const { accessToken } = useSelector((state) => state.auth);
    const respon = useGetAuthUserQuery(undefined, { skip: !accessToken });

    useEffect(() => {
        if (respon.isSuccess) {
            dispatch(saveUserInfor(respon.data));
        }
    }, [respon.isSuccess, respon.data, dispatch]);
    if (respon.isLoading) {
        return <Loading />;
    }
    if (!accessToken || respon.isError) {
        return <Navigate to='/login' replace />;
    }

    return (
        <>
            <Header />
            <div className='container'>
                <Outlet />
            </div>
        </>
    );
};

export default ProtectedLayout;

import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetAuthUserQuery } from '@services/rootApi';
import Loading from '@components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserInfor } from '@redux/slices/authSlices';
import Header from '@components/Header';
import SocketProvider from '@context/SocketProvider';

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

    return (
        <SocketProvider>
            <div>
                <Header />
                <div className='bg-dark-200'>
                    <Outlet />
                </div>
            </div>
        </SocketProvider>
    );
};

export default ProtectedLayout;

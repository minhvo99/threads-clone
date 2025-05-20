import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetAuthUserQuery } from '@services/rootApi';
import Loading from '@components/Loading';
import { useDispatch } from 'react-redux';
import { saveUserInfor } from '@redux/slices/authSlices';
import Header from '@components/Header';

const ProtectedLayout = () => {
    const respon = useGetAuthUserQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        if (respon.isSuccess) {
            dispatch(saveUserInfor(respon.data));
        }
    }, [respon.isSuccess, respon.data, dispatch]);
    if (respon.isLoading) {
        return <Loading />;
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

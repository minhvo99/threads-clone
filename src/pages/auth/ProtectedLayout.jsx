import React from 'react';
import { Outlet } from 'react-router-dom';
import Loading from '@components/Loading';
import Header from '@components/Header';
import { useProtectedLayout } from '@hooks/index';
import SocketProvider from '@context/SocketProvider';

const ProtectedLayout = () => {
    const { idLoading } = useProtectedLayout();
    if (idLoading) {
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

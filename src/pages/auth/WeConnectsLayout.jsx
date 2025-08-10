import { useProtectedLayout } from '@hooks/index';
import { Outlet } from 'react-router-dom';
import Loading from '@components/Loading';
import Header from '@components/Header';
import AppHeader from '@components/AppHeader';

const WeConnectsLayout = () => {
    const { idLoading } = useProtectedLayout();
    if (idLoading) {
        return <Loading />;
    }

    return (
        <div>
            <AppHeader />
            <div className='bg-dark-200'>
                <Outlet />
            </div>
        </div>
    );
};

export default WeConnectsLayout;

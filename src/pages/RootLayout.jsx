import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Loading from '@components/Loading';

import '@fontsource-variable/public-sans';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { closeSnakeBar } from '../redux/slices/snakeBarSlices';
const RootLayout = () => {
    const dispatch = useDispatch();
    const { open, message, type } = useSelector((state) => state.snakebar);
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                autoHideDuration={3000}
                onClose={() => dispatch(closeSnakeBar())}
            >
                <Alert severity={type} variant='filled' sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default RootLayout;

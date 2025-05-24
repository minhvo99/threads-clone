import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '@pages/RootLayout.jsx';
// import ModelProvider from '@context/ModelProvider';
import { ThemeProvider } from '@mui/material';
import theme from './configs/MUI.config';
import RegisterPage from './pages/auth/RegisterPage';
import AuthLayout from './pages/auth/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import OTPVeriyPage from './pages/auth/OTPVeriyPage';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import ProtectedLayout from './pages/auth/ProtectedLayout';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from '@components/Loading';
import { persistor } from '@redux/store';
import Dialog from '@components/Dialog';
const Home = lazy(() => import('@pages/Home'));

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                element: <ProtectedLayout />,
                children: [
                    {
                        path: '/',
                        element: <Home />,
                    },
                ],
            },
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: '/register',
                        element: <RegisterPage />,
                    },
                    {
                        path: '/login',
                        element: <LoginPage />,
                    },
                    {
                        path: '/verify-otp',
                        element: <OTPVeriyPage />,
                    },
                ],
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={<Loading />} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    {/* <ModelProvider> */}
                    <RouterProvider router={router}></RouterProvider>
                    <Dialog />
                    {/* </ModelProvider> */}
                </ThemeProvider>
            </PersistGate>
        </Provider>
    </StrictMode>,
);

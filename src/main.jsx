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
const SearchPage = lazy(() => import('@pages/SearchPage'));
const FriendPage = lazy(() => import('@pages/FriendPage'));
const GroupPage = lazy(() => import('@pages/GroupPage'));
const AccountSettingPage = lazy(() => import('@pages/AccountSettingPage'));
const LangugeSettingPage = lazy(() => import('@pages/LangugeSettingPage'));
const MessengerPage = lazy(() => import('@pages/MessengerPage'));
const UserProfilePage = lazy(() => import('@pages/UserProfilePage'));
const PostDetail = lazy(() => import('@components/PostDetail'));
const Notification = lazy(() => import('@pages/Notification'));

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
                    {
                        path: '/search/users',
                        element: <SearchPage />,
                    },
                    {
                        path: '/messengers',
                        element: <MessengerPage />,
                    },
                    {
                        path: '/friends',
                        element: <FriendPage />,
                    },
                    {
                        path: '/groups',
                        element: <GroupPage />,
                    },
                    {
                        path: '/setting/account',
                        element: <AccountSettingPage />,
                    },
                    {
                        path: '/setting/languages',
                        element: <LangugeSettingPage />,
                    },
                    {
                        path: '/my-profile',
                        element: <UserProfilePage />,
                    },
                    {
                        path: 'post/:id',
                        element: <PostDetail />,
                    },
                    {
                        path: '/notifications',
                        element: <Notification />,
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

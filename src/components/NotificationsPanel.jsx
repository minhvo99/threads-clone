import { Notifications } from '@mui/icons-material';
import {
    Badge,
    IconButton,
    Menu,
    Tab,
    Tabs,
    Typography,
    Box,
} from '@mui/material';
import {
    useGetNotificationsQuery,
    useSeenNotificationMutation,
    selectNotifications,
    selectNotificationsTotal,
} from '@services/notificationAPI';
import { GenerateNotificationMessage } from '@components/GenerateNotificationMesage';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const NotificationsPanel = () => {
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [anchorEl, setAnchorEl] = useState(null);
    const [value, setValue] = useState(0);

    // Sử dụng selectors để lấy data từ cache
    const notifications = useSelector(selectNotifications);
    const total = useSelector(selectNotificationsTotal);
    const { isFetching } = useGetNotificationsQuery({ limit, offset });
    const [seenNotification] = useSeenNotificationMutation();

    const notificationCount = notifications.filter((noti) => !noti.seen);
    const unreadNotifications = notifications.filter((noti) => !noti.seen);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role='tabpanel'
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
            </div>
        );
    }

    const handleSeenNotification = async (notificationId) => {
        try {
            await seenNotification(notificationId).unwrap();
        } catch (error) {
            console.error('Failed to mark notification as seen:', error);
        }
    };

    const renderNotifications = (
        <Menu
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            classes={{ paper: '!min-w-80 !max-h-80 !overflow-y-auto' }}
            sx={{
                '& .MuiMenu-paper': {
                    padding: 0,
                },
                '& .MuiMenu-list': {
                    padding: 0,
                },
            }}
        >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleTabChange} variant='fullWidth'>
                    <Tab label='All' />
                    <Tab label='Unread' />
                </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
                <div className='max-h-60 overflow-y-auto'>
                    {notifications.map((notification) => (
                        <GenerateNotificationMessage
                            key={notification._id}
                            notification={notification}
                            onSeenNotification={() => {
                                if (!notification.seen) {
                                    handleSeenNotification(notification._id);
                                }
                            }}
                        />
                    ))}
                    {notifications.length < total && (
                        <p
                            className='mb-2 cursor-pointer text-center text-sm text-gray-500 hover:bg-gray-100 py-2'
                            onClick={() => {
                                setOffset((prevOffset) => prevOffset + limit);
                            }}
                        >
                            See more...
                        </p>
                    )}
                    {notifications.length === 0 && (
                        <p className='text-center text-gray-500 py-4'>No notifications</p>
                    )}
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
                <div className='max-h-60 overflow-y-auto'>
                    {unreadNotifications.map((notification) => (
                        <GenerateNotificationMessage
                            key={notification._id}
                            notification={notification}
                            onSeenNotification={() => {
                                handleSeenNotification(notification._id);
                            }}
                        />
                    ))}
                    {unreadNotifications.length === 0 && (
                        <p className='text-center text-gray-500 py-4'>No unread notifications</p>
                    )}
                </div>
            </CustomTabPanel>
        </Menu>
    );

    const handleNotificationClick = (event) => {
        setAnchorEl(event.target);
    };

    return (
        <>
            <IconButton size='medium' onClick={handleNotificationClick}>
                <Badge badgeContent={notificationCount.length || undefined} color='error'>
                    <Notifications />
                </Badge>
            </IconButton>
            {renderNotifications}
        </>
    );
};

export default NotificationsPanel;

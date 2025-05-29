import { Notifications } from '@mui/icons-material';
import { Badge, IconButton, Menu, MenuItem, Tab, Tabs } from '@mui/material';
import {
    useGetNotificationsQuery,
    useSeenNotificationMutation,
} from '@services/notificationAPI';
import { generateNotificationMessage } from '@components/generateNotificationMesage';
import React, { useState } from 'react';

const NotificationsPanel = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { data = {} } = useGetNotificationsQuery();
    const notificationCount = (data?.notifications || []).filter(
        (noti) => noti?.seen === false,
    );
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const [seenNotification] = useSeenNotificationMutation();
    // const a11yProps = (index) => {
    //     return {
    //         id: `simple-tab-${index}`,
    //         'aria-controls': `simple-tabpanel-${index}`,
    //     };
    // };
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
            {(data?.notifications || []).map((notification) => (
                <MenuItem
                    key={notification._id}
                    className={`flex !justify-between ${notification.seen ? '' : '!bg-dark-300'} transition-colors duration-200 hover:!bg-gray-100`}
                    onClick={() => seenNotification(notification._id)}
                >
                    {generateNotificationMessage(notification)}
                </MenuItem>
            ))}
            {/* <MenuItem>
                <Tabs >
                    <Tab label='All' {...a11yProps(0)} />
                    <Tab label='Unread' {...a11yProps(1)} />
                </Tabs>
            </MenuItem> */}
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

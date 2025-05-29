import { Circle, Notifications } from '@mui/icons-material';
import { Avatar, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { useGetNotificationsQuery } from '@services/notificationAPI';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
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
        >
            {(data?.notifications || []).map((notification) => (
                <MenuItem key={notification._id} className='flex !justify-between'>
                    {notification?.like && (
                        <div className='flex items-center gap-2'>
                            <Avatar
                                {...stringAvatar(notification?.author?.fullName)}
                                src={getAvatar(notification?.author)?.avatar}
                            />
                            <p>
                                <span className='font-bold'>
                                    {notification.author?.fullName || 'Unknow user'}
                                </span>{' '}
                                liked your thread
                            </p>
                        </div>
                    )}
                    {notification?.comment && (
                        <div className='flex items-center gap-2'>
                            <Avatar
                                {...stringAvatar(notification?.author?.fullName)}
                                src={getAvatar(notification?.author)?.avatar}
                            />
                            <p className='line-clamp-2 max-w-56 break-words whitespace-normal'>
                                <span className='font-bold'>
                                    {notification.author?.fullName || 'Unknow user'}
                                </span>{' '}
                                left a comment on your thread:{' '}
                                <span>{notification?.comment?.comment}</span>
                            </p>
                        </div>
                    )}
                    {!notification?.seen && (
                        <Circle fontSize='10px' className='text-dark-100' />
                    )}
                    {/* {notification.createdAt} */}
                </MenuItem>
            ))}
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

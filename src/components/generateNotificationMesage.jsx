import { Link } from 'react-router-dom';
import { getAvatar, stringAvatar } from '../utils/stringAvatar';
import { Avatar, MenuItem } from '@mui/material';

export const GenerateNotificationMessage = ({
    notification,
    onSeenNotification,
    setAnchorEl,
}) => {
    return (
        <MenuItem
            className={`flex !justify-between ${notification.seen ? '' : '!bg-dark-300'} transition-colors duration-200 hover:!bg-gray-100`}
        >
            <Link to={`/post/${notification.post}`} onClick={() => setAnchorEl(null)}>
                <div className='flex items-center justify-between gap-2'>
                    {notification?.like && (
                        <div
                            className='flex items-center gap-2'
                            onClick={() => onSeenNotification(notification._id)}
                        >
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
                        <div
                            className='flex items-center gap-2'
                            onClick={() => onSeenNotification(notification._id)}
                        >
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
                </div>
            </Link>
        </MenuItem>
    );
};

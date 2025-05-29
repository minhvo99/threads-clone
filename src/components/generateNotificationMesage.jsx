import { getAvatar, stringAvatar } from '../utils/stringAvatar';
import { Avatar } from '@mui/material';

export const generateNotificationMessage = (notification) => {
    return (
        <div className='flex items-center justify-between gap-2'>
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
        </div>
    );
};

import { Notifications } from '@mui/icons-material';
import { Badge, IconButton, Menu } from '@mui/material';
import {
    useSeenNotificationMutation,
    useGetNotificationsQuery,
} from '@services/notificationAPI';
import { GenerateNotificationMessage } from '@components/GenerateNotificationMesage';
import { useState, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from './Loading';

const NotificationsPanel = () => {
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [anchorEl, setAnchorEl] = useState(null);

    const { data: notificationsList } = useGetNotificationsQuery({ limit, offset });
    const [seenNotification] = useSeenNotificationMutation();

    const notificationCount = notificationsList?.notifications?.filter(
        (noti) => !noti.seen,
    );

    const [allNotifications, setAllNotifications] = useState([]);

    useMemo(() => {
        if (notificationsList?.notifications) {
            if (offset === 0) {
                setAllNotifications(notificationsList.notifications);
            } else {
                setAllNotifications((prev) => {
                    const existingIds = new Set(prev.map((n) => n._id));
                    const newNotifications = notificationsList.notifications.filter(
                        (n) => !existingIds.has(n._id),
                    );
                    return [...prev, ...newNotifications];
                });
            }
        }
    }, [notificationsList, offset]);

    const handleMenuClose = () => {
        setAnchorEl(null);
        setOffset(0);
        setAllNotifications([]);
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.target);
    };

    const handleSeenNotification = async (notificationId) => {
        try {
            await seenNotification(notificationId).unwrap();
        } catch (error) {
            console.error('Failed to mark notification as seen:', error);
        }
    };

    const loadMoreNotifications = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };

    const hasMore = allNotifications.length < (notificationsList?.total || 0);

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
            <div className='max-h-60 overflow-y-auto' id='notification-list'>
                <InfiniteScroll
                    dataLength={allNotifications.length}
                    next={loadMoreNotifications}
                    hasMore={hasMore}
                    loader={<Loading />}
                    scrollableTarget='notification-list'
                    endMessage={
                        <p className='py-4 text-center text-gray-400'>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {allNotifications.map((notification) => (
                        <GenerateNotificationMessage
                            key={notification._id}
                            notification={notification}
                            onSeenNotification={() => {
                                if (!notification.seen) {
                                    handleSeenNotification(notification._id);
                                }
                            }}
                            setAnchorEl={setAnchorEl}
                        />
                    ))}
                    {allNotifications.length === 0 && (
                        <p className='py-4 text-center text-gray-500'>
                            No notifications available.
                        </p>
                    )}
                </InfiniteScroll>
            </div>
        </Menu>
    );

    return (
        <>
            <IconButton size='medium' onClick={handleNotificationClick}>
                <Badge
                    badgeContent={notificationCount?.length || undefined}
                    color='error'
                >
                    <Notifications />
                </Badge>
            </IconButton>
            {renderNotifications}
        </>
    );
};

export default NotificationsPanel;

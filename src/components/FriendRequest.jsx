import { socket } from '@context/SocketProvider';
import { Cancel, Check } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import {
    useAcceptFriendRequestMutation,
    useCancelFriendRequestMutation,
    useGetListFriendsQuery,
    useGetPeddingFriendRequestsQuery,
} from '@services/friendAPI';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';

import React, { useEffect } from 'react';
import Button from './Button';
import { Events } from '@libs/constants';
const FriendRequestItems = ({ userInfor, id }) => {
    const [acceptFriendRequest, { isLoading: acceptLoading }] =
        useAcceptFriendRequestMutation();
    const [cancelFriendRequest, { isLoading: cancelLoading }] =
        useCancelFriendRequestMutation();
    return (
        <div className='flex gap-2'>
            <Avatar
                {...stringAvatar(userInfor.fullName)}
                src={getAvatar(userInfor)?.avatar}
            />

            <div>
                <p className='font-bold'>{userInfor.fullName}</p>
                <div className='mt-2 flex items-center gap-2'>
                    <Button
                        variant='contained'
                        size='small'
                        className='mr-2 flex items-center justify-between'
                        onClick={() => acceptFriendRequest(id)}
                        isLoading={acceptLoading}
                        icon={<Check className='mr-1' fontSize='small' />}
                    >
                        Accept
                    </Button>
                    <Button
                        variant='outlined'
                        size='small'
                        className='flex items-center justify-between'
                        onClick={() => cancelFriendRequest(id)}
                        isLoading={cancelLoading}
                        icon={<Cancel className='mr-1' fontSize='small' />}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};
const FriendRequest = () => {
    const { data = [], refetch } = useGetPeddingFriendRequestsQuery();
    const { data: friendList } = useGetListFriendsQuery();

    useEffect(() => {
        socket.on(Events.FRIEND_REQUEST_RECEIVED, (data) => {
            if (data.from) {
                refetch(); // thủ công xoá dữ liệu đã caching
            }
        });
        return () => {
            socket.off(Events.FRIEND_REQUEST_RECEIVED); // Clean up the event listener
        };
    }, [refetch]);
    return (
        <>
            <div className='card'>
                <p className='mb-4 font-bold'>Friend Request</p>
                {/* <p className='font-bold'>See All</p> */}
                <div className='space-y-4'>
                    {data &&
                        data?.map((user) => (
                            <FriendRequestItems
                                key={user._id}
                                userInfor={user}
                                id={user._id}
                            />
                        ))}
                </div>
            </div>
            <div className='card mt-4'>
                <p className='mb-4 font-bold'>Friends</p>
                <div className='space-y-4'>
                    {friendList &&
                        friendList?.friends?.map((friend) => (
                            <div className='flex items-center gap-2' key={friend._id}>
                                <Avatar
                                    {...stringAvatar(friend.fullName)}
                                    src={getAvatar(friend)?.avatar}
                                />
                                <p className='font-bold'>{friend.fullName}</p>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default FriendRequest;

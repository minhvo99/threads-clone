import { socket } from '@context/SocketProvider';
import { Cancel, Check } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import {
    useAcceptFriendRequestMutation,
    useCancelFriendRequestMutation,
    useGetPeddingFriendRequestsQuery,
} from '@services/rootApi';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';

import React, { useEffect } from 'react';
import Button from './Button';
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

    useEffect(() => {
        socket.on('friendRequestReceived', (data) => {
            if (data.from) {
                refetch(); // Refetch the friend requests when a new request is received
            }
        });
        return () => {
            socket.off('friendRequestSent'); // Clean up the event listener
        };
    }, [refetch]);
    return (
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
    );
};

export default FriendRequest;

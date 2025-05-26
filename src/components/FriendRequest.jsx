import { socket } from '@context/SocketProvider';
import { Cancel, Check } from '@mui/icons-material';
import { Avatar, Button } from '@mui/material';
import { useGetPeddingFriendRequestsQuery } from '@services/rootApi';
import { stringAvatar } from '@utils/stringAvatar';

import React, { useEffect } from 'react';
const FriendRequestItems = ({ fullName }) => {
    return (
        <>
            <div className='flex items-center gap-3'>
                <Avatar {...stringAvatar(fullName)} />
                <p className='font-bold'>{fullName}</p>
            </div>

            <div className='mt-2 flex justify-items-start gap-1'>
                <Button
                    variant='contained'
                    size='small'
                    className='mr-2 flex items-center justify-between'
                >
                    <Check className='mr-1' fontSize='small' />
                    Accept
                </Button>
                <Button
                    variant='outlined'
                    size='small'
                    className='flex items-center justify-between'
                >
                    <Cancel className='mr-1' fontSize='small' />
                    Cancel
                </Button>
            </div>
        </>
    );
};
const FriendRequest = () => {
    const { data = [], refetch } = useGetPeddingFriendRequestsQuery();
    useEffect(() => {
        socket.on('friendRequestReceived', (data) => {
            console.log('[friendRequestSent]', data);
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
                {data.legnth ? (
                    data?.map((user) => (
                        <FriendRequestItems key={user._id} fullName={user.fullName} />
                    ))
                ) : (
                    <p className='text-center'>No friend requests</p>
                )}
            </div>
        </div>
    );
};

export default FriendRequest;

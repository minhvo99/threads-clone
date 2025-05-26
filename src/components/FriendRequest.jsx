import { socket } from '@context/SocketProvider';
import { Cancel, Check } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import {
    useAcceptFriendRequestMutation,
    useCancelFriendRequestMutation,
    useGetPeddingFriendRequestsQuery,
} from '@services/rootApi';
import { stringAvatar } from '@utils/stringAvatar';

import React, { useEffect } from 'react';
import Button from './Button';
const FriendRequestItems = ({ fullName = 'Tran Thi Huyen Vy', id }) => {
    const [acceptFriendRequest, { isLoading: acceptLoading }] =
        useAcceptFriendRequestMutation();
    const [cancelFriendRequest, { isLoading: cancelLoading }] =
        useCancelFriendRequestMutation();
    return (
        <div className='flex gap-2'>
            <Avatar {...stringAvatar(fullName)} />
            {/* <Avatar
                src={`https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/468963019_3979216872356648_1565259019254624441_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeHa3xrh81f2BgIizr3HlDsaYxncAbSdlt5jGdwBtJ2W3ptqPa0eW_vqzWELri_LFZjMGdvTfBlEnjIS0p5M2CJX&_nc_ohc=C5_fK7_P298Q7kNvwF_LQcW&_nc_oc=Adlu6DIm1R0XpL5k57tlOwhijsM95_iDVv3V_3ryuAqawWzDivHzimsCl-e4drP2jyDcB8dbtLPVzItOArYH6MbB&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=C1Mu1EsJzvd7mbGAtpHzBg&oh=00_AfIE-UHIR4FJI92sJ_XMjBdYGxAjcIxkqlSz06qsqjl5rA&oe=683A546A`}
            /> */}

            <div>
                <p className='font-bold'>{fullName}</p>
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
                        <FriendRequestItems
                            key={user._id}
                            fullName={user.fullName}
                            id={user._id}
                        />
                    ))
                ) : (
                    <p className='text-center'>No friend requests</p>
                )}
                <FriendRequestItems />
                <FriendRequestItems />
                <FriendRequestItems />
            </div>
        </div>
    );
};

export default FriendRequest;

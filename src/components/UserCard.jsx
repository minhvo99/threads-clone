import { socket } from '@context/SocketProvider';
import {
    Cancel,
    Check,
    MessageOutlined,
    PersonAdd,
    PersonAddAlt,
} from '@mui/icons-material';
import { Avatar, CircularProgress } from '@mui/material';
import {
    useAcceptFriendRequestMutation,
    useCancelFriendRequestMutation,
    useSendFriendRequestMutation,
} from '@services/rootApi';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const UserCard = ({ userInfo, isFriend, requestSent, requestReceived, id }) => {
    const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation();
    const [acceptFriendRequest, { isLoading: acceptLoading }] =
        useAcceptFriendRequestMutation();
    const [cancelFriendRequest, { isLoading: cancelLoading }] =
        useCancelFriendRequestMutation();

    const getActionButton = () => {
        if (isFriend) {
            return (
                <Button
                    variant='contained'
                    size='small'
                    className='flex items-center justify-between'
                    icon={<MessageOutlined className='mr-1' fontSize='small' />}
                >
                    Message
                </Button>
            );
        }
        if (requestSent) {
            return (
                <Button
                    variant='outlined'
                    size='small'
                    className='flex items-center justify-between'
                    icon={<Check className='mr-1' fontSize='small' />}
                >
                    Request Sent
                </Button>
            );
        }
        if (requestReceived) {
            return (
                <div>
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
            );
        }
        return (
            <Button
                variant='outlined'
                size='small'
                className='flex items-center justify-between'
                onClick={async () => {
                    await sendFriendRequest(userInfo._id).unwrap();
                    socket.emit('friendRequestSent', {
                        receiverId: userInfo._id,
                    });
                }}
                isLoading={isLoading}
                icon={<PersonAdd className='mr-1' fontSize='small' />}
            >
                Add Friend
            </Button>
        );
    };
    return (
        <div className='card flex flex-col items-center'>
            <Avatar
                {...stringAvatar(userInfo?.fullName)}
                src={getAvatar(userInfo)?.avatar}
                className='mb-3'
            />
            <Link>
                <p className='text-lg font-bold'>{userInfo.fullName}</p>
            </Link>
            <div className='mt-4'>{getActionButton()}</div>
        </div>
    );
};

export default UserCard;

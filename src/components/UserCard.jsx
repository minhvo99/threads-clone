import { socket } from '@context/SocketProvider';
import {
    Cancel,
    Check,
    MessageOutlined,
    PersonAdd,
    PersonAddAlt,
} from '@mui/icons-material';
import { Avatar, Button, CircularProgress } from '@mui/material';
import { useSendFriendRequestMutation } from '@services/rootApi';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ userInfo, isFriend, requestSent, requestReceived }) => {
    const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation();

    const getActionButton = () => {
        if (isFriend) {
            return (
                <Button
                    variant='contained'
                    size='small'
                    className='flex items-center justify-between'
                >
                    <MessageOutlined className='mr-1' fontSize='small' />
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
                >
                    <Check className='mr-1' fontSize='small' />
                    Request Sent
                </Button>
            );
        }
        if (requestReceived) {
            return (
                <div>
                    <Button
                        variant='outlined'
                        size='small'
                        className='flex items-center justify-between'
                    >
                        <PersonAddAlt className='mr-1' fontSize='small' />
                        Accept Request
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
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <CircularProgress className='mr-1 animate-spin' size='24px' />
                        Sending
                    </>
                ) : (
                    <>
                        <PersonAdd className='mr-1' fontSize='small' /> Add Friend
                    </>
                )}
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

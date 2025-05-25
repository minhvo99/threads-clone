import { Comment, Favorite } from '@mui/icons-material';
import { Avatar, Button } from '@mui/material';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
import dayjs from 'dayjs';
import React from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Post = ({ userInfo, createAt, content, image, comments, likes }) => {
    return (
        <div className='card'>
            <div className='my-3 flex gap-3'>
                <Avatar
                    {...stringAvatar(userInfo?.fullName)}
                    src={getAvatar(userInfo)?.avatar}
                />
                <div>
                    <p className='font-bold'>{userInfo?.fullName}</p>
                    <p className='text-dark-400 text-sm'>
                        {dayjs(createAt).format('DD/MM/YYYY HH:mm')}
                    </p>
                </div>
            </div>

            <p className='mb-1'>{content}</p>
            {image && <img src={image} alt='Post image' />}
            <div className='mt-2 flex justify-between'>
                <div className='flex gap-1 text-sm'>
                    <Favorite fontSize='small' className='text-primary text-red-500' />
                    <p>{likes?.length}</p>
                </div>
                <div className='text-sm'>
                    <p>{comments?.length} comments</p>
                </div>
            </div>
            <div className='border-dark-300 flex border-t border-b py-1 text-sm'>
                <Button size='small' className='!text-dark-100 flex-1'>
                    <FavoriteBorderIcon fontSize='small' className='mr-1 text-red-500' />
                </Button>
                <Button size='small' className='!text-dark-100 flex-1'>
                    <Comment fontSize='small' className='mr-1' />
                </Button>
            </div>
        </div>
    );
};

export default Post;

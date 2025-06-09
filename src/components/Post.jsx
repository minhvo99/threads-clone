import { Favorite, Send } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';

import { useUserInfor } from '@hooks/index';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDeleteCommentMutation, useDeletePostMutation } from '@services/postAPI';
import { useDispatch } from 'react-redux';
import { openSnakeBar } from '@redux/slices/snakeBarSlices';

const Post = ({
    userInfo,
    createAt,
    content,
    image,
    comments,
    likes,
    onLike,
    onUnLike,
    isLiked,
    id,
    onComment,
    author,
}) => {
    const authInfo = useUserInfor();
    const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [onDeletePost, { isLoading }] = useDeletePostMutation();
    const dispatch = useDispatch();
    const [onDeleteComment] = useDeleteCommentMutation();
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const renderMenu = (
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
        >
            <MenuItem
                onClick={async () => {
                    await onDeletePost(id).unwrap();
                    handleMenuClose();
                    if (!isLoading) {
                        dispatch(
                            openSnakeBar({
                                message: 'Post deleted successfully',
                            }),
                        );
                    }
                }}
            >
                <DeleteOutlineIcon />
            </MenuItem>
        </Menu>
    );

    const handleOpenMenu = (event) => {
        setAnchorEl(event.target);
    };

    return (
        <>
            <div className='card'>
                <div className='flex justify-between'>
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
                    {author === userInfo._id && (
                        <MoreHorizIcon onClick={handleOpenMenu} />
                    )}
                </div>

                <p className='mb-1'>{content}</p>
                {image && <img src={image} alt='Post image' />}
                <div className='mt-4 flex items-center justify-items-start gap-4'>
                    <div className='flex items-center gap-1 text-sm'>
                        {isLiked ? (
                            <IconButton
                                size='small'
                                className='!text-dark-100 flex-1'
                                onClick={() => onUnLike(id)}
                                data-testid='unlike-button'
                            >
                                <Favorite
                                    fontSize='small'
                                    className='text-primary text-red-500'
                                />
                            </IconButton>
                        ) : (
                            <IconButton
                                size='small'
                                className='!text-dark-100 flex-1'
                                onClick={() => onLike(id)}
                                data-testid='like-button'
                            >
                                <FavoriteBorderIcon fontSize='small' className='mr-1' />
                            </IconButton>
                        )}
                        <p>{likes?.length}</p>
                    </div>
                    <div className='flex items-center justify-center text-sm'>
                        <IconButton
                            size='small'
                            className='!text-dark-100 flex-1'
                            onClick={() => setIsCommentBoxOpen(!isCommentBoxOpen)}
                            data-testid='comment-button'
                        >
                            <FontAwesomeIcon
                                size='small'
                                className='mr-1'
                                icon={faComment}
                            />
                        </IconButton>
                        <p>{comments?.length}</p>
                    </div>
                    <div className='flex items-center justify-center text-sm'>
                        <IconButton size='small' className='!text-dark-100 flex-1'>
                            <FontAwesomeIcon
                                fontSize='small'
                                className='mr-1'
                                icon={faRepeat}
                            />
                        </IconButton>

                        <p>0</p>
                    </div>
                    <div className='flex items-center justify-center text-sm'>
                        <IconButton size='small' className='!text-dark-100 flex-1'>
                            <FontAwesomeIcon
                                size='small'
                                className='mr-1'
                                icon={faPaperPlane}
                            />
                        </IconButton>

                        <p>0</p>
                    </div>
                </div>
                {isCommentBoxOpen && (
                    <>
                        <div className='max-h-48 overflow-y-auto py-2'>
                            {[...comments].reverse().map((comment) => (
                                <div key={comment._id} className='flex gap-2 px-4 py-2'>
                                    <div className='flex'>
                                        <Avatar
                                            {...stringAvatar(comment?.author?.fullName)}
                                            src={getAvatar(comment?.author)?.avatar}
                                            className='!h-8 !w-8'
                                        />
                                        <div className='rounded-md bg-slate-100 px-2 py-1 shadow-md'>
                                            <div className='flex items-center gap-1'>
                                                <p className='font-bold'>
                                                    {comment.author?.fullName}
                                                </p>
                                                <p className='text-dark-400 text-xs'>
                                                    {dayjs(comment.createdAt).format(
                                                        'DD/MM/YYYY : HH:mm',
                                                    )}
                                                </p>
                                            </div>
                                            <p>{comment.comment}</p>
                                        </div>
                                    </div>
                                    {comment.author._id === author && (
                                        <MoreHorizIcon
                                            onClick={() => {
                                                onDeleteComment({
                                                    postId: id,
                                                    id: comment._id,
                                                });
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='flex items-center gap-2'>
                            <Avatar
                                {...stringAvatar(authInfo?.fullName)}
                                src={getAvatar(authInfo)?.avatar}
                                className='!h-8 !w-8'
                            />
                            <TextField
                                className='flex-1 !border-none'
                                size='small'
                                placeholder='Left a comment...'
                                value={comment}
                                autoFocus={true}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '2.5rem',
                                        '& fieldset': {
                                            borderRadius: '2.5rem',
                                        },
                                    },
                                }}
                                onChange={(e) => {
                                    setComment(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && comment.trim()) {
                                        onComment({ postId: id, comment });
                                        setComment('');
                                    }
                                }}
                            />
                            <IconButton
                                disabled={!comment}
                                size='small'
                                onClick={() => {
                                    if (comment.trim()) {
                                        onComment({ postId: id, comment });
                                        setComment('');
                                    }
                                }}
                                data-testid='send-comment-button'
                            >
                                <Send />
                            </IconButton>
                        </div>
                    </>
                )}
            </div>
            {renderMenu}
        </>
    );
};

export default Post;

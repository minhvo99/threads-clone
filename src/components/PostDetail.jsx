import { faComment, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNotifications, useUserInfor } from '@hooks/index';
import { Avatar, IconButton, TextField } from '@mui/material';
import {
    useCreateCommentMutation,
    useDeleteCommentMutation,
    useGetPostByIdQuery,
    useLikePostMutation,
    useUnLikePostMutation,
} from '@services/postAPI';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSnakeBar } from '@redux/slices/snakeBarSlices';
import { Favorite, Send } from '@mui/icons-material';
import MenuPopUp from './MenuPopUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const PostDetail = () => {
    const { id } = useParams();
    const authInfo = useUserInfor();
    const [likePost] = useLikePostMutation();
    const [unLikePost] = useUnLikePostMutation();
    const { createNotification } = useNotifications();
    const [createComment] = useCreateCommentMutation();
    const [onDeleteComment] = useDeleteCommentMutation();
    const [dotMenu, setDotMenu] = useState(null);
    const handleDotMenuClose = () => {
        setDotMenu(null);
    };
    const handleOpenDotMenu = (event) => {
        setDotMenu(event.target);
    };
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();

    const { data = {} } = useGetPostByIdQuery(id);
    const isLiked = () => {
        return data?.likes?.some((like) => like?.author?._id === authInfo._id);
    };
    const onComment = async () => {
        const res = await createComment({ postId: data._id, comment }).unwrap();
        createNotification({
            receiverUserId: data.author?._id,
            postId: data._id,
            notificationType: 'comment',
            notificationTypeId: res._id,
        });
    };
    const onLike = async () => {
        const res = await likePost(data?._id).unwrap();
        createNotification({
            receiverUserId: data.author?._id,
            postId: data._id,
            notificationType: 'like',
            notificationTypeId: res._id,
        });
    };

    return (
        <div className='container'>
            <div className='card flex flex-1 flex-col gap-4'>
                <div className='flex justify-between'>
                    <div className='my-3 flex gap-3'>
                        <Avatar
                            {...stringAvatar(data?.author?.fullName)}
                            src={getAvatar(data?.author)?.avatar}
                        />
                        <div>
                            <p className='font-bold'>{data?.author?.fullName}</p>
                            <p className='text-dark-400 text-sm'>
                                {dayjs(data?.createAt).format('DD/MM/YYYY HH:mm')}
                            </p>
                        </div>
                    </div>
                </div>

                <p className='mb-1'>{data?.content}</p>
                {data?.image && <img src={data?.image} />}
                <div className='mt-4 flex items-center justify-items-start gap-4'>
                    <div className='flex items-center gap-1 text-sm'>
                        {isLiked() ? (
                            <IconButton
                                size='small'
                                className='!text-dark-100 flex-1'
                                onClick={() => unLikePost(data?._id)}
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
                                onClick={onLike}
                                data-testid='like-button'
                            >
                                <FavoriteBorderIcon fontSize='small' className='mr-1' />
                            </IconButton>
                        )}
                        <p>{data?.likes?.length}</p>
                    </div>
                    <div className='flex items-center justify-center text-sm'>
                        <IconButton
                            size='small'
                            className='!text-dark-100 flex-1'
                            data-testid='comment-button'
                        >
                            <FontAwesomeIcon
                                size='small'
                                className='mr-1'
                                icon={faComment}
                            />
                        </IconButton>
                        <p>{data?.comments?.length}</p>
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

                <>
                    <div className='max-h-48 overflow-y-auto py-2 sm:max-h-[400px]'>
                        {data?.comments &&
                            [...data.comments]
                                .sort(
                                    (a, b) =>
                                        new Date(b.updatedAt) - new Date(a.updatedAt),
                                )
                                ?.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className='flex gap-2 px-4 py-2'
                                    >
                                        <div className='flex gap-2'>
                                            <Avatar
                                                {...stringAvatar(
                                                    comment?.author?.fullName,
                                                )}
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
                                        {comment.author?._id === authInfo?._id && (
                                            <MoreHorizIcon onClick={handleOpenDotMenu} />
                                        )}
                                        <MenuPopUp
                                            onClick={async () => {
                                                try {
                                                    await onDeleteComment({
                                                        postId: id,
                                                        id: comment._id,
                                                    }).unwrap();
                                                } catch (error) {
                                                    dispatch(
                                                        openSnakeBar({
                                                            type: 'error',
                                                            message: error?.error,
                                                        }),
                                                    );
                                                } finally {
                                                    handleDotMenuClose();
                                                }
                                            }}
                                            children='Delete comment'
                                            anchorEl={dotMenu}
                                            handleMenuClose={handleDotMenuClose}
                                        />
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
                                    onComment();
                                    setComment('');
                                }
                            }}
                        />
                        <IconButton
                            disabled={!comment}
                            size='small'
                            onClick={() => {
                                if (comment.trim()) {
                                    onComment();
                                    setComment('');
                                }
                            }}
                            data-testid='send-comment-button'
                        >
                            <Send />
                        </IconButton>
                    </div>
                </>
            </div>
        </div>
    );
};

export default PostDetail;

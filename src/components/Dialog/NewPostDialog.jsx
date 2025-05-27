import { ImageUploader } from '@components/PostCreation';
import {
    Avatar,
    Button,
    CircularProgress,
    DialogActions,
    DialogContent,
    TextareaAutosize,
} from '@mui/material';
import { closeDialog } from '@redux/slices/dialogSlice';
import { openSnakeBar } from '@redux/slices/snakeBarSlices';
import { useCreatePostMutation } from '@services/rootApi';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
const NewPostDialog = ({ userInfo }) => {
    const [createNewPost, { isLoading }] = useCreatePostMutation();
    const [content, setContent] = useState('');
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleCreateNewPost = async () => {
        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('image', image);
            await createNewPost(formData).unwrap();
            dispatch(closeDialog());
        } catch (error) {
            dispatch(
                openSnakeBar({
                    type: 'error',
                    message: error?.data?.message,
                }),
            );
        }
    };
    return (
        <div>
            <DialogContent className='!pt-4'>
                <div className='flex items-center gap-2'>
                    <Avatar
                        {...stringAvatar(userInfo?.fullName)}
                        src={getAvatar(userInfo)?.avatar}
                    />{' '}
                    <p className='font-bold'>{userInfo.fullName}</p>
                </div>
                <TextareaAutosize
                    minRows={3}
                    placeholder='What is on your mine?'
                    className='mt-4 w-full p-2'
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <ImageUploader
                    setImagePreview={setImagePreview}
                    setImage={setImage}
                    imagePreview={imagePreview}
                />
            </DialogContent>
            <DialogActions className='!px-6 !pt-5 !pb-5'>
                <Button fullWidth variant='contained' onClick={handleCreateNewPost}>
                    {isLoading && (
                        <CircularProgress color='#ffffff' size='16px' className='mr-1' />
                    )}
                    Post
                </Button>
            </DialogActions>
        </div>
    );
};

export default NewPostDialog;

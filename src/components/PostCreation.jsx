import { Avatar, IconButton, Stack, TextField } from '@mui/material';
import { openDialog } from '@redux/slices/dialogSlice';

import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
import { Close } from '@mui/icons-material';
import { useUserInfor } from '@hooks/index';

export const ImageUploader = ({ setImage, imagePreview, setImagePreview }) => {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles) {
                setImage(acceptedFiles[0]);
                const reader = new FileReader();
                reader.onload = () => {
                    setImagePreview({
                        name: acceptedFiles[0].name,
                        path: reader.result,
                    });
                };
                reader.readAsDataURL(acceptedFiles[0]);
            }
        },
        [setImage, setImagePreview],
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxFiles: 1,
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
    });

    return (
        <div className='relative flex flex-col items-center'>
            {!imagePreview ? (
                <div
                    {...getRootProps({
                        className:
                            'border rounded py-4 px-6 text-center bg-slate-100 cursor-pointer h-20 flex items-center justify-center',
                    })}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className='text-rose-600'>Drop the files here ...</p>
                    ) : (
                        <p>
                            Drag &apos;n&apos; drop some files here, or click to select
                            files
                        </p>
                    )}
                </div>
            ) : (
                <div className='relative mt-4 flex justify-center'>
                    <Stack className='absolute top-0 right-0 z-10'>
                        <IconButton onClick={() => setImage(null)}>
                            <Close />
                        </IconButton>
                    </Stack>
                    <img
                        src={imagePreview.path}
                        alt={imagePreview.name}
                        width={300}
                        className='mx-auto'
                    />
                </div>
            )}
        </div>
    );
};

const PostCreation = () => {
    const userInfo = useUserInfor();

    const dispatch = useDispatch();

    return (
        <div className='card flex gap-2'>
            <Avatar
                {...stringAvatar(userInfo?.fullName)}
                src={getAvatar(userInfo)?.avatar}
            />
            <TextField
                className='flex-1 !border-none'
                size='small'
                placeholder='What is on your mine?'
                onClick={() =>
                    dispatch(
                        openDialog({
                            title: 'Create Post',
                            contentType: 'NEW_POST_DIALOG',
                            additionalData: userInfo,
                        }),
                    )
                }
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '2.5rem',
                        '& fieldset': {
                            borderRadius: '2.5rem',
                        },
                    },
                }}
            />
        </div>
    );
};

export default PostCreation;

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '@components/FormField';
import TextInput from '@components/FormInputs/TextInput';
import { Button, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@services/rootApi';
import { openSnakeBar } from '@redux/slices/snakeBarSlices';

const LoginPage = () => {
    const { control, handleSubmit } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { data, error, isError, isSuccess }] = useLoginMutation();
    const onSubmit = (data) => {
        login(data);
    };
    useEffect(() => {
        if (isSuccess) {
            dispatch(openSnakeBar({ message: data.message }));
            navigate('/veryfy-otp');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, navigate, dispatch, JSON.stringify(data)]);
    return (
        <>
            <p className='mb-5 text-center text-2xl font-bold'>Sign In</p>
            <form
                className='flex flex-col items-center justify-center gap-4'
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormField
                    name='email'
                    label='Email'
                    control={control}
                    Component={TextInput}
                />
                <FormField
                    name='password'
                    label='Password'
                    control={control}
                    type='password'
                    Component={TextInput}
                />
                <Button variant='contained' className='w-full' type='submit'>
                    Sign In
                </Button>
                {isError && (
                    <Alert severity='error' className='w-full'>
                        {error?.data?.message}
                    </Alert>
                )}
            </form>
            <p className='mt-4 text-center'>
                New on our platform?{' '}
                <Link to='/register' className='text-blue-500'>
                    Create account
                </Link>
            </p>
        </>
    );
};

export default LoginPage;

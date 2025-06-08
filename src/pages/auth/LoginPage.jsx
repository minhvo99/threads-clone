import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '@components/FormField';
import TextInput from '@components/FormInputs/TextInput';
import { Button, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@services/rootApi';
import { openSnakeBar } from '@redux/slices/snakeBarSlices';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const LoginPage = () => {
    const formBulder = yup.object().shape({
        email: yup.string().required('Email is required'),
        password: yup.string().required('Password is required'),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        resolver: yupResolver(formBulder),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { data, isLoading, error, isError, isSuccess }] = useLoginMutation();
    const onSubmit = (data) => {
        login(data);
    };
    useEffect(() => {
        if (isSuccess) {
            dispatch(openSnakeBar({ message: data?.message }));
            navigate('/verify-otp', {
                state: {
                    email: getValues('email'),
                    password: getValues('password'),
                },
            });
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
                    error={errors['email']}
                />
                <FormField
                    name='password'
                    label='Password'
                    control={control}
                    type='password'
                    Component={TextInput}
                    error={errors['password']}
                />
                <Button variant='contained' className='w-full' type='submit'>
                    {isLoading && (
                        <CircularProgress color='#ffffff' size='16px' className='mr-1' />
                    )}
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

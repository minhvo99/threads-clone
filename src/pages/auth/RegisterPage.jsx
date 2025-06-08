import FormField from '@components/FormField';
import { useForm } from 'react-hook-form';
import TextInput from '@components/FormInputs/TextInput';
import { Alert, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@services/rootApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openSnakeBar } from '@redux/slices/snakeBarSlices';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const RegisterPage = () => {
    const emailRegex =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    const formBuilder = yup.object().shape({
        fullName: yup.string().required('Full Name is required'),
        email: yup
            .string()
            .matches(emailRegex, 'Email is invalid')
            .required('Email is required'),
        password: yup.string().required('Password is required'),
        passwordConfirmation: yup
            .string()
            .required('Confirm Password is required')
            .oneOf([yup.ref('password'), null], 'Passwords must match'),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(formBuilder),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
        },
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onSubmit = (data) => {
        register(data);
    };
    const [register, { data = {}, isError, error, isSuccess }] = useRegisterMutation();
    useEffect(() => {
        if (isSuccess) {
            dispatch(openSnakeBar({ message: data.message }));
            navigate('/login');
        }
    }, [isSuccess, navigate, dispatch, data.message]);

    return (
        <>
            <p className='mb-5 text-center text-2xl font-bold'>Sign Up</p>
            <form
                className='flex flex-col items-center justify-center gap-4'
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormField
                    name='fullName'
                    label='Full Name'
                    control={control}
                    Component={TextInput}
                    error={errors['fullName']}
                />
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
                <FormField
                    name='passwordConfirmation'
                    label='Confirm Password'
                    control={control}
                    type='password'
                    Component={TextInput}
                    error={errors['passwordConfirmation']}
                />
                <Button variant='contained' className='w-full' type='submit'>
                    Sign Up
                </Button>
                {isError && (
                    <Alert severity='error' className='w-full'>
                        {error?.data?.message}
                    </Alert>
                )}
            </form>
            <p className='mt-4 text-center'>
                Already have an account?{' '}
                <Link to='/login' className='text-blue-500'>
                    Sign in instead
                </Link>
            </p>
        </>
    );
};

export default RegisterPage;

import FormField from '@components/FormField';
import { useForm } from 'react-hook-form';
import { Alert, Button, CircularProgress } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OPTInput from '@components/FormInputs/OPTInput';
import { useVerifyOtpMutation, useLoginMutation } from '@services/rootApi';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { openSnakeBar } from '@redux/slices/snakeBarSlices';
import { login } from '@redux/slices/authSlices';

const OTPVeriyPage = () => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            otp: '',
        },
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [verifyOtp, { data, isLoading, error, isSuccess, isError }] =
        useVerifyOtpMutation();
    const [resendOTP, { data: otpRespon, isSuccess: isResendSuccess }] =
        useLoginMutation();
    const onSubmit = (data) => {
        verifyOtp({
            email: location?.state?.email || '',
            otp: data.otp,
        });
    };
    const handleResendOTP = () => {
        resendOTP({
            email: location?.state?.email || '',
            password: location?.state?.password || '',
        });
    };
    useEffect(() => {
        if (isResendSuccess) {
            dispatch(openSnakeBar({ type: 'success', message: otpRespon?.message }));
        }
        if (isError) {
            dispatch(openSnakeBar({ type: 'error', message: error?.data?.message }));
        }
        if (isSuccess) {
            dispatch(login(data));
            navigate('/');
        }
    }, [isSuccess, navigate, dispatch, error, isError, data, isResendSuccess, otpRespon]);
    return (
        <>
            <p className='mb-5 text-center text-2xl font-bold'>
                Two-Step Verification 💬
            </p>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                <FormField
                    name='otp'
                    label='Type your 6 digit security code'
                    control={control}
                    Component={OPTInput}
                />
                <Button type='submit' variant='contained' className='w-full'>
                    {isLoading && (
                        <CircularProgress color='#ffffff' size='16px' className='mr-1' />
                    )}
                    Verify my account
                </Button>
            </form>
            <p className='mt-4 text-center'>
                Didn&apos;t get the code?{' '}
                <span onClick={handleResendOTP} className='cursor-pointer text-blue-500'>
                    Resend
                </span>
            </p>
        </>
    );
};

export default OTPVeriyPage;

import { CircularProgress, Button as MUIButton } from '@mui/material';
import React from 'react';

const Button = ({
    variant = 'outlined',
    size = 'small',
    onClick,
    isLoading = false,
    icon,
    children,
}) => {
    return (
        <MUIButton
            variant={variant}
            size={size}
            className='mr-2 flex items-center justify-between'
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <CircularProgress className='mr-1 animate-spin' size='24px' />
            ) : (
                icon
            )}
            {children}
        </MUIButton>
    );
};

export default Button;

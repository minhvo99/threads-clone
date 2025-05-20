import { FormHelperText } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

// eslint-disable-next-line no-unused-vars
const FormField = ({ control, label, name, error, Component, type }) => {
    return (
        <div className='w-full'>
            <p className='font-sm text-dark-100 mb-1 text-sm'>{label}</p>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, name } }) => {
                    return (
                        <Component
                            onChange={onChange}
                            value={value}
                            name={name}
                            control={control}
                            type={type}
                            error={error?.message}
                        />
                    );
                }}
            />
            {error?.message && (
                <FormHelperText error={true}>{error?.message}</FormHelperText>
            )}
        </div>
    );
};

export default FormField;

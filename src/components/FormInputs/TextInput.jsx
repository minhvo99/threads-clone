import { TextField } from '@mui/material';
import React from 'react';

const TextInput = ({ onChange, value, name, type = 'text', error }) => {
    return (
        <TextField
            fullWidth
            slotProps={{
                input: { className: 'h-10 px-3 py-2' },
                htmlInput: { className: '!p-0' },
            }}
            name={name}
            onChange={onChange}
            value={value}
            type={type}
            autoComplete='off'
            error={error}
        />
    );
};

export default TextInput;

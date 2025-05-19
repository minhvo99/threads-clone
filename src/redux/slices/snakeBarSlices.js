import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    message: '',
    type: 'success',
};

export const snakeBarSlice = createSlice({
    name: 'snakeBar',
    initialState,
    reducers: {
        openSnakeBar: (state, action) => {
            state.open = true;
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        // eslint-disable-next-line no-unused-vars
        closeSnakeBar: (state) => {
            return initialState;
        },
    },
});
export const { openSnakeBar, closeSnakeBar } = snakeBarSlice.actions;
export default snakeBarSlice.reducer;

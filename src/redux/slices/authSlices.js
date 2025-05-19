import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: null,
    refreshToken: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            //action creator
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
    },
});
export const { login } = authSlice.actions;
export default authSlice.reducer;

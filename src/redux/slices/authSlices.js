import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: null,
    refreshToken: null,
    userInfor: {},
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
        logOut: () => initialState,
        saveUserInfor: (state, action) => {
            state.userInfor = action.payload;
        },
    },
});
export const { login, logOut, saveUserInfor } = authSlice.actions;
export default authSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import reducer from './slices/authSlices';
import { rootApi } from '../services/rootApi';
import snakebarReducer from './slices/snakeBarSlices';

export const store = configureStore({
    reducer: {
        auth: reducer,
        snakebar: snakebarReducer,
        [rootApi.reducerPath]: rootApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(rootApi.middleware),
});

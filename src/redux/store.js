import { combineReducers, configureStore } from '@reduxjs/toolkit';
import reducer from './slices/authSlices';
import { rootApi } from '@services/rootApi';
import snakebarReducer from './slices/snakeBarSlices';
import storage from 'redux-persist/lib/storage';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    persistStore,
} from 'redux-persist';
import { logOutmiddleware } from './middlewares/middlewares';
import settingReducer from './slices/settingSlices';
import dialogReducer from './slices/dialogSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: [
        rootApi.reducerPath,
        // dialogReducer.reducerPath,
        // settingReducer.reducerPath,
        'dialog',
        'settings',
    ],
};

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        auth: reducer,
        snakebar: snakebarReducer,
        settings: settingReducer,
        dialog: dialogReducer,
        [rootApi.reducerPath]: rootApi.reducer,
    }),
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(logOutmiddleware, rootApi.middleware),
});

// setupListeners(store.dispatch);

export const persistor = persistStore(store);

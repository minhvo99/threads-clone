import { logOut } from '@redux/slices/authSlices';
import { persistor } from '@redux/store';

// eslint-disable-next-line no-unused-vars
export const logOutmiddleware = (store) => {
    return (next) => {
        return (action) => {
            if (action.type === logOut?.type) {
                persistor.purge(); //clear all the data from localStorage & persistor
            }
            return next(action);
        };
    };
};

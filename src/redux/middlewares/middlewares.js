import { logOut } from '@redux/slices/authSlices';
import { persistor } from '@redux/store';
import { rootApi } from '@services/rootApi';

export const logOutmiddleware = (store) => {
    return (next) => {
        return (action) => {
            if (action.type === logOut?.type) {
                store.dispatch(rootApi.util.resetApiState()); // Reset the API state
                persistor.purge(); //clear all the data from localStorage & persistor
            }
            return next(action);
        };
    };
};

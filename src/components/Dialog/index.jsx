import { DialogTitle, IconButton, Dialog as MUIDialog } from '@mui/material';
import { closeDialog } from '@redux/slices/dialogSlice';

import { useDispatch, useSelector } from 'react-redux';

import { Close } from '@mui/icons-material';
import NewPostDialog from './NewPostDialog';

const DynamicContent = ({ contentType, additionalData }) => {
    switch (contentType) {
        case 'NEW_POST_DIALOG':
            return <NewPostDialog userInfo={additionalData} />;
        default:
            return <p></p>;
    }
};

const Dialog = () => {
    const dialog = useSelector((state) => state.dialog);
    const dispatch = useDispatch();
    return (
        <div>
            <MUIDialog
                open={dialog.open}
                maxWidth={dialog.maxWidth}
                fullWidth={dialog.fullWidth}
                onClose={() => dispatch(closeDialog())}
            >
                <DialogTitle className='flex items-center justify-between border-b border-b-slate-200'>
                    {dialog.title}
                    <IconButton onClick={() => dispatch(closeDialog())}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DynamicContent
                    contentType={dialog.contentType}
                    additionalData={dialog.additionalData}
                />
            </MUIDialog>
        </div>
    );
};

export default Dialog;

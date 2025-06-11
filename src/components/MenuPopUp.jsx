import { Menu, MenuItem } from '@mui/material';

const MenuPopUp = ({ onClick, children, anchorEl, handleMenuClose }) => {
    return (
        <Menu
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
        >
            <MenuItem onClick={onClick}>{children}</MenuItem>
        </Menu>
    );
};

export default MenuPopUp;

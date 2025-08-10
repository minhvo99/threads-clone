import {
    AppBar,
    Avatar,
    Badge,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Toolbar,
} from '@mui/material';
import React, { useState } from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import Divider from '@mui/material/Divider';
import { Notifications, Search, Menu as MenuIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleDrawer } from '@redux/slices/settingSlices';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
import { useDetectLayout, useLogOut, useUserInfor } from '@hooks/index';
import NotificationsPanel from './NotificationsPanel';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const userInfo = useUserInfor();
    const { handleLogOut } = useLogOut();
    const { isMediumLayout } = useDetectLayout();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const renderMenu = (
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
            <MenuItem>
                <Link to='/my-profile'>Profile</Link>
            </MenuItem>
            <MenuItem onClick={handleLogOut}>
                <p className='text-[red]'>Log Out</p>
            </MenuItem>
        </Menu>
    );

    const handleUserProfileClick = (event) => {
        setAnchorEl(event.target);
    };

    return (
        <div>
            <AppBar color='white' position='static'>
                <Toolbar className='container !min-h-fit justify-between'>
                    {isMediumLayout ? (
                        <IconButton onClick={() => dispatch(toggleDrawer())}>
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <div className='flex items-center gap-4'>
                            <Link to='/'>
                                <img src='/threads.png' className='h-8 w-8' />
                            </Link>
                            <div className='flex items-center gap-1'>
                                <Search />
                                <TextField
                                    variant='standard'
                                    name='search'
                                    placeholder='Search'
                                    slotProps={{
                                        input: { className: 'h-10 px-3 py-2' },
                                        htmlInput: { className: '!p-0' },
                                    }}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            navigate('/search/users', {
                                                state: {
                                                    searchTerm,
                                                },
                                            });
                                        }
                                    }}
                                    sx={{
                                        '.MuiInputBase-root::before': {
                                            display: 'none',
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        {isMediumLayout && (
                            <IconButton>
                                <Search />
                            </IconButton>
                        )}
                        <NotificationsPanel />
                        <IconButton size='medium' onClick={handleUserProfileClick}>
                            {/* <AccountCircle /> */}
                            <Avatar
                                {...stringAvatar(userInfo?.fullName)}
                                src={getAvatar(userInfo)?.avatar}
                            />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    );
};

export default Header;

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
// import { useDispatch } from 'react-redux';

import { Notifications, Search, Menu as MenuIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleDrawer } from '@redux/slices/settingSlices';
import { getAvatar, stringAvatar } from '@utils/stringAvatar';
import { useDetectLayout, useLogOut, useUserInfor } from '@hooks/index';
import NotificationsPanel from './NotificationsPanel';

const Header = () => {
    // const [anchorEl, setAnchorEl] = useState(null);
    // const { handleLogOut } = useLogOut();

    // const renderMenu = (
    //     <Menu
    //         open={!!anchorEl}
    //         anchorEl={anchorEl}
    //         onClose={() => setAnchorEl(null)}
    //         transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    //         anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    //     >
    //         <MenuItem>Giao diện</MenuItem>
    //         <MenuItem>Thông tin chi tiết</MenuItem>
    //         <MenuItem>Cài đặt</MenuItem>
    //         <Divider />
    //         <MenuItem>Bảng feed</MenuItem>
    //         <MenuItem>Đã lưu</MenuItem>
    //         <MenuItem>Đã thích</MenuItem>
    //         <Divider />
    //         <MenuItem>Báo cáo sự cố</MenuItem>
    //         <MenuItem onClick={handleLogOut}>
    //             <p className='text-[red]'>Đăng xuất</p>
    //         </MenuItem>
    //     </Menu>
    // );
    // const handleMenuClick = (event) => {
    //     setAnchorEl(event.target);
    // };
    // return (
    //     <>
    //         {/* Sidebar for desktop/tablet */}
    //         <div className='z-50 hidden bg-white pb-5 shadow md:fixed md:top-0 md:left-0 md:flex md:h-full md:w-20 md:flex-col md:items-center md:justify-between'>
    //             <img src='/threads.png' alt='' className='mt-4 h-12 w-12' />
    //             <div className='mb-4 flex flex-col items-center gap-4'>
    //                 <IconButton size='large'>
    //                     <HomeOutlinedIcon />
    //                 </IconButton>
    //                 <IconButton size='large'>
    //                     <SearchRoundedIcon />
    //                 </IconButton>
    //                 <IconButton size='large'>
    //                     <AddRoundedIcon />
    //                 </IconButton>
    //                 <IconButton size='large'>
    //                     <Badge badgeContent={4} color='error'>
    //                         <FavoriteBorderRoundedIcon />
    //                     </Badge>
    //                 </IconButton>
    //                 <IconButton size='large'>
    //                     <PersonOutlineRoundedIcon />
    //                 </IconButton>
    //             </div>
    //             <IconButton size='large' onClick={handleMenuClick}>
    //                 <MenuRoundedIcon />
    //             </IconButton>
    //         </div>
    //         {/* Top bar for mobile */}
    //         <div className='fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-between bg-white px-6 shadow md:hidden'>
    //             <img src='/threads.png' alt='' className='h-10 w-10' />
    //             <IconButton size='large' onClick={handleMenuClick}>
    //                 <MenuRoundedIcon />
    //             </IconButton>
    //         </div>
    //         {/* Bottom bar for mobile */}
    //         <div className='fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-white px-6 shadow md:hidden'>
    //             <div className='flex w-full items-center justify-center gap-2'>
    //                 <IconButton size='large'>
    //                     <HomeOutlinedIcon />
    //                 </IconButton>
    //                 <IconButton size='large'>
    //                     <SearchRoundedIcon />
    //                 </IconButton>
    //                 <IconButton size='large'>
    //                     <AddRoundedIcon />
    //                 </IconButton>
    //                 <IconButton size='large'>
    //                     <Badge badgeContent={4} color='error'>
    //                         <FavoriteBorderRoundedIcon />
    //                     </Badge>
    //                 </IconButton>
    //                 <IconButton size='large'>
    //                     <PersonOutlineRoundedIcon />
    //                 </IconButton>
    //             </div>
    //         </div>
    //         {renderMenu}
    //     </>
    // );
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
            <MenuItem>Profile</MenuItem>
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

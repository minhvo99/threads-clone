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
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLogOut, useUserInfor } from '@hooks/index';
import NotificationsPanel from './NotificationsPanel';
import { openDialog } from '@redux/slices/dialogSlice';
import { useGetNotificationsQuery } from '@services/notificationAPI';

const AppHeader = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { handleLogOut } = useLogOut();
    const userInfo = useUserInfor();
    const dispatch = useDispatch();

    const { data: notificationsList } = useGetNotificationsQuery({
        limit: 10,
        offset: 0,
    });
    const notificationCount = notificationsList?.notifications?.filter(
        (noti) => !noti.seen,
    );

    const renderMenu = (
        <Menu
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
            <MenuItem>Giao diện</MenuItem>
            <MenuItem>Thông tin chi tiết</MenuItem>
            <MenuItem>Cài đặt</MenuItem>
            <Divider />
            <MenuItem>Bảng feed</MenuItem>
            <MenuItem>Đã lưu</MenuItem>
            <MenuItem>Đã thích</MenuItem>
            <Divider />
            <MenuItem>Báo cáo sự cố</MenuItem>
            <MenuItem onClick={handleLogOut}>
                <p className='text-[red]'>Đăng xuất</p>
            </MenuItem>
        </Menu>
    );
    const handleMenuClick = (event) => {
        setAnchorEl(event.target);
    };
    return (
        <>
            {/* Sidebar for desktop/tablet */}
            <div className='z-50 hidden bg-white pb-5 shadow md:fixed md:top-0 md:left-0 md:flex md:h-full md:w-20 md:flex-col md:items-center md:justify-between'>
                <img src='/threads.png' alt='' className='mt-4 h-12 w-12' />
                <div className='mb-4 flex flex-col items-center gap-4'>
                    <IconButton size='large'>
                        <Link to='/'>
                            <HomeOutlinedIcon />
                        </Link>
                    </IconButton>
                    <IconButton size='large'>
                        <Link to='/search/users'>
                            <SearchRoundedIcon />
                        </Link>
                    </IconButton>
                    <IconButton
                        size='large'
                        onClick={() =>
                            dispatch(
                                openDialog({
                                    title: 'New Thread',
                                    contentType: 'NEW_POST_DIALOG',
                                    additionalData: userInfo,
                                }),
                            )
                        }
                    >
                        <AddRoundedIcon />
                    </IconButton>
                    <IconButton size='large'>
                        <Link to='notifications'>
                            <Badge
                                badgeContent={notificationCount?.length || 0}
                                color='error'
                            >
                                <FavoriteBorderRoundedIcon />
                            </Badge>
                        </Link>
                    </IconButton>
                    <IconButton size='large'>
                        <Link to='/my-profile'>
                            <PersonOutlineRoundedIcon />
                        </Link>
                    </IconButton>
                </div>
                <IconButton size='large' onClick={handleMenuClick}>
                    <MenuRoundedIcon />
                </IconButton>
            </div>
            {/* Top bar for mobile */}
            <div className='sticky top-0 left-0 z-50 flex h-14 w-full items-center justify-between bg-white px-6 shadow md:hidden'>
                <Link to=''>
                    <img src='/threads.png' alt='Logo' className='h-10 w-10' />
                </Link>
                <IconButton size='large' onClick={handleMenuClick}>
                    <MenuRoundedIcon />
                </IconButton>
            </div>
            {/* Bottom bar for mobile */}
            <div className='fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-white px-6 shadow md:hidden'>
                <div className='flex w-full items-center justify-evenly gap-2'>
                    <IconButton size='large'>
                        <Link to='/'>
                            <HomeOutlinedIcon />
                        </Link>
                    </IconButton>
                    <IconButton size='large'>
                        <Link to='/search/users'>
                            <SearchRoundedIcon />
                        </Link>
                    </IconButton>
                    <IconButton
                        size='large'
                        onClick={() =>
                            dispatch(
                                openDialog({
                                    title: 'New Thread',
                                    contentType: 'NEW_POST_DIALOG',
                                    additionalData: userInfo,
                                }),
                            )
                        }
                    >
                        <AddRoundedIcon />
                    </IconButton>
                    <IconButton size='large'>
                        <Link to='notifications'>
                            <Badge
                                badgeContent={notificationCount?.length || 0}
                                color='error'
                            >
                                <FavoriteBorderRoundedIcon />
                            </Badge>
                        </Link>
                    </IconButton>
                    <IconButton size='large'>
                        <Link to='/my-profile'>
                            <PersonOutlineRoundedIcon />
                        </Link>
                    </IconButton>
                </div>
            </div>
            {renderMenu}
        </>
    );
};

export default AppHeader;

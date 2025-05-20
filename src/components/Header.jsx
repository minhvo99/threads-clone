import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import useLogOut from '@hooks/useLogOut';
import Divider from '@mui/material/Divider';

const MENU_ITEMS = [
    { id: 'home', icon: <HomeOutlinedIcon />, label: 'Home', size: 'large' },
    { id: 'search', icon: <SearchRoundedIcon />, label: 'Search', size: 'large' },
    { id: 'add', icon: <AddRoundedIcon />, label: 'Add', size: 'large' },
    {
        id: 'favorite',
        icon: <FavoriteBorderRoundedIcon />,
        label: 'Favorite',
        size: 'large',
    },
    {
        id: 'profile',
        icon: <PersonOutlineRoundedIcon />,
        label: 'Profile',
        size: 'large',
    },
];

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { handleLogOut } = useLogOut();

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
                        <HomeOutlinedIcon />
                    </IconButton>
                    <IconButton size='large'>
                        <SearchRoundedIcon />
                    </IconButton>
                    <IconButton size='large'>
                        <AddRoundedIcon />
                    </IconButton>
                    <IconButton size='large'>
                        <Badge badgeContent={4} color='error'>
                            <FavoriteBorderRoundedIcon />
                        </Badge>
                    </IconButton>
                    <IconButton size='large'>
                        <PersonOutlineRoundedIcon />
                    </IconButton>
                </div>
                <IconButton size='large' onClick={handleMenuClick}>
                    <MenuRoundedIcon />
                </IconButton>
            </div>
            {/* Top bar for mobile */}
            <div className='fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-between bg-white px-6 shadow md:hidden'>
                <img src='/threads.png' alt='' className='h-10 w-10' />
                <IconButton size='large' onClick={handleMenuClick}>
                    <MenuRoundedIcon />
                </IconButton>
            </div>
            {/* Bottom bar for mobile */}
            <div className='fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-white px-6 shadow md:hidden'>
                <div className='flex w-full items-center justify-center gap-2'>
                    <IconButton size='large'>
                        <HomeOutlinedIcon />
                    </IconButton>
                    <IconButton size='large'>
                        <SearchRoundedIcon />
                    </IconButton>
                    <IconButton size='large'>
                        <AddRoundedIcon />
                    </IconButton>
                    <IconButton size='large'>
                        <Badge badgeContent={4} color='error'>
                            <FavoriteBorderRoundedIcon />
                        </Badge>
                    </IconButton>
                    <IconButton size='large'>
                        <PersonOutlineRoundedIcon />
                    </IconButton>
                </div>
            </div>
            {renderMenu}
        </>
    );
};

export default Header;

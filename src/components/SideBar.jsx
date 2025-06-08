import { HomeOutlined, Hub, Lock, Message, People, Translate } from '@mui/icons-material';
import { Drawer, List, ListSubheader } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDrawer } from '@redux/slices/settingSlices';
import { useDetectLayout } from '@hooks/index';
const ListStyled = styled(List)`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 1rem;
    gap: 1rem;
`;

const SideBarContent = () => {
    return (
        <div className='flex w-64 flex-col gap-4'>
            <ListStyled>
                <Link to='/' className='flex items-center gap-1'>
                    <HomeOutlined fontSize='small' /> New Feeds
                </Link>
                <Link to='/messengers' className='flex items-center gap-1'>
                    <Message fontSize='small' />
                    Messenger
                </Link>
                <Link to='/friends' className='flex items-center gap-1'>
                    <People fontSize='small' /> Friends
                </Link>
                <Link to='/groups' className='flex items-center gap-1'>
                    <Hub fontSize='small' /> Groups
                </Link>
            </ListStyled>
            <ListStyled>
                <ListSubheader className='mb-2 !px-0 !leading-none'>
                    Settings
                </ListSubheader>
                <Link to='/setting/account' className='flex items-center gap-1'>
                    <Lock />
                    Account
                </Link>
                <Link to='/setting/languages' className='flex items-center gap-1'>
                    <Translate />
                    Languages
                </Link>
            </ListStyled>
        </div>
    );
};

const SideBar = () => {
    const { isMediumLayout } = useDetectLayout();
    const isShowDrawer = useSelector((state) => state.settings.isShowDrawer);
    const dispatch = useDispatch();

    return (
        <>
            {isMediumLayout ? (
                <Drawer
                    open={isShowDrawer}
                    classes={{ paper: 'p-4 flex flex-col gap-4 !bg-dark-200' }}
                    onClose={() => dispatch(toggleDrawer())}
                >
                    <div>
                        <Link to='/'>
                            <img src='/threads.png' className='h-8 w-8' />
                        </Link>
                    </div>
                    <SideBarContent />
                </Drawer>
            ) : (
                <SideBarContent />
            )}
        </>
    );
};

export default SideBar;

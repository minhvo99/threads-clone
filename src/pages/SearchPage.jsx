import Loading from '@components/Loading';
import UserCard from '@components/UserCard';
import { useUserInfor } from '@hooks/index';
import { useSearchUsersQuery } from '@services/rootApi';
import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchPage = () => {
    const location = useLocation();
    const { _id } = useUserInfor();
    const { data, isFetching } = useSearchUsersQuery({
        limit: 10,
        offset: 0,
        searchTerm: location.state?.searchTerm || '',
    });
    return (
        <div className='container flex-col'>
            {/* <p className='text-xl font-bold'>search page</p> */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {(data?.users || []).map((user) => (
                    <UserCard
                        key={user._id}
                        userInfo={user}
                        isFriend={user.isFriend}
                        requestSent={user?.requestSent}
                        requestReceived={user?.requestReceived}
                        id={user._id}
                    />
                ))}
            </div>
            {isFetching && <Loading />}
        </div>
    );
};

export default SearchPage;

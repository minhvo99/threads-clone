import FriendRequest from '@components/FriendRequest';
import PostCreation from '@components/PostCreation';
import PostList from '@components/PostList';
import SideBar from '@components/SideBar';

const WeconnectPage = () => {
    <div className='container'>
        <div className='flex flex-1 flex-col gap-4'>
            <PostCreation />
            <PostList />
        </div>
        <div className='hidden w-72 md:block'>{<FriendRequest />}</div>
    </div>;
};

export default WeconnectPage;

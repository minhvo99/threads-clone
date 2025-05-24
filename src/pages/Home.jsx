import FriendRequest from '@components/FriendRequest';
import PostCreation from '@components/PostCreation';
import PostList from '@components/PostList';
import SideBar from '@components/SideBar';

const Home = () => {
    return (
        <div className='bg-dark-200 flex gap-4 p-6'>
            <SideBar />
            <div className='flex flex-1 flex-col gap-4'>
                <PostCreation />
                <PostList />
            </div>
            <div className='hidden w-64 md:block'>
                <FriendRequest />
            </div>
        </div>
    );
};

export default Home;

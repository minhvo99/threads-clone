import Post from './Post';
import Loading from './Loading';
import { useLazyLoadPosts } from '@hooks/index';

const PostList = () => {
    const { hasMore, isFetching, posts } = useLazyLoadPosts();

    return (
        <div className='flex flex-col gap-4'>
            {(posts || []).map((post) => (
                <Post
                    key={post._id}
                    userInfo={post?.author}
                    createAt={post?.createAt}
                    content={post?.content}
                    image={post?.image}
                    comments={post?.comments}
                    likes={post?.likes}
                />
            ))}
            {isFetching && <Loading />}
            {!hasMore && (
                <p className='text-center text-gray-500'>Your are catching all !!!</p>
            )}
        </div>
    );
};

export default PostList;

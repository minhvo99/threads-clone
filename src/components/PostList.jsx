import Post from './Post';
import Loading from './Loading';
import { useLazyLoadPosts, useNotifications, useUserInfor } from '@hooks/index';
import {
    useCreateCommentMutation,
    useLikePostMutation,
    useUnLikePostMutation,
} from '@services/postAPI';

const PostList = () => {
    const { isFetching: isLazyLoad, posts } = useLazyLoadPosts();
    const [likePost] = useLikePostMutation();
    const [unLikePost] = useUnLikePostMutation();
    const { _id } = useUserInfor();
    const [createComment] = useCreateCommentMutation();
    const { createNotification } = useNotifications();

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
                    id={post._id}
                    author={_id}
                    onLike={async () => {
                        const res = await likePost(post._id).unwrap();
                        createNotification({
                            receiverUserId: post.author?._id,
                            postId: post._id,
                            notificationType: 'like',
                            notificationTypeId: res._id,
                        });
                    }}
                    onUnLike={() => {
                        unLikePost(post._id);
                    }}
                    isLiked={post.likes.some((like) => like?.author?._id === _id)}
                    onComment={async ({ postId, comment }) => {
                        const res = await createComment({ postId, comment }).unwrap();
                        createNotification({
                            receiverUserId: post.author?._id,
                            postId: post._id,
                            notificationType: 'comment',
                            notificationTypeId: res._id,
                        });
                    }}
                />
            ))}
            {isLazyLoad && <Loading />}
        </div>
    );
};

export default PostList;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Post from './Post';
import { useGetPostsQuery } from '@services/rootApi';
import Loading from './Loading';

const PostList = () => {
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [posts, setPosts] = useState([]);
    const { data, isFetching, isSuccess } = useGetPostsQuery({ limit, offset }); // chỉ gọi 1 lần sau đó cache lại trong redux, không gọi lại api nữa
    const [hasMore, setHasMore] = useState(true);
    const previousDataRef = useRef();

    useEffect(() => {
        if (isSuccess && data && previousDataRef.current !== data) {
            if (!data.length) {
                setHasMore(false); // Nếu không có dữ liệu mới, không cần tiếp tục lấy thêm
                return;
            }
            previousDataRef.current = data; //
            setPosts((prev) => [...prev, ...data]);
        }
    }, [isSuccess, data]);

    const handleScroll = useCallback(() => {
        if (!hasMore) return; // Nếu không còn dữ liệu hoặc đang lấy dữ liệu thì không làm gì cả
        const scrollTop = document.documentElement.scrollTop; //b
        const scrollHeight = document.documentElement.scrollHeight; //
        const clientHeight = document.documentElement.clientHeight; //c

        if (clientHeight + scrollTop + 50 >= scrollHeight && !isFetching) {
            // Kiểm tra nếu đã cuộn đến gần cuối trang và không đang trong quá trình lấy dữ liệu
            // Nếu đã cuộn đến gần cuối trang, tăng offset để lấy thêm dữ liệu
            setOffset((prev) => prev + limit);
        }
    }, [hasMore, isFetching, limit]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

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

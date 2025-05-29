import { createEntityAdapter } from '@reduxjs/toolkit';
import { rootApi } from './rootApi';

/**
 * Entity adapter giup quan ly du lieu o ngay trong redux va
 * no se giup chuan hoa du lieu theo dang:
 * {
 *  ids: ['id1', 'id2', ...],
 * entities: [{id: 1, content: '213'}, {id: 2, content: '123'}]
 * }
 * cung cấp các medthod để dễ dàng cập nhật, xoá, sửa dữ liệu mà đã được chuẩn hoá ơ phía trên
 * nó sẽ giúp chúng ta chuẩn hoá dữ liệu + tránh bị trùng lặp dữ liệu, và làm cho ứng dụng của chúng ta sẽ
 * lưu trữ dữ liệu tập trung, thay vì phải tạo ra các state như posts (useLazyLoadPost). luôn luôn chỉ có 1 nguồn
 * dữ liệu duy nhất hay còn gọi là single source of truth
 */
const postsAdapter = createEntityAdapter({
    selectId: (post) => post._id,
    sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
});

const initialState = postsAdapter.getInitialState(); // entities : []

export const postAPI = rootApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            createPost: builder.mutation({
                query: (formData) => {
                    return {
                        url: '/posts',
                        method: 'POST',
                        body: formData,
                    };
                },
                //optimistic update: this is a way to update the UI immediately without waiting for the server response
                onQueryStarted: async (args, { dispatch, queryFulfilled, getState }) => {
                    const store = getState(); //get the current state of the store
                    const tempId = crypto.randomUUID();
                    const newPost = {
                        _id: tempId,
                        likes: [],
                        comments: [],
                        content: args.get('content'),
                        author: {
                            notifications: [],
                            _id: store.auth.userInfor._id,
                            fullName: store.auth.userInfor.fullName,
                        },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        __v: 0,
                    };

                    const patchResult = dispatch(
                        rootApi.util.updateQueryData('getPosts', 'allPosts', (draft) => {
                            //draft: data catching in redux store
                            // draft.unshift(newPost);
                            postsAdapter.addOne(draft, newPost); //addOne: thêm 1 dữ liệu mới vào entity adapter
                        }),
                    );

                    try {
                        const { data } = await queryFulfilled; // promise that resolves when the query is fulfilled

                        dispatch(
                            rootApi.util.updateQueryData(
                                'getPosts',
                                'allPosts',
                                (draft) => {
                                    // const index = draft.findIndex(
                                    //     (post) => post._id === tempId,
                                    // );
                                    // if (index !== -1) {
                                    //     draft[index] = data;
                                    // }
                                    postsAdapter.removeOne(draft, tempId);
                                    postsAdapter.addOne(draft, data);
                                },
                            ),
                        );
                    } catch (err) {
                        console.log('failed to create new post', err);
                        patchResult.undo();
                    }
                },
                // invalidatesTags: ['POSTS'],
            }),
            getPosts: builder.query({
                query: ({ limit, offset } = {}) => {
                    return {
                        url: '/posts',
                        params: { limit, offset },
                    };
                },
                transformResponse: (response) => {
                    return postsAdapter.upsertMany(initialState, response); //upsertMany: đẩy dữ liệu mới vào entity adapter
                },
                serializeQueryArgs: () => 'allPosts',
                // merge: thực thi khi có dữ liệu mới từ server
                merge: (currentCache, newItems) => {
                    /**
                     *  gộp dữ liệu từ request trước đó + với dữ liệu mới sau này, nó luôn đảm bảo
                     * (entity adapter) dữ liệu sẽ không bị trùng lặp bởi vị đã có 1 hệ thống các ids duy nhất
                     */
                    return postsAdapter.upsertMany(currentCache, newItems.entities);
                },
                providesTags: [{ type: 'POSTS' }],
            }),
            getPostById: builder.query({
                query: (id) => `/posts/${id}`,
            }),
            likePost: builder.mutation({
                query: (postId) => {
                    return {
                        url: `/posts/${postId}/like`,
                        method: 'POST',
                    };
                },
                onQueryStarted: async (args, { dispatch, queryFulfilled, getState }) => {
                    const store = getState(); //get the current state of the store

                    const tempId = crypto.randomUUID();

                    const patchResult = dispatch(
                        rootApi.util.updateQueryData('getPosts', 'allPosts', (draft) => {
                            const currentpost = draft.entities[args];
                            if (currentpost) {
                                currentpost.likes.push({
                                    author: {
                                        _id: store.auth.userInfor._id,
                                        fullName: store.auth.userInfor.fullName,
                                    },
                                    _id: tempId,
                                });
                            }
                        }),
                    );
                    try {
                        const { data } = await queryFulfilled;
                        dispatch(
                            rootApi.util.updateQueryData(
                                'getPosts',
                                'allPosts',
                                (draft) => {
                                    const currentpost = draft.entities[args];
                                    if (currentpost) {
                                        currentpost.likes = currentpost.likes.map(
                                            (like) => {
                                                if (like._id === tempId) {
                                                    return {
                                                        author: {
                                                            _id: store.auth.userInfor._id,
                                                            fullName:
                                                                store.auth.userInfor
                                                                    .fullName,
                                                        },
                                                        createdAt: data.createdAt,
                                                        updatedAt: data.updatedAt,
                                                        _id: data.id,
                                                    };
                                                }
                                                return like;
                                            },
                                        );
                                    }
                                },
                            ),
                        );
                    } catch (error) {
                        patchResult.undo();
                        console.error('Failed to like post:', error);
                    }
                },
            }),
            unLikePost: builder.mutation({
                query: (postId) => {
                    return {
                        url: `/posts/${postId}/like`,
                        method: 'DELETE',
                    };
                },
                // eslint-disable-next-line no-unused-vars
                invalidatesTags: (result, error, args) => {
                    return [{ type: 'POSTS' }];
                },
            }),
            createComment: builder.mutation({
                query: ({ postId, comment }) => {
                    return {
                        url: `/posts/${postId}/comments`,
                        method: 'POST',
                        body: { comment },
                    };
                },
                onQueryStarted: async (args, { dispatch, queryFulfilled, getState }) => {
                    const store = getState(); //get the current state of the store
                    const tempId = crypto.randomUUID();
                    const newComment = {
                        _id: tempId,
                        comments: args.comment,
                        author: {
                            _id: store.auth.userInfor._id,
                            fullName: store.auth.userInfor.fullName,
                        },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    const patchResult = dispatch(
                        rootApi.util.updateQueryData('getPosts', 'allPosts', (draft) => {
                            //draft:dữ liệu đang được cachings
                            const currentPost = draft.entities[args.postId];
                            if (currentPost) {
                                currentPost.comments.push(newComment);
                            } //addOne: thêm 1 dữ liệu mới vào entity adapter
                        }),
                    );

                    try {
                        const { data } = await queryFulfilled; // promise that resolves when the query is fulfilled

                        dispatch(
                            rootApi.util.updateQueryData(
                                'getPosts',
                                'allPosts',
                                (draft) => {
                                    const currentPost = draft.entities[args.postId];
                                    if (currentPost) {
                                        const commentIndex =
                                            currentPost.comments.findIndex(
                                                (comment) => comment._id === tempId,
                                            );
                                        if (commentIndex !== -1) {
                                            currentPost.comments[commentIndex] = data;
                                        }
                                    }
                                },
                            ),
                        );
                    } catch (err) {
                        console.log('failed to create new post', err);
                        patchResult.undo();
                    }
                },
            }),
        };
    },
});

export const {
    useCreatePostMutation,
    useGetPostsQuery,
    useGetPostByIdQuery,
    useLikePostMutation,
    useUnLikePostMutation,
    useCreateCommentMutation,
} = postAPI;

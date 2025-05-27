import _ from 'lodash';
import { rootApi } from './rootApi';

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
                        rootApi.util.updateQueryData(
                            'getPosts',
                            { limit: 10, offset: 0 },
                            (draft) => {
                                //draft: data catching in redux store
                                draft.unshift(newPost);
                            },
                        ),
                    );

                    try {
                        const { data } = await queryFulfilled; // promise that resolves when the query is fulfilled
                        console.log({ data });
                        dispatch(
                            rootApi.util.updateQueryData(
                                'getPosts',
                                { limit: 10, offset: 0 },
                                (draft) => {
                                    const index = draft.findIndex(
                                        (post) => post._id === tempId,
                                    );
                                    if (index !== -1) {
                                        draft[index] = data;
                                    }
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
                    console.log('args', args);
                    const tempId = crypto.randomUUID();

                    const patchResult = dispatch(
                        rootApi.util.updateQueryData(
                            'getPosts',
                            { limit: 10, offset: 0 },
                            (draft) => {
                                const currentpost = draft.find(
                                    (post) => post._id === args,
                                );
                                if (currentpost) {
                                    currentpost.likes.push({
                                        author: {
                                            _id: store.auth.userInfor._id,
                                            fullName: store.auth.userInfor.fullName,
                                        },
                                        _id: tempId,
                                    });
                                }
                            },
                        ),
                    );
                    try {
                        const { data } = await queryFulfilled;
                        dispatch(
                            rootApi.util.updateQueryData(
                                'getPosts',
                                {
                                    limit: 10,
                                    offset: 0,
                                },
                                (draft) => {
                                    const currentpost = draft.find(
                                        (post) => post._id === args,
                                    );
                                    if (currentpost) {
                                        let currentLike = currentpost.likes.find(
                                            (like) => like._id === tempId,
                                        );

                                        if (currentLike) {
                                            currentLike = {
                                                author: {
                                                    _id: store.auth.userInfor._id,
                                                    fullName:
                                                        store.auth.userInfor.fullName,
                                                },
                                                createdAt: data.createdAt,
                                                updatedAt: data.updatedAt,
                                            };
                                        }
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
                        url: `/posts/${postId}/unlike`,
                        method: 'DELETE',
                    };
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
} = postAPI;

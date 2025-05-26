import { login, logOut } from '@redux/slices/authSlices';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    // api: getState() is used to access the current state of the store, dispatch() is used to dispatch actions
    // baseQuery: the original base query function that performs the actual HTTP request
    // extraOptions: used to pass additional options to the base query
    // args: the arguments passed to the query or mutation
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        if (result?.error?.data?.message === 'Token has expired.') {
            const refreshToken = api.getState().auth.refreshToken;
            if (refreshToken) {
                const refreshResult = await baseQuery(
                    {
                        url: '/refresh-token',
                        method: 'POST',
                        body: { refreshToken },
                    },
                    api,
                    extraOptions,
                );
                const newAccessToken = refreshResult?.data?.accessToken;

                if (newAccessToken) {
                    api.dispatch(
                        login({
                            accessToken: newAccessToken,
                            refreshToken,
                        }),
                    );
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(logOut());
                    window.location.href = '/login';
                }
            }
        } else {
            window.location.href = '/login';
        }
    }
    return result;
};

export const rootApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['POSTS', 'USERS', 'PEDDING_FRIEND-REQUEST'],
    endpoints: (builder) => {
        return {
            register: builder.mutation({
                query: ({ fullName, email, password }) => ({
                    url: '/signUp',
                    body: { fullName, email, password },
                    method: 'POST',
                }),
            }),
            login: builder.mutation({
                query: ({ email, password }) => ({
                    url: '/login',
                    body: { email, password },
                    method: 'POST',
                }),
            }),
            verifyOtp: builder.mutation({
                query: ({ email, otp }) => ({
                    url: '/verify-otp',
                    body: { email, otp },
                    method: 'POST',
                }),
            }),
            refreshToken: builder.mutation({
                query: (refreshToken) => ({
                    url: '/refresh-token',
                    method: 'POST',
                    body: { refreshToken },
                }),
            }),
            getAuthUser: builder.query({
                query: () => '/auth-user',
            }),
            createPost: builder.mutation({
                query: (formData) => ({
                    url: '/posts',
                    method: 'POST',
                    body: formData,
                }),
                invalidatesTags: ['POSTS'],
            }),
            getPosts: builder.query({
                query: ({ limits, offset } = {}) => {
                    return {
                        url: '/posts',
                        params: {
                            limits,
                            offset,
                        },
                    };
                },
                providesTags: ['POSTS'],
            }),
            getPostById: builder.query({
                query: (id) => `/posts/${id}`,
            }),
            searchUsers: builder.query({
                query: ({ limtis, offset, searchTerm }) => {
                    const encodedQuery = encodeURIComponent(searchTerm.trim());
                    return {
                        url: `/search/users/${encodedQuery}`,
                        params: {
                            limtis,
                            offset,
                        },
                        method: 'GET',
                    };
                },
                providesTags: (result) =>
                    result
                        ? [
                              ...result.users.map(({ _id }) => ({
                                  type: 'USERS',
                                  id: _id,
                              })),
                              { type: 'USERS', id: 'LIST' },
                          ]
                        : [{ type: 'USERS', id: 'LIST' }],
            }),
            sendFriendRequest: builder.mutation({
                query: (userId) => ({
                    url: '/friends/request',
                    method: 'POST',
                    body: { friendId: userId },
                }),
                invalidatesTags: (result, error, agrs) => [{ type: 'USERS', id: agrs }],
            }),
            getPeddingFriendRequests: builder.query({
                query: () => '/friends/pending',
                providesTags: (result) =>
                    result
                        ? [
                              ...result.map(({ _id }) => ({
                                  type: 'PEDDING_FRIEND-REQUEST',
                                  id: _id,
                              })),
                              { type: 'PEDDING_FRIEND-REQUEST', id: 'LIST' },
                          ]
                        : [{ type: 'PEDDING_FRIEND-REQUEST', id: 'LIST' }],
            }),
            acceptFriendRequest: builder.mutation({
                query: (userId) => ({
                    url: `/friends/accept`,
                    method: 'POST',
                    body: { friendId: userId },
                }),
                invalidatesTags: (result, error, agrs) => [
                    { type: 'USERS', id: agrs },
                    { type: 'PEDDING_FRIEND-REQUEST', id: agrs },
                ],
            }),
            cancelFriendRequest: builder.mutation({
                query: (userId) => ({
                    url: `/friends/cancel`,
                    method: 'POST',
                    body: { friendId: userId },
                }),
                invalidatesTags: (result, error, agrs) => [
                    { type: 'USERS', id: agrs },
                    { type: 'PEDDING_FRIEND-REQUEST', id: agrs },
                ],
            }),
            unfriend: builder.mutation({
                query: (userId) => ({
                    url: `/friends/unfriend`,
                    method: 'POST',
                    body: { friendId: userId },
                }),
                invalidatesTags: (result, error, agrs) => [
                    { type: 'USERS', id: agrs },
                    { type: 'PEDDING_FRIEND-REQUEST', id: agrs },
                ],
            }),
        };
    },
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useVerifyOtpMutation,
    useGetAuthUserQuery,
    useCreatePostMutation,
    useRefreshTokenMutation,
    useGetPostsQuery,
    useGetPostByIdQuery,
    useSearchUsersQuery,
    useSendFriendRequestMutation,
    useGetPeddingFriendRequestsQuery,
    useAcceptFriendRequestMutation,
    useCancelFriendRequestMutation,
    useUnfriendMutation,
} = rootApi;

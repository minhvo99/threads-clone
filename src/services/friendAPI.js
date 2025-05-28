import { rootApi } from './rootApi';

export const friendAPI = rootApi.injectEndpoints({
    endpoints: (builder) => {
        return {
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
                // keepUnusedDataFor: 30,
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
    useSendFriendRequestMutation,
    useGetPeddingFriendRequestsQuery,
    useAcceptFriendRequestMutation,
    useCancelFriendRequestMutation,
    useUnfriendMutation,
} = friendAPI;

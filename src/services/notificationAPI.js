import { rootApi } from './rootApi';

export const notificationAPI = rootApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            getNotifications: builder.query({
                query: () => '/notifications',
                // keepUnusedDataFor: 30,
                providesTags: (result) =>
                    result
                        ? [
                              ...result.notifications.map(({ _id }) => ({
                                  type: 'GET_NOTIFICATIONS',
                                  id: _id,
                              })),
                              { type: 'GET_NOTIFICATIONS', id: 'LIST' },
                          ]
                        : [{ type: 'GET_NOTIFICATIONS', id: 'LIST' }],
            }),
            createNotification: builder.mutation({
                query: ({ userId, postId, notificationType, notificationTypeId }) => {
                    return {
                        url: '/notifications/create',
                        method: 'POST',
                        body: {
                            userId,
                            postId,
                            notificationType,
                            notificationTypeId,
                        },
                    };
                },
            }),
            seenNotification: builder.mutation({
                query: (notificationId) => ({
                    url: `/notifications/seen`,
                    method: 'POST',
                    body: { notificationId },
                }),
                // invalidatesTags: (result, error, agrs) => [
                //     { type: 'GET_NOTIFICATIONS', id: agrs },
                // ],
            }),
        };
    },
});

export const {
    useGetNotificationsQuery,
    useCreateNotificationMutation,
    useSeenNotificationMutation,
} = notificationAPI;

import { rootApi } from './rootApi';

export const notificationAPI = rootApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            getNotifications: builder.query({
                query: ({ limit, offset }) => {
                    return {
                        url: '/notifications',
                        params: { limit, offset },
                    };
                },
                providesTags: [{ type: 'GET_NOTIFICATIONS' }],
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
                invalidatesTags: [{ type: 'GET_NOTIFICATIONS' }],
            }),
            seenNotification: builder.mutation({
                query: (notificationId) => ({
                    url: `/notifications/seen`,
                    method: 'PATCH',
                    body: { notificationId },
                }),
                invalidatesTags: [{ type: 'GET_NOTIFICATIONS' }],
            }),
        };
    },
});

export const {
    useGetNotificationsQuery,
    useCreateNotificationMutation,
    useSeenNotificationMutation,
} = notificationAPI;

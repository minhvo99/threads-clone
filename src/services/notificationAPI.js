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
        };
    },
});

export const { useGetNotificationsQuery, useCreateNotificationMutation } =
    notificationAPI;

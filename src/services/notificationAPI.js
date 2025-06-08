import { createEntityAdapter } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from './rootApi';

// Tạo entity adapter cho notifications
const notificationsAdapter = createEntityAdapter({
    selectId: (notification) => notification._id,
    sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
});

const initialState = notificationsAdapter.getInitialState({
    total: 0,
});

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
                transformResponse: (response) => {
                    return {
                        ...notificationsAdapter.upsertMany(
                            initialState,
                            response.notifications || [],
                        ),
                        total: response.total || 0,
                    };
                },
                serializeQueryArgs: () => 'allNotifications',
                merge: (currentCache, newItems) => {
                    return {
                        ...notificationsAdapter.upsertMany(
                            currentCache,
                            Object.values(newItems.entities),
                        ),
                        total: newItems.total,
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
            }),
            seenNotification: builder.mutation({
                query: (notificationId) => ({
                    url: `/notifications/seen`,
                    method: 'PATCH',
                    body: { notificationId },
                }),
                onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                    // Optimistic update
                    const patchResult = dispatch(
                        rootApi.util.updateQueryData(
                            'getNotifications',
                            'allNotifications',
                            (draft) => {
                                const notification = draft.entities[args];
                                if (notification) {
                                    notification.seen = true;
                                }
                            },
                        ),
                    );

                    try {
                        await queryFulfilled;
                    } catch (error) {
                        console.error('Failed to mark notification as seen:', error);
                        patchResult.undo();
                    }
                },
            }),
        };
    },
});

export const {
    useGetNotificationsQuery,
    useCreateNotificationMutation,
    useSeenNotificationMutation,
} = notificationAPI;

// Export selectors với memoization
export const selectNotificationsResult =
    notificationAPI.endpoints.getNotifications.select('allNotifications');

export const selectNotifications = createSelector(
    [selectNotificationsResult],
    (result) => {
        return result?.data
            ? notificationsAdapter.getSelectors().selectAll(result.data)
            : [];
    },
);

export const selectNotificationsTotal = createSelector(
    [selectNotificationsResult],
    (result) => {
        return result?.data?.total || 0;
    },
);

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

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log('baseQueryWithForceLogout', { result });

    if (result?.error?.status === 401) {
        if (result?.error?.data?.message === 'Token has expired.') {
            const refreshToken = api.getState().auth.refreshToken;

            if (refreshToken) {
                const refreshResult = await baseQuery(
                    {
                        url: '/refresh-token',
                        body: { refreshToken },
                        method: 'POST',
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
    baseQuery: baseQueryWithReauth,
    tagTypes: ['POSTS', 'USERS', 'PEDDING_FRIEND-REQUEST'],
    /* cach 1: 
        keepUnusedDataFor: 20, // sau 20s, nếu không có request nào thì sẽ xóa dữ liệu khỏi cache
        cach 2:
        refetchOnMountOrArgChange : true, // khi component mount lại hoặc khi tham số thay đổi thì sẽ refetch dữ liệu
        refetchOnMountOrArgChange: 10, // sau 10s, nếu không có request nào thì sẽ refetch dữ liệu
    */
    // refetchOnFocus: true, // khi tab được focus lại thì sẽ refetch dữ liệu,
    // refetchOnReconnect: true, // khi kết nối lại thì sẽ refetch dữ liệu
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
        };
    },
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useVerifyOtpMutation,
    useGetAuthUserQuery,
    useRefreshTokenMutation,
    useSearchUsersQuery,
} = rootApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rootApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
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
        };
    },
});

export const { useRegisterMutation, useLoginMutation } = rootApi;

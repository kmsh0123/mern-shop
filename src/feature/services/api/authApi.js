import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({baseUrl:
        import.meta.env.VITE_API_ENDPOINT
    }),
    tagTypes:["authApi"],

    endpoints:(builder) => ({
        register:builder.mutation({
            query:(user) => ({
                url : "register",
                method : "POST",
                body : user
            }),
            invalidatesTags:["authApi"],
        }),
        login:builder.mutation({
            query:(user) => ({
                url : "login",
                method : "POST",
                body : user,
            }),
            invalidatesTags:["authApi"],
        }),
        logout:builder.mutation({
            query:({user,token}) => ({
                url : "logout",
                method : "POST",
                body : user,
                headers: {authorization : `Bearer ${token}`}
            }),
            invalidatesTags:["authApi"],
        }),
        forgotPassword:builder.mutation({
            query:(user) => ({
                url : "forgot-password",
                method : "POST",
                body : user,
            }),
            invalidatesTags:["authApi"],
        }),
        resetPassword:builder.mutation({
            query:({user,token}) => ({
                url: 'reset-password',
                method: 'POST',
                body: {...user,token},
            }),
            invalidatesTags:["authApi"],
        }),
        changePassword:builder.mutation({
            query:({user,token}) => ({
                url: 'change-password',
                method: 'POST',
                body: user,
                headers: {authorization : `Bearer ${token}`}
            }),
            invalidatesTags:["authApi"],
        }),
        getProfile:builder.query({
            query:(token) => ({
                url: 'profile',
                method: 'GET',
                headers: {authorization : `Bearer ${token}`}
            }),
            invalidatesTags:["authApi"],
        }),
        
    })
})
export const {useRegisterMutation,useLoginMutation,useForgotPasswordMutation,useResetPasswordMutation,useGetProfileQuery,useChangePasswordMutation,useLogoutMutation} = authApi;
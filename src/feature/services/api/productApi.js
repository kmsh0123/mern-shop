import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const productApi = createApi({
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({baseUrl:
        import.meta.env.VITE_API_ENDPOINT
    }),
    tagTypes:["productApi"],

    endpoints:(builder) => ({
        createProduct:builder.mutation({
            query:({user,token}) => ({
                url : "create",
                method : "POST",
                body : user,
                headers: {authorization : `Bearer ${token}`}
            }),
            invalidatesTags:["productApi"],
        }),
        
    })
})
export const {useCreateProductMutation} = productApi;
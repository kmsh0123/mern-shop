import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '../services/api/authApi'
import authSlice from '../Slice/authSlice'
import { productApi } from '../services/api/productApi'

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        authSlice : authSlice
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware,productApi.middleware),
})
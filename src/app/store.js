import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import modalSlice from './slices/modalSlice'
import postSlice from './slices/postSlice'
import socketSlice from './slices/socketSlice'

export const store = configureStore({
    reducer: {
        modal: modalSlice,
        auth: authSlice,
        socket: socketSlice,
        post: postSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import modalSlice from './slices/modalSlice'
import socketSlice from './slices/socketSlice'

export const store = configureStore({
    reducer: {
        modal: modalSlice,
        auth: authSlice,
        socket: socketSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

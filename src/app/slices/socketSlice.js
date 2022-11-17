import { createSlice } from '@reduxjs/toolkit'
const initialState = { current: null }

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.current = action.payload.socket
        },
        clearSocket: (state) => {
            state.current = null
        },
    },
})

// Action creators are generated for each case reducer function
export const { setSocket,clearSocket } = socketSlice.actions

export default socketSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  create: false,
  comment: false,
  reload: false
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state) => {
      state.create = true
    },
    close: (state) => {
      state.create = false
    },
    openComment: (state)=>{
      state.comment = true
    },
    closeComment: (state)=>{
      state.comment = false
    },
    setReload:(state)=>{
      state.reload = !state.reload
    },
  }
})

// Action creators are generated for each case reducer function
export const { open, close,openComment,closeComment,setReload } = modalSlice.actions

export default modalSlice.reducer
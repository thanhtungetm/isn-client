import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  public: [],
  friend: [],
}

export const postSlice= createSlice({
  name: 'post',
  initialState,
  reducers: {
    updatePublicPostList: (state, action) => {
      state.public = action.payload
    },
    updateFriendPostList: (state, action) => {
      state.friend = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { updatePublicPostList,updateFriendPostList } = postSlice.actions

export default postSlice.reducer
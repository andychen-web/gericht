import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  adminToken: null
}

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.token = action.payload
    },
    setAdminToken: (state, action) => {
      state.adminToken = action.payload
    }
  }
})

export const { setUserToken, setAdminToken } = tokenSlice.actions
export default tokenSlice.reducer

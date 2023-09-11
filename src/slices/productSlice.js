import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  productArray: []
}
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.productArray = action.payload
    }
  }
})
export const { setProducts } = productSlice.actions
export default productSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartItems: [],
  cartUpdateCount: 0
}
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.cartItems = action.payload
    },
    setCartUpdate: (state, action) => {
      state.cartUpdateCount += action.payload
    },
    updateItemQuantity: (state, action) => {
      const { index, change } = action.payload
      state.cartItems[index].quantity += change
    }
  }
})
export const { updateItemQuantity, setItems, setCartUpdate } =
  cartSlice.actions
export default cartSlice.reducer

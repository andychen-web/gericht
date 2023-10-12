import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartItems: [],
  cartUpdateCount: 0,
  takeoutInfo: null,
  deliveryLocation: null
}
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload
    },
    setCartUpdate: (state, action) => {
      state.cartUpdateCount += action.payload
    },
    updateItemQuantity: (state, action) => {
      const { index, change } = action.payload
      state.cartItems[index].quantity += change
    },
    setTakeoutInfo: (state, action) => {
      state.takeoutInfo = action.payload
    },
    setDeliveryLocation: (state, action) => {
      state.deliveryLocation = action.payload
    }
  }
})
export const {
  updateItemQuantity,
  setCartItems,
  setCartUpdate,
  setTakeoutInfo,
  setDeliveryLocation
} = cartSlice.actions
export default cartSlice.reducer

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.cartItems = action.payload;
    },
    updateItemQuantity: (state, action) => {
      const { index, change } = action.payload;
      state.cartItems[index].quantity += change;
    },
  },
});
export const { updateItemQuantity, setItems } = cartSlice.actions;
export default cartSlice.reducer;

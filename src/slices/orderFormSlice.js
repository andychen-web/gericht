import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderFormValue: {
    email: "",
    name: "",
    address: "",
    mobile: "",
    message: "",
    paymentMethod: "",
  },
};

const orderFormSlice = createSlice({
  name: "orderForm",
  initialState,
  reducers: {
    setOrderForm: (state, action) => {
      state.orderFormValue = action.payload;
    },
  },
});

export const { setOrderForm } = orderFormSlice.actions;
export default orderFormSlice.reducer;

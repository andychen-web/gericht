import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orderFormValue: {
    email: '',
    name: '',
    address: '',
    mobile: '',
    message: '',
    paymentMethod: ''
  },
  completedOrders: []
}

const orderFormSlice = createSlice({
  name: 'orderForm',
  initialState,
  reducers: {
    setOrderForm: (state, action) => {
      state.orderFormValue = action.payload
    },
    setCompletedOrders: (state, action) => {
      state.completedOrders = action.payload
    }
  }
})

export const { setOrderForm, setCompletedOrders } = orderFormSlice.actions
export default orderFormSlice.reducer

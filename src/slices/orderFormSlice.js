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
  orderArray: []
}

const orderFormSlice = createSlice({
  name: 'orderForm',
  initialState,
  reducers: {
    setOrderForm: (state, action) => {
      state.orderFormValue = action.payload
    },
    setOrderArray: (state, action) => {
      state.orderArray = action.payload
    }
  }
})

export const { setOrderForm, setOrderArray } = orderFormSlice.actions
export default orderFormSlice.reducer

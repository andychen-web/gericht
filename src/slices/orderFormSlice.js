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
      let updatedOrder
      if (action.payload.legnth === 1) {
        updatedOrder = state.completedOrders.filter(
          (order) => order.id === action.payload.id
        )
        if (updatedOrder) {
          console.log(updatedOrder.current)
        }
      } else {
        state.completedOrders = action.payload
      }
    }
  }
})

export const { setOrderForm, setCompletedOrders } = orderFormSlice.actions
export default orderFormSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sum: 0,
  shippingFee: 0,
  total: 0
}

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    setSum: (state, action) => {
      state.sum = action.payload
    },
    setShippingFee: (state, action) => {
      state.shippingFee = action.payload
    },
    setTotal: (state) => {
      state.total = state.sum + state.shippingFee
    }
  }
})

export const { setTotal, setShippingFee, setSum } = priceSlice.actions
export default priceSlice.reducer

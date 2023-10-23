import { configureStore, combineReducers } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import priceReducer from './slices/priceSlice'
import productReducer from './slices/productSlice'
import orderFormReducer from './slices/orderFormSlice'
import tokenReducer from './slices/tokenSlice'
import userReducer from './slices/userSlice'
import favoritesReducer from './slices/favoritesSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore, createMigrate } from 'redux-persist'
const migrations = {
  2: (state) => {
    return {
      ...state,
      orderForm: {
        ...state.orderForm,
        completedOrders: []
      }
    }
  }
}
const persistConfig = {
  key: 'root',
  version: 2,
  storage,
  migrate: createMigrate(migrations)
}
const reducer = combineReducers({
  cart: cartReducer,
  price: priceReducer,
  orderForm: orderFormReducer,
  product: productReducer,
  token: tokenReducer,
  favorite: favoritesReducer,
  user: userReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
export const persistor = persistStore(store)

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import priceReducer from "./slices/priceSlice";
import orderFormReducer from "./slices/orderFormSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const reducer = combineReducers({
  cart: cartReducer,
  price: priceReducer,
  orderForm: orderFormReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: customizedMiddleware,
});

import { configureStore } from "@reduxjs/toolkit"
import ordersReducer from "./slices/ordersSlice"
import sharedReducer from "./slices/sharedSlice"
import documentsReducer from "./slices/documentsSlice"
import uiReducer from "./slices/uiSlice"
import authReducer from "./slices/authSlice"

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      orders: ordersReducer,
      shared: sharedReducer,
      documents: documentsReducer,
      ui: uiReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

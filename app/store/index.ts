import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import { ordersApi } from "./api/ordersApi"
import { authApi } from "./api/authApi"
import { propertyReportApi } from "./api/propertyReportApi"

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [ordersApi.reducerPath]: ordersApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [propertyReportApi.reducerPath]: propertyReportApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        ordersApi.middleware,
        authApi.middleware,
        propertyReportApi.middleware,
      ),
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

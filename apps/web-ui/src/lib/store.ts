import { configureStore } from '@reduxjs/toolkit';
import { openWhispererApi } from "@open-whisperer/rtk-query";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [openWhispererApi.reducerPath]: openWhispererApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(openWhispererApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

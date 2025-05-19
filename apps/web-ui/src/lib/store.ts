import { configureStore } from '@reduxjs/toolkit';
import { openWhispererApi } from "@open-whisperer/rtk-query";
import { useDispatch, useSelector, useStore } from 'react-redux';

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

// Typed hooks to use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

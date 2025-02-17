import { configureStore } from '@reduxjs/toolkit'
import useReducer from './userSlice'

export const store = configureStore({
  reducer: {
    user : useReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false, // Allow non-serializable data
    }),
})
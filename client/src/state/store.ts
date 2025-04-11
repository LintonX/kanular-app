import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../features/api/base-api';
import userSessionReducer from '../features/slice/userSession/userSessionSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    userSession: userSessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch; 
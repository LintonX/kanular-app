import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../features/api/base-api';
import userSessionReducer from '../features/slice/userSession/userSessionSlice';
import userSidebarReducer from '../features/slice/userSidebar/userSidebarSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    userSession: userSessionReducer,
    userSidebar: userSidebarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch; 
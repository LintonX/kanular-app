import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ['HomeBoard', 'PrimaryBoards', 'ActiveBoard'],
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: "include",
  }),
  endpoints: () => ({}),
});




// baseUrl: import.meta.env.MODE ==='production' ? import.meta.env.VITE_SERVER_URL_PROD : import.meta.env.VITE_SERVER_URL_DEV ,
// credentials: import.meta.env.MODE ==='production' ? "include" : "omit",
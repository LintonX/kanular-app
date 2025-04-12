import { baseApi } from "./base-api";

// builder.operation<Return Shape, Input Shape> (......)

const boardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    hydrateDashboard: builder.query<unknown, void>({
      query: () => ({
        url: "/v1/hydrateDashboard",
        method: "GET",
      }),
    }),
  }),
});

export const { useHydrateDashboardQuery } = boardApi;

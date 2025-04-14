import { HomeAndPrimaryBoards, KanbanCard } from "@/lib/types";
import { baseApi } from "./base-api";

// builder.operation<Return Shape, Input Shape> (......)

const boardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    hydrateDashboard: builder.query<HomeAndPrimaryBoards, void>({
      query: () => ({
        url: "/v1/hydrateDashboard",
        method: "GET",
      }),
    }),
    updateCardBody: builder.mutation<KanbanCard, { cardId: string; bodyValue: string }>({
      query: ({ cardId, bodyValue }) => ({
        url: "/v1/updateCardBody",
        method: "POST",
        body: { cardId: cardId, body: bodyValue },
      }),
    }),
  }),
});

export const { useHydrateDashboardQuery, useUpdateCardBodyMutation } = boardApi;

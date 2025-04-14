import { CompleteKanbanBoard, KanbanBoard, KanbanCard } from "@/lib/types";
import { baseApi } from "./base-api";

// builder.operation<Return Shape, Input Shape> (......)

const boardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeBoard: builder.query<
      CompleteKanbanBoard,
      { isPrimary: boolean; isHome: boolean }
    >({
      query: ({ isPrimary, isHome }) => ({
        url: "/v1/getKanbanBoardByParentId",
        method: "GET",
        params: { isPrimary, isHome },
      }),
    }),
    hydrateDashboard: builder.query<KanbanBoard[], void>({
      query: () => ({
        url: "/v1/hydrateDashboard",
        method: "GET",
      }),
    }),
    getAllPrimaryBoards: builder.query<KanbanBoard[], void>({
      query: () => ({
        url: "/v1/getAllPrimaryBoards",
        method: "GET",
      }),
    }),
    updateCardBody: builder.mutation<
      KanbanCard,
      { cardId: string; bodyValue: string }
    >({
      query: ({ cardId, bodyValue }) => ({
        url: "/v1/updateCardBody",
        method: "POST",
        body: { cardId: cardId, body: bodyValue },
      }),
    }),
    createTask: builder.mutation<KanbanCard, KanbanCard>({
      query: (kanbanCard) => ({
        url: "/v1/createTask",
        method: "POST",
        body: kanbanCard,
      }),
    }),
    createNewPrimaryBoard: builder.mutation<void, string>({
      query: ( boardTitle ) => ({
        url: "/v1/createNewPrimaryKanbanBoard",
        method: "POST",
        body: boardTitle,
        headers: {
          'Content-Type': 'text/plain',
        }
      }),
    }),
  }),
});

export const {
  useGetHomeBoardQuery,
  useGetAllPrimaryBoardsQuery,
  useHydrateDashboardQuery,
  useUpdateCardBodyMutation,
  useCreateTaskMutation,
  useCreateNewPrimaryBoardMutation,
} = boardApi;

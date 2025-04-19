import { CompleteKanbanBoard, KanbanBoard, KanbanCard } from "@/lib/types";
import { baseApi } from "./base-api";

// builder.operation<Return Shape, Input Shape> (......)

const boardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeBoard: builder.query<CompleteKanbanBoard, { isPrimary: boolean; isHome: boolean }>({
      query: ({ isPrimary, isHome }) => ({
        url: "/v1/getKanbanBoardByParentId",
        method: "GET",
        params: { isPrimary, isHome },
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'HomeBoard' }, { type: 'ActiveBoard'}]
          : [],
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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id: boardId }) => ({ type: 'PrimaryBoards' as const, boardId })),
              { type: 'PrimaryBoards', id: 'LIST' },
            ]
          : [{ type: 'PrimaryBoards', id: 'LIST' }],
    }),
    updateCardBody: builder.mutation<KanbanCard, { cardId: string; bodyValue: string }>({
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
    deleteTask: builder.mutation<string, string>({
      query: (taskId) => ({
        url: "/v1/deleteTask",
        method: "DELETE",
        body: taskId,
        headers: {
          'Content-Type': 'text/plain',
        }
      }),
      // invalidatesTags: () => [{ type: 'ActiveBoard' }],
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
      invalidatesTags: () => [{ type: "PrimaryBoards", id: 'LIST' }],
    }),
    deleteBoard: builder.mutation<void, string>({
      query: ( boardId ) => ({
        url: "/v1/deleteBoard",
        method: "POST",
        body: boardId,
        headers: {
          'Content-Type': 'text/plain',
        }
      }),
      invalidatesTags: () => [{ type: 'PrimaryBoards', id: 'LIST' }],
    }),
    setNewFavorite: builder.mutation<void, string>({
      query: (boardId) => ({
        url: "/v1/setFavoriteBoard",
        method: "POST",
        body: boardId,
        headers: {
          'Content-Type': 'text/plain',
        },
      }),
      invalidatesTags: () => [{ type: 'PrimaryBoards', id: 'LIST'}, { type: 'HomeBoard'}]
    }),
  }),
});

export const {
  useGetHomeBoardQuery,
  useGetAllPrimaryBoardsQuery,
  useHydrateDashboardQuery,
  useUpdateCardBodyMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useCreateNewPrimaryBoardMutation,
  useDeleteBoardMutation, 
  useSetNewFavoriteMutation,
} = boardApi;

import { CompleteKanbanBoard, KanbanBoard, KanbanCard } from "@/lib/types";
import { baseApi } from "./base-api";

// builder.operation<Return Shape, Input Shape> (......)

const boardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeBoard: builder.query<CompleteKanbanBoard, { primaryBoard: boolean; homeBoard: boolean }>({
      query: ({ primaryBoard, homeBoard }) => ({
        url: "/v1/getKanbanBoardByParentId",
        method: "GET",
        params: { primaryBoard, homeBoard },
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
    getCompleteBoardById: builder.query<CompleteKanbanBoard, KanbanBoard>({
      query: ( {id: boardId, primaryBoard, homeBoard} ) => ({
        url: "/v1/getKanbanBoardById",
        method: "GET",
        params: { boardId, primaryBoard, homeBoard }
      }),
      // providesTags: (result) => [{type: 'PrimaryBoards', id: result?.kanbanBoard.id}]
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
  useLazyGetCompleteBoardByIdQuery,
  useHydrateDashboardQuery,
  useUpdateCardBodyMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useCreateNewPrimaryBoardMutation,
  useDeleteBoardMutation, 
  useSetNewFavoriteMutation,
} = boardApi;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CompleteKanbanBoard,
  KanbanBoard,
  KanbanCard,
  UserAccountDto,
  UserSessionState,
} from "@/lib/types";

const initialState: UserSessionState = {
  userAccount: {
    id: "",
    email: "",
  },
  isAuth: false,
  activeBoardId: "",
  primaryBoardsMetadata: [],
  viewedBoards: {} as Record<string, CompleteKanbanBoard>,
};

const userSessionSlice = createSlice({
  name: "userSession",
  initialState,
  reducers: {
    setUserSession: (state, action: PayloadAction<UserAccountDto>) => {
      state.userAccount = action.payload;
      state.isAuth = true;
    },
    setActiveBoard: (state, action: PayloadAction<CompleteKanbanBoard>) => {
      console.log('in setActiveBoard', action.payload);
      const { kanbanBoard } = action.payload;
      const { id } = kanbanBoard;
      if (id) {
        state.viewedBoards = {
          ...state.viewedBoards,
          [id]: action.payload,
        };
        state.activeBoardId = id;
      }
    },
    setAllPrimaryBoards: (state, action: PayloadAction<KanbanBoard[]>) => {
      const existingIds = new Set(
        state.primaryBoardsMetadata.map((board) => board.id)
      );
      const newBoards = action.payload.filter((board) => {
        return board.id && !existingIds.has(board.id);
      });
      state.primaryBoardsMetadata.push(...newBoards);
    },
    setViewedBoards: (state, action: PayloadAction<CompleteKanbanBoard>) => {
      console.log("in setViewedBoards", state.viewedBoards, action.payload);
      const {kanbanBoard} = action.payload;
      const newBoardId = kanbanBoard.id;
      if (!newBoardId || state.viewedBoards[newBoardId]) return;
      state.viewedBoards[newBoardId] = action.payload;
      console.log("after", state.viewedBoards);
    },
    lazyCreateTask: (state, action: PayloadAction<KanbanCard>) => {
      console.log("in create task reducer", action.payload);
      const completeActiveBoard = state.viewedBoards[state.activeBoardId];
      const { kanbanBoard, kanbanCards } = completeActiveBoard;
      const { id } = kanbanBoard;
      const updatedKanbanCards = [...kanbanCards, action.payload];
      if (id) {
        state.viewedBoards = {
          ...state.viewedBoards,
          [id]: {
            ...completeActiveBoard,
            kanbanCards: updatedKanbanCards,
          },
        };
      }
    },
    lazyDeleteTask: (state, action: PayloadAction<string>) => {
      console.log("in delete task reducer", action.payload);
      const completeActiveBoard = state.viewedBoards[state.activeBoardId];
      const { kanbanBoard, kanbanCards } = completeActiveBoard;
      const { id } = kanbanBoard;
      if (id) {
        const updatedKanbanCards = kanbanCards.filter(
          (card) => card.id !== action.payload
        );
        state.viewedBoards = {
          ...state.viewedBoards,
          [id]: {
            ...completeActiveBoard,
            kanbanCards: updatedKanbanCards,
          },
        };
      }
    },
    setLogOut: () => initialState,
  },
});

export const {
  setUserSession,
  setActiveBoard,
  setAllPrimaryBoards,
  setViewedBoards,
  setLogOut,
  lazyCreateTask,
  lazyDeleteTask,
} = userSessionSlice.actions;
export default userSessionSlice.reducer;
export const selectUserSession = (state: { userSession: UserSessionState }) =>
  state.userSession;

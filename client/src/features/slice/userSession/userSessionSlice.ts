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
  activeBoard: {
    kanbanBoard: {
      id: undefined,
      parentId: undefined,
      homeBoard: undefined,
      primaryBoard: undefined,
      title: undefined,
    },
    kanbanColumns: [],
    kanbanCards: [],
  },
  primaryBoardsMetadata: [],
  viewedBoards: [],
};

const userSessionSlice = createSlice({
  name: "userSession",
  initialState,
  reducers: {
    setUserSession: (state, action: PayloadAction<UserAccountDto>) => {
      state.userAccount = action.payload;
      state.isAuth = true;
    },
    setHomeBoard: (state, action: PayloadAction<CompleteKanbanBoard>) => {
      state.activeBoard = action.payload;
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
    lazyCreateTask: (state, action: PayloadAction<KanbanCard>) => {
      console.log("in create task slice", action.payload)
      state.activeBoard.kanbanCards = [...state.activeBoard.kanbanCards, action.payload]
    },
    lazyDeleteTask: (state, action: PayloadAction<string>) => {
      console.log("in delete task slice", action.payload)
      state.activeBoard.kanbanCards = state.activeBoard.kanbanCards.filter((card) => card.id !== action.payload)
    },
    setLogOut: () => initialState,
  },
});

export const { setUserSession, setHomeBoard, setAllPrimaryBoards, setLogOut, lazyCreateTask, lazyDeleteTask } =
  userSessionSlice.actions;
export default userSessionSlice.reducer;
export const selectUserSession = (state: { userSession: UserSessionState }) =>
  state.userSession;

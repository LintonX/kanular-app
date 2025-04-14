import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CompleteKanbanBoard,
  KanbanBoard,
  UserAccountDto,
  UserSessionState,
} from "@/lib/types";

const initialState: UserSessionState = {
  userAccount: {
    id: "",
    email: "",
  },
  isAuth: false,
  homeBoard: {
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
      state.homeBoard = action.payload;
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
    setLogOut: () => initialState,
  },
});

export const { setUserSession, setHomeBoard, setAllPrimaryBoards, setLogOut } =
  userSessionSlice.actions;
export default userSessionSlice.reducer;
export const selectUserSession = (state: { userSession: UserSessionState }) =>
  state.userSession;

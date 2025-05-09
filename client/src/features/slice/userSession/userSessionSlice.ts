import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CompleteKanbanBoard,
  KanbanBoard,
  KanbanCard,
  UserAccountDto,
  UserSessionState,
} from "@/lib/types";
import { BoardViewStack } from "@/lib/BoardViewStack";

const initialState: UserSessionState = {
  userAccount: {
    id: "",
    email: "",
  },
  isAuth: false,
  activeBoardStack: new BoardViewStack(),
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
        state.activeBoardStack.push(id);
      }
    },
    removeFromBoardStack: (state) => {
      console.log('in removeFromBoardStack reducer');
      state.activeBoardStack.pop();      
    },
    clearBoardStack: (state) => {
      console.log('in clearBoardStack reducer')
      state.activeBoardStack.clear();
    },
    setAllPrimaryBoards: (state, action: PayloadAction<KanbanBoard[]>) => {
      console.log('in setAllPrimaryBoards reducer')
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
      console.log("in lazyCreateTask reducer", action.payload);
      const activeBoardId = state.activeBoardStack.peek();
      if (!activeBoardId) return;
      const completeActiveBoard = state.viewedBoards[activeBoardId];
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
    lazyUpdateTaskHasChild: (state, action: PayloadAction<string>) => {
      const parentIdOfChildBoard = action.payload; // this is the parent (task) of the newly created child board
      const activeBoardId = state.activeBoardStack.peek();
      if (!activeBoardId) return;
      const board = state.viewedBoards[activeBoardId];
      if (!board) return;
      const card = board.kanbanCards.find(card => card.id === parentIdOfChildBoard);
      if (card) {
        card.hasChildBoard = true;
      }
    },
    lazyDeleteTask: (state, action: PayloadAction<string>) => {
      console.log("in lazyDeleteTask reducer", action.payload);
      const activeBoardId = state.activeBoardStack.peek();
      if (!activeBoardId) return;
      const completeActiveBoard = state.viewedBoards[activeBoardId];
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
    setLogOut: (state) => {
      state.activeBoardStack.clear();
      return initialState;
    },
  },
});

export const {
  setUserSession,
  setActiveBoard,
  removeFromBoardStack,
  clearBoardStack,
  setAllPrimaryBoards,
  setViewedBoards,
  setLogOut,
  lazyCreateTask,
  lazyUpdateTaskHasChild,
  lazyDeleteTask,
} = userSessionSlice.actions;
export default userSessionSlice.reducer;
export const selectUserSession = (state: { userSession: UserSessionState }) =>
  state.userSession;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeAndPrimaryBoards, UserAccountDto, UserSessionState } from '@/lib/types';

const initialState: UserSessionState = {
  userAccount: {
    id: '',
    email: ''
  },
  isAuth: false,
  homeAndPrimaryBoards: {
    homeBoard: {
      kanbanBoard: {
        id: undefined,
        parentId: undefined,
        homeBoard: undefined,
        primaryBoard: undefined,
        title: undefined
      },
      kanbanColumns: [],
      kanbanCards: []
    },
    primaryBoards: []
  }
};

const userSessionSlice = createSlice({
  name: 'userSession',
  initialState,
  reducers: {
    setUserSession: (state, action: PayloadAction<UserAccountDto>) => {
      console.log('attempting to set state')
      state.userAccount = action.payload;
      state.isAuth = true;
    },
    setLogOut: () => initialState,
    setHydrateDashboard: (state, action: PayloadAction<HomeAndPrimaryBoards>) => {
      const {homeBoard, primaryBoards} = action.payload;
      state.homeAndPrimaryBoards.homeBoard = homeBoard;
      state.homeAndPrimaryBoards.primaryBoards = primaryBoards;
    }
  },
});

export const { setUserSession, setLogOut, setHydrateDashboard} = userSessionSlice.actions;
export default userSessionSlice.reducer;
export const selectUserSession = (state: { userSession: UserSessionState }) => state.userSession;
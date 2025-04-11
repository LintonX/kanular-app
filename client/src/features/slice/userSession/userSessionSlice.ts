import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAccountDto, UserSessionState } from '@/lib/types';

const initialState: UserSessionState = {
  userAccount: {id: "", email: ""},
  isAuth: false
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
    setLogOut: (state) => {
      state.userAccount = {id: "", email: ""};
      state.isAuth = false;
    }
  },
});

export const { setUserSession, setLogOut} = userSessionSlice.actions;
export default userSessionSlice.reducer;
export const selectUserSession = (state: { userSession: UserSessionState }) => state.userSession;
import { createSlice } from '@reduxjs/toolkit';
// import { UserAccountDto } from '@/lib/types';

const initialState = {
  // userSession: null,
};

const userSessionSlice = createSlice({
  name: 'userSession',
  initialState,
  reducers: {
    // setUserSession: (state, action) => {
    //   state.userSession = action.payload;
    // },
  },
});

// export const { setUserSession, } = userSessionSlice.actions;
export default userSessionSlice.reducer;
// export const selectUserSession = (state: { userSession: UserAccountDto }) => state.userSession;
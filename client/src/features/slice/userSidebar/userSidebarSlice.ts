import { SIDEBAR_ITEMS } from "@/lib/constants";
import { SidebarItem, SidebarState } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: SidebarState = {
    selectedView: SIDEBAR_ITEMS[0],
    sidebarItems: SIDEBAR_ITEMS,
}

const userSidebarSlice = createSlice({
    name: 'userSidebar',
    initialState: initialState,
    reducers: {
        setSelectedView: (state, action: PayloadAction<SidebarItem>) => {
            state.selectedView = action.payload;
        },
        addSidebarItem: (state, action: PayloadAction<SidebarItem>) => {
            if (state.sidebarItems.includes(action.payload)) return;
            state.sidebarItems = [...state.sidebarItems, action.payload];
        },
    },
})

export const { setSelectedView, addSidebarItem } = userSidebarSlice.actions;
export default userSidebarSlice.reducer;
export const selectUserSidebar = (state: { userSidebar: SidebarState }) => state.userSidebar;
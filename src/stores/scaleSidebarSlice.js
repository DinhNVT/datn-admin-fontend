import { createSlice } from "@reduxjs/toolkit";

const scaleSidebarSlice = createSlice({
  name: "scale_sidebar",
  initialState: {
    status: false,
  },
  reducers: {
    smallClick: (state) => {
      state.status = true;
    },
    largeClick: (state) => {
      state.status = false;
    },
  },
});

export const { smallClick, largeClick } = scaleSidebarSlice.actions;

export default scaleSidebarSlice.reducer;

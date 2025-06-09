import { createSlice } from "@reduxjs/toolkit";

const editSlice = createSlice({
name: "edit",
initialState: {
    editingId: null,
},
reducers: {
    startEditing: (state, action) => {
        state.editingId = action.payload;
    },
    stopEditing: (state) => {
        state.editingId = null;
    },
},
});

export const { startEditing, stopEditing } = editSlice.actions;
export default editSlice.reducer;
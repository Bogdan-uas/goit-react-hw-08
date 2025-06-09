import { createSlice } from "@reduxjs/toolkit";

const editSlice = createSlice({
name: "edit",
initialState: {
    isEditingGlobal: false,
    editingId: null,
},
reducers: {
    startEditing: (state, action) => {
        state.isEditingGlobal = true;
        state.editingId = action.payload;
    },
    stopEditing: (state) => {
        state.isEditingGlobal = false;
        state.editingId = null;
    },
},
});

export const { startEditing, stopEditing } = editSlice.actions;
export default editSlice.reducer;
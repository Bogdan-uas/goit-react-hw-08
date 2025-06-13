import { createSlice } from "@reduxjs/toolkit";

const editSlice = createSlice({
name: "edit",
initialState: {
    isEditingGlobal: false,
    editingId: null,
    hasUnsavedChanges: false,
},
reducers: {
    startEditing: (state, action) => {
        state.isEditingGlobal = true;
        state.editingId = action.payload;
    },
    setUnsavedChanges: (state, action) => {
        state.hasUnsavedChanges = action.payload;
    },
    stopEditing: (state) => {
        state.isEditingGlobal = false;
        state.editingId = null;
    },
},
});

export const { startEditing, stopEditing, setUnsavedChanges } = editSlice.actions;
export default editSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditState {
    isEditingGlobal: boolean;
    editingId: string | null;
    hasUnsavedChanges: boolean;
}

const initialState: EditState = {
    isEditingGlobal: false,
    editingId: null,
    hasUnsavedChanges: false,
};

const editSlice = createSlice({
name: "edit",
initialState,
reducers: {
    startEditing: (state, action: PayloadAction<string>) => {
        state.isEditingGlobal = true;
        state.editingId = action.payload;
    },
    setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
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
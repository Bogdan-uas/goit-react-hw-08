import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationsState {
    enabled: boolean;
}

const initialState: NotificationsState = {
    enabled: true,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications(state, action: PayloadAction<boolean>) {
            state.enabled = action.payload;
        },
        toggleNotifications(state) {
            state.enabled = !state.enabled;
        },
    },
});

export const { setNotifications, toggleNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
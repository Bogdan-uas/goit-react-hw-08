import { RootState } from "../store";

export const selectIsModalOpen = (state: RootState): boolean => state.modal.isModalOpen;
export const selectIsEditingGlobal = (state: RootState): boolean => state.edit.isEditingGlobal;
export const selectEditingId = (state: RootState): string | null => state.edit.editingId;
export const selectModal = (state: RootState): any => state.modal.modal;
export const selectDarkMode = (state: RootState): boolean => state.theme.darkMode;
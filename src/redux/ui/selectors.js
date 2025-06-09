export const selectIsModalOpen = (state) => state.modal.isModalOpen;
export const selectEditingId = (state) => state.edit.editingId;
export const selectIsEditingGlobal = (state) => state.edit.editingId !== null;
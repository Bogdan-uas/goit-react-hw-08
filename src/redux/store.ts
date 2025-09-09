import { configureStore, Reducer } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { contactsReducer } from "./contacts/slice";
import { filtersReducer } from "./filters/slice";
import { authReducer } from "./auth/slice";
import modalReducer from "./ui/modalSlice";
import editReducer from "./ui/editSlice";
import themeReducer from "./ui/themeSlice";
import notificationsReducer from "./ui/notificationsSlice";

import type { PersistPartial } from "redux-persist/es/persistReducer";

interface AuthState {
    user: any;
    token: string | null;
    isLoggedIn: boolean;
    isRefreshing: boolean;
}

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["token"],
};

const persistedAuthReducer: Reducer<AuthState & PersistPartial> = persistReducer(
    authPersistConfig,
    authReducer
);

const notificationsPersistConfig = {
    key: "notifications",
    storage,
};

const persistedNotificationsReducer = persistReducer(
    notificationsPersistConfig,
    notificationsReducer
);

export const store = configureStore({
    reducer: {
        phonebook: contactsReducer,
        filters: filtersReducer,
        auth: persistedAuthReducer,
        modal: modalReducer,
        edit: editReducer,
        theme: themeReducer,
        notifications: persistedNotificationsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
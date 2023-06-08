import { combineReducers, configureStore } from "@reduxjs/toolkit";
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

import authReducer from "./authSlice";
import storage from "redux-persist/lib/storage";
import scaleSidebarSlice from "./scaleSidebarSlice";
const persistConfig = {
  key: "root",
  version: 3,
  storage,
  blacklist: ["scale_sidebar"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  scale_sidebar: scaleSidebarSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);

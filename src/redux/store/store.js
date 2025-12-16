import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../reducer/authReducer/AuthReducer";
import userReducer from "../reducer/userManagementReducer/UserManagementReducer"
import topicReducer from "../reducer/topicsReducer/TopicsReducer"

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "permissions", "isAuthenticated"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  topics: topicReducer,
  user: userReducer,
});

export const store = configureStore({   
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // serializableCheck: false,
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
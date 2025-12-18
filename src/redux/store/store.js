import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../reducer/authReducer/AuthReducer";
import userReducer from "../reducer/userManagementReducer/UserManagementReducer";
import topicReducer from "../reducer/topicsReducer/TopicsReducer";
import doctorPointerReducer from "../reducer/doctorReducer/DoctorReducer"

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "permissions", "isAuthenticated"],
};

// const topicPersistConfig = {
//   key: "topics",
//   storage
// }

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  topics: topicReducer,
  // topics: persistReducer(topicPersistConfig, topicReducer),
  user: userReducer,
  doctor_pointers: doctorPointerReducer,
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
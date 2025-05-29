import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSlice";
import cartReducer from "../cartSlice";
import searchReducer from '../searchSlice'
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart","search"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  search:searchReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

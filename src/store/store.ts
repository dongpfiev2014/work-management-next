import authReducer from "@/reducer/authReducer";
import profileReducer from "@/reducer/profileReducer";
import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
    },
    devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in development mode
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";

export const rootReducer = combineReducers({
  user: userReducer,
});

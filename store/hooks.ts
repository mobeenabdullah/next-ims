import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppStore, AppState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppStore = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

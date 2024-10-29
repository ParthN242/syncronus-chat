import { create } from "zustand";
import { createAuthSlice } from "./slice/authSlice";
import { createContactSlice } from "./slice/contactSlice.js";

export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
  ...createContactSlice(...a),
}));

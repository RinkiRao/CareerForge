import { createContext, useContext } from "react";

export const ProfileContext = createContext(null);

export function useCentralProfile() {
  return useContext(ProfileContext)?.profile || null;
}

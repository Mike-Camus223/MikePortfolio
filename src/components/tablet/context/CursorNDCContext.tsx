import { createContext, useContext } from "react";
 
export type CursorNDC = { x: number; y: number } | null;
 
export const CursorNDCContext = createContext<CursorNDC>(null);
 
export function useCursorNDC() {
  return useContext(CursorNDCContext);
}



















































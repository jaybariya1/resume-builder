import { createContext, useContext } from "react";

/**
 * ScrollContext
 *
 * Provides the auto-scroll callbacks from the editor's scroll container
 * down to any step component that needs them for drag-and-drop.
 */
export const ScrollContext = createContext({
  startAutoScroll: () => {},
  stopAutoScroll:  () => {},
  updatePointer:   () => {},
});

export const useScrollContext = () => useContext(ScrollContext);

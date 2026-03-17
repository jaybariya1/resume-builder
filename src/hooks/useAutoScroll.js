import { useRef, useCallback, useEffect } from "react";

/**
 * useAutoScroll
 *
 * Attaches to a scrollable container ref. While a drag is in progress,
 * moving the pointer near the top/bottom edges auto-scrolls the container.
 *
 * Usage:
 *   const { scrollRef, startAutoScroll, stopAutoScroll } = useAutoScroll();
 *
 *   <div ref={scrollRef} ...>          ← the scrollable container
 *     <div
 *       onDragOver={e => { startAutoScroll(e); ... }}
 *       onDragEnd={() => stopAutoScroll()}
 *       onDrop={() => stopAutoScroll()}
 *     >
 *
 * Options:
 *   edgeSize  – px from edge that triggers scroll (default 80)
 *   speed     – max px per frame (default 14)
 */
export function useAutoScroll({ edgeSize = 80, speed = 14 } = {}) {
  const scrollRef  = useRef(null);
  const rafId      = useRef(null);
  const pointerY   = useRef(0);
  const active     = useRef(false);

  const tick = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !active.current) return;

    const rect  = el.getBoundingClientRect();
    const y     = pointerY.current;
    const relY  = y - rect.top;           // pointer position relative to container top
    const h     = rect.height;

    let delta = 0;

    if (relY < edgeSize) {
      // Near top — scroll up, faster the closer to the edge
      delta = -speed * (1 - relY / edgeSize);
    } else if (relY > h - edgeSize) {
      // Near bottom — scroll down
      delta = speed * (1 - (h - relY) / edgeSize);
    }

    if (delta !== 0) {
      el.scrollTop += delta;
    }

    rafId.current = requestAnimationFrame(tick);
  }, [edgeSize, speed]);

  const startAutoScroll = useCallback((e) => {
    pointerY.current = e.clientY;
    if (!active.current) {
      active.current = true;
      rafId.current  = requestAnimationFrame(tick);
    }
  }, [tick]);

  // Also expose a way to update pointer position mid-drag
  const updatePointer = useCallback((e) => {
    pointerY.current = e.clientY;
  }, []);

  const stopAutoScroll = useCallback(() => {
    active.current = false;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  // Clean up on unmount
  useEffect(() => () => stopAutoScroll(), [stopAutoScroll]);

  return { scrollRef, startAutoScroll, updatePointer, stopAutoScroll };
}

import { useState, useRef, useCallback } from "react";

/**
 * useDragSort — HTML5 drag-and-drop list reordering hook
 *
 * @param {Array}    items           - current ordered array
 * @param {Function} onReorder       - called with reordered array
 * @param {Object}   collapseOptions - optional { collapsed, setCollapsed, getId }
 * @param {Object}   scrollOptions   - optional { startAutoScroll, stopAutoScroll, updatePointer }
 *
 * Collapse behaviour:
 *   onDragStart — saves pre-drag collapse state, collapses the dragged item
 *   onDrop/End  — restores every item's pre-drag collapse state
 *
 * Auto-scroll behaviour:
 *   onDragOver  — calls startAutoScroll(e) + updatePointer(e)
 *   onDragEnd   — calls stopAutoScroll()
 *   onDrop      — calls stopAutoScroll()
 */
export function useDragSort(items, onReorder, collapseOptions = null, scrollOptions = null) {
  const dragIndex    = useRef(null);
  const preDragState = useRef(null);
  const [overIndex, setOverIndex] = useState(null);

  const getDragProps = useCallback(
    (index) => ({
      draggable: true,

      onDragStart: (e) => {
        dragIndex.current = index;
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.style.opacity = "0.4";

        if (collapseOptions) {
          const { collapsed, setCollapsed, getId } = collapseOptions;
          preDragState.current = { ...collapsed };
          const itemId = getId(items[index]);
          setCollapsed(prev => ({ ...prev, [itemId]: true }));
        }
      },

      onDragEnd: (e) => {
        e.currentTarget.style.opacity = "";
        dragIndex.current = null;
        setOverIndex(null);
        scrollOptions?.stopAutoScroll();
        if (collapseOptions && preDragState.current !== null) {
          collapseOptions.setCollapsed(preDragState.current);
          preDragState.current = null;
        }
      },

      onDragOver: (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        scrollOptions?.startAutoScroll(e);
        scrollOptions?.updatePointer(e);
        if (dragIndex.current !== null && dragIndex.current !== index) {
          setOverIndex(index);
        }
      },

      onDragLeave: () => setOverIndex(null),

      onDrop: (e) => {
        e.preventDefault();
        scrollOptions?.stopAutoScroll();
        const from = dragIndex.current;
        const to   = index;
        if (from === null || from === to) { setOverIndex(null); return; }
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onReorder(next);
        dragIndex.current = null;
        setOverIndex(null);
        if (collapseOptions && preDragState.current !== null) {
          collapseOptions.setCollapsed(preDragState.current);
          preDragState.current = null;
        }
      },
    }),
    [items, onReorder, collapseOptions, scrollOptions]
  );

  return { getDragProps, overIndex };
}

import { useEffect, useCallback, useRef } from "react";
import { Table, RowData } from "@tanstack/react-table";
import { Virtualizer } from "@tanstack/react-virtual";
import { EditableCell } from "./useEditableCell";

export interface SelectedCell {
  rowIndex: number;
  columnId: string;
}

export interface UseKeyboardNavigationOptions<TData extends RowData> {
  table: Table<TData>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  selectedCell: SelectedCell | null;
  editableCell: EditableCell | null;
  setSelectedCell: (cell: SelectedCell | null) => void;
  setEditableCell: (cell: EditableCell | null) => void;
  readonly?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedCellElementRef: React.RefObject<HTMLTableCellElement | null>;
}

export function useKeyboardNavigation<TData extends RowData>({
  table,
  rowVirtualizer,
  selectedCell,
  editableCell,
  setSelectedCell,
  setEditableCell,
  readonly = false,
  containerRef,
  selectedCellElementRef,
}: UseKeyboardNavigationOptions<TData>) {
  const isNavigatingRef = useRef(false);

  // Get all visible columns (excluding row header)
  const getVisibleColumns = useCallback(() => {
    return table.getAllColumns().filter((col) => col.id !== "__rowHeader");
  }, [table]);

  // Get all rows
  const getTotalRows = useCallback(() => {
    return table.getRowModel().rows.length;
  }, [table]);

  // Navigate to a specific cell
  const navigateToCell = useCallback(
    (rowIndex: number, columnId: string) => {
      if (readonly && editableCell) return; // Don't navigate while editing in readonly mode

      const totalRows = getTotalRows();
      const columns = getVisibleColumns();

      // Clamp row index
      const clampedRowIndex = Math.max(0, Math.min(rowIndex, totalRows - 1));
      
      // Find column index
      const columnIndex = columns.findIndex((col) => col.id === columnId);
      if (columnIndex === -1 && columns.length > 0) {
        // If column not found, use first column
        columnId = columns[0].id;
      }

      // Exit edit mode when navigating
      if (editableCell) {
        setEditableCell(null);
      }

      // Set new selected cell
      setSelectedCell({ rowIndex: clampedRowIndex, columnId });

      // Scroll to row if needed
      if (clampedRowIndex >= 0 && clampedRowIndex < totalRows) {
        rowVirtualizer.scrollToIndex(clampedRowIndex, {
          align: "auto",
        });
      }

      isNavigatingRef.current = true;
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
    },
    [
      table,
      rowVirtualizer,
      readonly,
      editableCell,
      setSelectedCell,
      setEditableCell,
      getTotalRows,
      getVisibleColumns,
    ]
  );

  // Handle arrow key navigation
  const handleArrowKey = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!selectedCell) return;

      const columns = getVisibleColumns();
      if (columns.length === 0) return;

      const currentColumnIndex = columns.findIndex(
        (col) => col.id === selectedCell.columnId
      );
      const currentRowIndex = selectedCell.rowIndex;
      const totalRows = getTotalRows();

      let newRowIndex = currentRowIndex;
      let newColumnId = selectedCell.columnId;

      switch (direction) {
        case "up":
          newRowIndex = Math.max(0, currentRowIndex - 1);
          break;
        case "down":
          newRowIndex = Math.min(totalRows - 1, currentRowIndex + 1);
          break;
        case "left":
          if (currentColumnIndex > 0) {
            newColumnId = columns[currentColumnIndex - 1].id;
          }
          break;
        case "right":
          if (currentColumnIndex < columns.length - 1) {
            newColumnId = columns[currentColumnIndex + 1].id;
          }
          break;
      }

      navigateToCell(newRowIndex, newColumnId);
    },
    [selectedCell, navigateToCell, getVisibleColumns, getTotalRows]
  );

  // Handle Tab navigation
  const handleTab = useCallback(
    (shift: boolean) => {
      if (!selectedCell) return;

      const columns = getVisibleColumns();
      if (columns.length === 0) return;

      const currentColumnIndex = columns.findIndex(
        (col) => col.id === selectedCell.columnId
      );
      const currentRowIndex = selectedCell.rowIndex;
      const totalRows = getTotalRows();

      let newRowIndex = currentRowIndex;
      let newColumnIndex = currentColumnIndex;

      if (shift) {
        // Shift+Tab: previous cell
        if (currentColumnIndex > 0) {
          newColumnIndex = currentColumnIndex - 1;
        } else if (currentRowIndex > 0) {
          // Move to previous row, last column
          newRowIndex = currentRowIndex - 1;
          newColumnIndex = columns.length - 1;
        }
      } else {
        // Tab: next cell
        if (currentColumnIndex < columns.length - 1) {
          newColumnIndex = currentColumnIndex + 1;
        } else if (currentRowIndex < totalRows - 1) {
          // Move to next row, first column
          newRowIndex = currentRowIndex + 1;
          newColumnIndex = 0;
        }
      }

      navigateToCell(newRowIndex, columns[newColumnIndex].id);
    },
    [selectedCell, navigateToCell, getVisibleColumns, getTotalRows]
  );

  // Handle Enter/F2 to enter edit mode
  const handleEnterEdit = useCallback(() => {
    if (!selectedCell || readonly) return;
    setEditableCell({ ...selectedCell });
  }, [selectedCell, readonly, setEditableCell]);

  // Handle Escape to exit edit mode
  const handleEscape = useCallback(() => {
    if (editableCell) {
      setEditableCell(null);
      // Keep selectedCell
    }
  }, [editableCell, setEditableCell]);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't handle if typing in textarea
      if (
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement
      ) {
        // Allow Escape to work even in textarea
        if (event.key === "Escape") {
          event.preventDefault();
          handleEscape();
        }
        return;
      }

      // Check if container is focused or has selected cell
      if (!containerRef.current) return;
      if (!selectedCell && !editableCell) return;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          handleArrowKey("up");
          break;
        case "ArrowDown":
          event.preventDefault();
          handleArrowKey("down");
          break;
        case "ArrowLeft":
          event.preventDefault();
          handleArrowKey("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          handleArrowKey("right");
          break;
        case "Tab":
          event.preventDefault();
          handleTab(event.shiftKey);
          break;
        case "Enter":
          event.preventDefault();
          if (editableCell) {
            // If already editing, do nothing (let textarea handle it)
            return;
          }
          handleEnterEdit();
          break;
        case "F2":
          event.preventDefault();
          handleEnterEdit();
          break;
        case "Escape":
          event.preventDefault();
          handleEscape();
          break;
      }
    },
    [
      containerRef,
      selectedCell,
      editableCell,
      handleArrowKey,
      handleTab,
      handleEnterEdit,
      handleEscape,
    ]
  );

  // Attach keyboard event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Make container focusable
    if (!container.hasAttribute("tabIndex")) {
      container.setAttribute("tabIndex", "0");
    }

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, handleKeyDown]);

  return {
    navigateToCell,
    handleArrowKey,
    handleTab,
    handleEnterEdit,
    handleEscape,
  };
}


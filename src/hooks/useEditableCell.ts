import {
  useState,
  useRef,
  useEffect,
  useCallback,
  MutableRefObject,
} from "react";

export interface EditableCell {
  rowIndex: number;
  columnId: string;
}

export interface SelectedCell {
  rowIndex: number;
  columnId: string;
}

export interface FocusRingStyle {
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
}

export interface UseEditableCellOptions {
  readonly?: boolean;
  onCellValueChange?: (
    rowIndex: number,
    columnId: string,
    value: string
  ) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  virtualItemsKey?: string; // Stable key from virtual items to trigger updates
}

export function useEditableCell({
  readonly = false,
  onCellValueChange,
  containerRef,
  virtualItemsKey,
}: UseEditableCellOptions) {
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [editableCell, setEditableCell] = useState<EditableCell | null>(null);
  const selectedCellElementRef = useRef<HTMLTableCellElement | null>(null);
  const editableCellElementRef = useRef<HTMLTableCellElement | null>(null);
  const [focusRingStyle, setFocusRingStyle] = useState<FocusRingStyle>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // Function to update focus ring position (follows selectedCell, not editableCell)
  const updateFocusRingPosition = useCallback(() => {
    // Use selectedCell for focus ring, fallback to editableCell if no selection
    const cellToFollow = selectedCell || editableCell;
    const cellElementRef = selectedCell
      ? selectedCellElementRef
      : editableCellElementRef;

    if (!cellToFollow || !cellElementRef.current || !containerRef.current) {
      setFocusRingStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const cellElement = cellElementRef.current;
    const container = containerRef.current;

    // Get bounding rects (viewport coordinates)
    const cellRect = cellElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate position relative to container
    const top = cellRect.top - containerRect.top + container.scrollTop - 1;
    const left = cellRect.left - containerRect.left + container.scrollLeft - 1;

    setFocusRingStyle({
      top,
      left,
      width: cellRect.width,
      height: cellRect.height,
      opacity: 1,
    });
  }, [selectedCell, editableCell, containerRef]);

  // Update focus ring when selectedCell or editableCell changes or virtual items change
  // Use a ref to track if we're already updating to prevent infinite loops
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    const cellToFollow = selectedCell || editableCell;
    if (!cellToFollow) {
      setFocusRingStyle((prev) => {
        // Only update if opacity is not already 0 to avoid unnecessary re-renders
        if (prev.opacity === 0) return prev;
        return { ...prev, opacity: 0 };
      });
      selectedCellElementRef.current = null;
      editableCellElementRef.current = null;
      return;
    }

    // Prevent concurrent updates
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    // Small delay to ensure DOM is updated after state change
    const timeoutId = setTimeout(() => {
      updateFocusRingPosition();
      isUpdatingRef.current = false;
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      isUpdatingRef.current = false;
    };
  }, [selectedCell, editableCell, virtualItemsKey, updateFocusRingPosition]);

  // Update focus ring on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (selectedCell || editableCell) {
        updateFocusRingPosition();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [selectedCell, editableCell, updateFocusRingPosition, containerRef]);

  // Update focus ring on window resize
  useEffect(() => {
    const handleResize = () => {
      if (selectedCell || editableCell) {
        updateFocusRingPosition();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedCell, editableCell, updateFocusRingPosition]);

  // // Click outside listener to close selection and editing
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       containerRef.current &&
  //       !containerRef.current.contains(event.target as Node)
  //     ) {
  //       setSelectedCell(null);
  //       setEditableCell(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [containerRef]);

  // Handle single click (selection only)
  const handleCellClick = useCallback(
    (rowIndex: number, columnId: string, isRowHeader: boolean) => {
      if (isRowHeader) return;
      // Set selected cell, but don't open edit mode
      setSelectedCell({ rowIndex, columnId });
      // Close edit mode if open
      if (editableCell) {
        setEditableCell(null);
      }
    },
    [editableCell]
  );

  // Handle double click (selection + edit mode)
  const handleCellDoubleClick = useCallback(
    (rowIndex: number, columnId: string, isRowHeader: boolean) => {
      if (!readonly && !isRowHeader) {
        // Set both selected and editable
        const cell = { rowIndex, columnId };
        setSelectedCell(cell);
        setEditableCell(cell);
      }
    },
    [readonly]
  );

  const commitCellEdit = useCallback(
    (rowIndex: number, columnId: string, value: string) => {
      onCellValueChange?.(rowIndex, columnId, value);

      // Close edit mode after commit (Handsontable behavior)
      setEditableCell(null);
      setSelectedCell(null);
    },
    [onCellValueChange]
  );

  return {
    selectedCell,
    setSelectedCell,
    editableCell,
    setEditableCell,
    selectedCellElementRef,
    editableCellElementRef,
    focusRingStyle,
    updateFocusRingPosition,
    handleCellClick,
    handleCellDoubleClick,
    commitCellEdit,
  };
}

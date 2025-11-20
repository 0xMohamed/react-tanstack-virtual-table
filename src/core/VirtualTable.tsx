import React, {
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { ColumnDef, ColumnSizingState, RowData } from "@tanstack/react-table";
import { useVirtualTable } from "../hooks/useVirtualTable";
import { useEditableCell } from "../hooks/useEditableCell";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useAutoColumnSize } from "../hooks/useAutoColumnSize";
import { TableHeader } from "../components/TableHeader";
import { TableBody } from "../components/TableBody";
import "../styles/variables.css";
import "../styles/table.css";

export interface VirtualTableTheme {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

export interface VirtualTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  height?: number;
  estimateRowHeight?: number;
  className?: string;
  style?: React.CSSProperties;
  onCellValueChange?: (
    rowIndex: number,
    columnId: string,
    value: string
  ) => void;
  readonly?: boolean;
  showRowHeader?: boolean;
  rowHeaderWidth?: number;
  showColumnHeader?: boolean;
  autoFitColumnWidth?: boolean;
  autoFitOptions?: {
    minWidth?: number;
    maxWidth?: number;
    padding?: number;
  };
  theme?: "light" | "dark";
  themeOverride?: Record<string, string>;
}

export function VirtualTable<TData extends RowData>({
  data,
  columns,
  height = 400,
  estimateRowHeight = 40,
  className,
  style,
  onCellValueChange,
  readonly = false,
  showRowHeader = true,
  showColumnHeader = true,
  rowHeaderWidth = 60,
  autoFitColumnWidth = false,
  autoFitOptions = {},
  theme = "light",
  themeOverride,
}: VirtualTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Add row header column if enabled
  const columnsWithRowHeader = useMemo(
    () =>
      showRowHeader
        ? [
            {
              id: "__rowHeader",
              header: "",
              cell: (info: { row: { index: number } }) => info.row.index + 1,
              size: rowHeaderWidth,
              enableSorting: false,
            } as ColumnDef<TData>,
            ...columns,
          ]
        : columns,
    [showRowHeader, columns, rowHeaderWidth]
  );

  const preMeasuredColumnSizing = useAutoColumnSize({
    enabled: autoFitColumnWidth,
    columns: columnsWithRowHeader,
    data,
    ...autoFitOptions,
  });

  const [columnSizingState, setColumnSizingState] = useState<ColumnSizingState>(
    () => preMeasuredColumnSizing ?? {}
  );

  useLayoutEffect(() => {
    if (!autoFitColumnWidth || !preMeasuredColumnSizing) return;
    setColumnSizingState(preMeasuredColumnSizing);
  }, [autoFitColumnWidth, preMeasuredColumnSizing]);

  const { table, rowVirtualizer, parentRef } = useVirtualTable({
    data,
    columns: columnsWithRowHeader,
    estimateRowHeight,
    columnSizing: columnSizingState,
    onColumnSizingChange: autoFitColumnWidth ? undefined : setColumnSizingState,
  });

  // Editable cell management
  // Get virtual items - they change when scrolling, so we need to track them
  const virtualItems = rowVirtualizer.getVirtualItems();
  // Create a stable key from virtual items to track actual changes
  const virtualItemsKey = useMemo(
    () => virtualItems.map((item) => `${item.index}-${item.start}`).join(","),
    [virtualItems]
  );

  const {
    selectedCell,
    setSelectedCell,
    editableCell,
    setEditableCell,
    selectedCellElementRef,
    editableCellElementRef,
    focusRingStyle,
    handleCellClick,
    handleCellDoubleClick,
    commitCellEdit,
  } = useEditableCell({
    readonly,
    onCellValueChange,
    containerRef: tableContainerRef,
    virtualItemsKey, // Pass stable key instead of array
  });

  // Keyboard navigation
  useKeyboardNavigation({
    table,
    rowVirtualizer,
    selectedCell,
    editableCell,
    setSelectedCell,
    setEditableCell,
    readonly,
    containerRef: tableContainerRef,
    selectedCellElementRef,
  });

  // Merge refs using useCallback to avoid recreating the function
  // Note: refs are stable and don't need to be in dependencies
  const containerRefCallback = useCallback((el: HTMLDivElement | null) => {
    parentRef.current = el;
    tableContainerRef.current = el;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply theme and theme overrides
  const containerStyle: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      height,
      ...style,
    };

    if (themeOverride) {
      return {
        ...baseStyle,
        ...Object.fromEntries(
          Object.entries(themeOverride).map(([key, value]) => [
            key.startsWith("--") ? key : `--${key}`,
            value,
          ])
        ),
      } as React.CSSProperties;
    }

    return baseStyle;
  }, [height, style, themeOverride]);

  const containerClasses = ["vt-container", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRefCallback}
      className={containerClasses}
      data-theme={theme}
      style={containerStyle}
    >
      <table className="vt-table">
        {showColumnHeader && (
          <TableHeader
            headerGroups={table.getHeaderGroups()}
            selectedCell={selectedCell}
            editableCell={editableCell}
          />
        )}

        <TableBody
          table={table}
          rowVirtualizer={rowVirtualizer}
          selectedCell={selectedCell}
          editableCell={editableCell}
          readonly={readonly}
          selectedCellElementRef={selectedCellElementRef}
          editableCellElementRef={editableCellElementRef}
          onCellClick={handleCellClick}
          onCellDoubleClick={handleCellDoubleClick}
          commitCellEdit={commitCellEdit}
        />
      </table>

      {/* Floating focus ring overlay */}
      <div
        className={`vt-focus-ring ${
          focusRingStyle.opacity > 0 ? "vt-focus-ring--visible" : ""
        }`}
        style={{
          top: `${focusRingStyle.top}px`,
          left: `${focusRingStyle.left}px`,
          width: `${focusRingStyle.width}px`,
          height: `${focusRingStyle.height}px`,
        }}
      />
    </div>
  );
}

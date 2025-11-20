import React, { useCallback } from "react";
import { Table, RowData } from "@tanstack/react-table";
import { Virtualizer } from "@tanstack/react-virtual";
import { EditableCell, SelectedCell } from "../hooks/useEditableCell";
import { TableRow } from "./TableRow";

interface TableBodyProps<TData extends RowData> {
  table: Table<TData>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  selectedCell: SelectedCell | null;
  editableCell: EditableCell | null;
  readonly: boolean;
  selectedCellElementRef: React.MutableRefObject<HTMLTableCellElement | null>;
  editableCellElementRef: React.MutableRefObject<HTMLTableCellElement | null>;
  onCellClick: (
    rowIndex: number,
    columnId: string,
    isRowHeader: boolean
  ) => void;
  onCellDoubleClick: (
    rowIndex: number,
    columnId: string,
    isRowHeader: boolean
  ) => void;
  onCellEdit: (rowIndex: number, columnId: string, value: string) => void;
}

export function TableBody<TData extends RowData>({
  table,
  rowVirtualizer,
  selectedCell,
  editableCell,
  readonly,
  selectedCellElementRef,
  editableCellElementRef,
  onCellClick,
  onCellDoubleClick,
  onCellEdit,
}: TableBodyProps<TData>) {
  const virtualItems = rowVirtualizer.getVirtualItems();

  // Memoize measureElement to prevent infinite loops
  // This function must be stable across renders to avoid triggering re-measurements
  // Use a ref to store the measureElement function to ensure it's always the latest
  // but doesn't cause re-renders when the virtualizer updates
  const measureElementRef = React.useRef(rowVirtualizer.measureElement);
  measureElementRef.current = rowVirtualizer.measureElement;
  
  const measureElement = useCallback(
    (node: HTMLTableRowElement | null) => {
      measureElementRef.current(node);
    },
    [] // Empty deps - ref ensures we always use the latest function
  );

  return (
    <tbody
      className="vt-tbody"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {virtualItems.map((virtualRow) => {
        const row = table.getRowModel().rows[virtualRow.index];
        return (
          <TableRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            selectedCell={selectedCell}
            editableCell={editableCell}
            readonly={readonly}
            selectedCellElementRef={selectedCellElementRef}
            editableCellElementRef={editableCellElementRef}
            onCellClick={onCellClick}
            onCellDoubleClick={onCellDoubleClick}
            onCellEdit={onCellEdit}
            measureElement={measureElement}
          />
        );
      })}
    </tbody>
  );
}

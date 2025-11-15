import React from "react";
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
  selectedCellElementRef: React.RefObject<HTMLTableCellElement | null>;
  editableCellElementRef: React.RefObject<HTMLTableCellElement | null>;
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
            measureElement={(node) => rowVirtualizer.measureElement(node)}
          />
        );
      })}
    </tbody>
  );
}

import React from "react";
import { flexRender, Cell, RowData } from "@tanstack/react-table";

interface TableCellProps<TData extends RowData> {
  cell: Cell<TData, unknown>;
  isRowHeader: boolean;
  isActiveEditable: boolean;
  isActiveRow: boolean;
  isSelected: boolean;
  readonly: boolean;
  virtualRowSize: number;
  selectedCellElementRef: React.MutableRefObject<HTMLTableCellElement | null>;
  editableCellElementRef: React.MutableRefObject<HTMLTableCellElement | null>;
  onClick: () => void;
  onDoubleClick: () => void;
  onCellEdit: (value: string) => void;
}

export function TableCell<TData extends RowData>({
  cell,
  isRowHeader,
  isActiveEditable,
  isActiveRow,
  isSelected,
  readonly,
  virtualRowSize,
  selectedCellElementRef,
  editableCellElementRef,
  onClick,
  onDoubleClick,
  onCellEdit,
}: TableCellProps<TData>) {
  const cellClasses = [
    "vt-td",
    isRowHeader && "vt-td--row-header",
    isActiveRow && "vt-td--row-header-active",
    isSelected && "vt-cell-selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <td
      key={cell.id}
      ref={(node) => {
        if (isSelected) {
          selectedCellElementRef.current = node;
        }
        if (isActiveEditable) {
          editableCellElementRef.current = node;
        }
      }}
      className={cellClasses}
      style={{
        width: cell.column.getSize(),
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {readonly ? (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      ) : isActiveEditable ? (
        <textarea
          className="vt-cell-editable"
          value={String(cell.getValue() ?? "")}
          onChange={(e) => onCellEdit(e.target.value)}
          style={{
            height: `${virtualRowSize}px`,
          }}
          autoFocus
        />
      ) : (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      )}
    </td>
  );
}

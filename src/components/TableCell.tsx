import React, { useState, useEffect, useRef, useCallback } from "react";
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

  /** THIS MUST FIRE ON COMMIT (after edit), not every key */
  commitCellEdit: (value: string) => void;
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
  commitCellEdit,
}: TableCellProps<TData>) {
  const cellRef = useRef<HTMLTextAreaElement>(null);

  const originalValue = String(cell.getValue() ?? "");
  const [localValue, setLocalValue] = useState(originalValue);

  // When cell enters edit mode → initialize localValue
  useEffect(() => {
    if (isActiveEditable) {
      setLocalValue(originalValue);
    }
  }, [isActiveEditable, originalValue]);

  // Commit (Handsontable: blur / enter)
  const commitEdit = useCallback(() => {
    if (localValue !== originalValue) {
      commitCellEdit(localValue);
    }
  }, [commitCellEdit, localValue, originalValue]);

  // Cancel edit (ESC)
  const cancelEdit = () => {
    setLocalValue(originalValue);
  };

  // Keyboard handling (Enter / Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  useEffect(() => {
    if (!isActiveEditable) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!cellRef.current?.contains(e.target as Node)) {
        commitEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActiveEditable, localValue, commitEdit]);

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
        if (isSelected) selectedCellElementRef.current = node;
        if (isActiveEditable) editableCellElementRef.current = node;
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
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)} // LOCAL ONLY
          onBlur={commitEdit} // COMMIT ON BLUR
          onKeyDown={handleKeyDown} // ENTER / ESC
          style={{ height: `${virtualRowSize}px` }}
          autoFocus
        />
      ) : (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      )}
    </td>
  );
}

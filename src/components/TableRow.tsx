import React from "react";
import { Row, RowData } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";
import { EditableCell, SelectedCell } from "../hooks/useEditableCell";
import { TableCell } from "./TableCell";

interface TableRowProps<TData extends RowData> {
  row: Row<TData>;
  virtualRow: VirtualItem;
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
  commitCellEdit: (rowIndex: number, columnId: string, value: string) => void;
  measureElement: (node: HTMLTableRowElement | null) => void;
}

export function TableRow<TData extends RowData>({
  row,
  virtualRow,
  selectedCell,
  editableCell,
  readonly,
  selectedCellElementRef,
  editableCellElementRef,
  onCellClick,
  onCellDoubleClick,
  commitCellEdit,
  measureElement,
}: TableRowProps<TData>) {
  return (
    <tr
      data-index={virtualRow.index}
      ref={measureElement}
      className="vt-tr--virtual"
      style={{
        transform: `translateY(${virtualRow.start}px)`,
      }}
    >
      {row.getVisibleCells().map((cell) => {
        const isSelected =
          selectedCell?.rowIndex === virtualRow.index &&
          selectedCell?.columnId === cell.column.id;
        const isActiveEditable =
          editableCell?.rowIndex === virtualRow.index &&
          editableCell?.columnId === cell.column.id;
        const isRowHeader = cell.column.id === "__rowHeader";
        const isActiveRow =
          (selectedCell?.rowIndex === virtualRow.index ||
            editableCell?.rowIndex === virtualRow.index) &&
          isRowHeader;

        return (
          <TableCell
            key={cell.id}
            cell={cell}
            isRowHeader={isRowHeader}
            isActiveEditable={isActiveEditable}
            isActiveRow={isActiveRow}
            isSelected={isSelected}
            readonly={readonly}
            virtualRowSize={virtualRow.size}
            selectedCellElementRef={selectedCellElementRef}
            editableCellElementRef={editableCellElementRef}
            onClick={() => {
              onCellClick(virtualRow.index, cell.column.id, isRowHeader);
            }}
            onDoubleClick={() => {
              onCellDoubleClick(virtualRow.index, cell.column.id, isRowHeader);
            }}
            commitCellEdit={(value) => {
              commitCellEdit(virtualRow.index, cell.column.id, value);
            }}
          />
        );
      })}
    </tr>
  );
}

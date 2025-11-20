import { flexRender, HeaderGroup, RowData } from "@tanstack/react-table";
import { EditableCell, SelectedCell } from "../hooks/useEditableCell";

interface TableHeaderProps<TData extends RowData> {
  headerGroups: HeaderGroup<TData>[];
  selectedCell: SelectedCell | null;
  editableCell: EditableCell | null;
}

export function TableHeader<TData extends RowData>({
  headerGroups,
  selectedCell,
  editableCell,
}: TableHeaderProps<TData>) {
  return (
    <thead className="vt-thead">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id} className="vt-tr">
          {headerGroup.headers.map((header) => {
            const isRowHeader = header.id === "__rowHeader";
            // Highlight column if selected or editable
            const activeCell = selectedCell || editableCell;
            const isActiveColumn =
              activeCell?.columnId === header.id && !isRowHeader;

            const headerClasses = [
              "vt-th",
              isRowHeader && "vt-th--row-header",
              isActiveColumn && "vt-th--active",
              header.column.getCanSort() && "vt-th--sortable",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <th
                key={header.id}
                className={headerClasses}
                style={{
                  width: header.getSize(),
                }}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

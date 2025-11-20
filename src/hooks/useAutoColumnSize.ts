import { useMemo, useRef } from "react";
import { ColumnDef, ColumnSizingState, RowData } from "@tanstack/react-table";
import { measureColumnWidth } from "../utils/measureText";

export interface UseAutoColumnSizeOptions<TData extends RowData> {
  enabled: boolean;
  columns: ColumnDef<TData>[];
  data: TData[];
  minWidth?: number;
  maxWidth?: number;
  padding?: number;
}

/**
 * Computes column widths synchronously so the table can render once with
 * correct sizing (avoids post-render flicker).
 */
export function useAutoColumnSize<TData extends RowData>({
  enabled,
  columns,
  data,
  minWidth = 50,
  maxWidth = 500,
  padding = 16,
}: UseAutoColumnSizeOptions<TData>) {
  const measurementCacheRef = useRef<Map<string, number>>(new Map());

  const columnSizing = useMemo<ColumnSizingState | undefined>(() => {
    if (!enabled) return undefined;
    if (typeof window === "undefined") {
      // On the server we can't measure, fall back to default widths.
      return undefined;
    }

    const sizing: ColumnSizingState = {};

    columns.forEach((columnDef, index) => {
      const columnAccessorKey =
        "accessorKey" in columnDef && typeof columnDef.accessorKey === "string"
          ? columnDef.accessorKey
          : undefined;
      const columnId = columnDef.id ?? columnAccessorKey ?? `auto_col_${index}`;

      if (columnId === "__rowHeader") return;

      const cacheKey = `${columnId}-${data.length}`;
      if (measurementCacheRef.current.has(cacheKey)) {
        sizing[columnId] = measurementCacheRef.current.get(cacheKey)!;
        return;
      }

      const headerText =
        typeof columnDef.header === "function"
          ? String(
              columnDef.header(
                {} as Parameters<NonNullable<typeof columnDef.header>>[0]
              )
            )
          : String(columnDef.header ?? "");

      const extendedColumnDef = columnDef as ColumnDef<TData> & {
        accessorKey?: keyof TData;
        accessorFn?: (originalRow: TData, rowIndex: number) => unknown;
      };
      const accessorKey = extendedColumnDef.accessorKey;
      const accessorFn = extendedColumnDef.accessorFn;

      const columnValues: (string | number | null | undefined)[] = data.map(
        (row, rowIndex) => {
          if (accessorKey) {
            const value = row[accessorKey];
            if (value === null || value === undefined) return "";
            if (typeof value === "string" || typeof value === "number") {
              return value;
            }
            return String(value);
          }
          if (accessorFn) {
            const value = accessorFn(row, rowIndex);
            if (value === null || value === undefined) return "";
            if (typeof value === "string" || typeof value === "number") {
              return value;
            }
            return String(value);
          }
          return "";
        }
      );

      const width = measureColumnWidth(headerText, columnValues, {
        minWidth,
        maxWidth,
        padding,
      });

      measurementCacheRef.current.set(cacheKey, width);
      sizing[columnId] = width;
    });

    return sizing;
  }, [enabled, columns, data, minWidth, maxWidth, padding]);

  return columnSizing;
}

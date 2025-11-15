import { useEffect, useRef, useCallback } from "react";
import { Table, ColumnDef, RowData } from "@tanstack/react-table";
import { measureTextWidthDOM, measureColumnWidth } from "../utils/measureText";
import { debounce } from "../utils/debounce";

export interface UseAutoColumnSizeOptions<TData extends RowData> {
  enabled: boolean;
  table: Table<TData>;
  data: TData[];
  minWidth?: number;
  maxWidth?: number;
  padding?: number;
}

export function useAutoColumnSize<TData extends RowData>({
  enabled,
  table,
  data,
  minWidth = 50,
  maxWidth = 500,
  padding = 16,
}: UseAutoColumnSizeOptions<TData>) {
  const isMeasuringRef = useRef(false);
  const measurementCacheRef = useRef<Map<string, number>>(new Map());

  const measureColumn = useCallback(
    (columnId: string, columnDef: ColumnDef<TData>) => {
      if (isMeasuringRef.current) return;

      const cacheKey = `${columnId}-${data.length}`;
      if (measurementCacheRef.current.has(cacheKey)) {
        const cachedWidth = measurementCacheRef.current.get(cacheKey)!;
        table.setColumnSizing((old) => ({
          ...old,
          [columnId]: cachedWidth,
        }));
        return;
      }

      isMeasuringRef.current = true;

      // Get header text
      const headerText =
        typeof columnDef.header === "function"
          ? String(columnDef.header({} as any))
          : String(columnDef.header || "");

      // Get all cell values for this column
      const cellValues = data.map((row) => {
        const accessorKey = (columnDef as any).accessorKey;
        if (accessorKey) {
          return (row as any)[accessorKey];
        }
        if (columnDef.cell) {
          // Try to render cell to get value
          const cellValue = (columnDef.cell as any)({
            getValue: () => (row as any)[accessorKey],
            row: { original: row },
          } as any);
          return typeof cellValue === "string" ? cellValue : String(cellValue || "");
        }
        return "";
      });

      // Measure column width
      const width = measureColumnWidth(headerText, cellValues, {
        minWidth,
        maxWidth,
        padding,
      });

      // Cache the result
      measurementCacheRef.current.set(cacheKey, width);

      // Update column sizing using TanStack Table API
      const column = table.getColumn(columnId);
      if (column) {
        column.setSize(width);
      }

      isMeasuringRef.current = false;
    },
    [table, data, minWidth, maxWidth, padding]
  );

  const measureAllColumns = useCallback(() => {
    if (!enabled) return;

    const columns = table.getAllColumns();
    columns.forEach((column) => {
      if (column.id === "__rowHeader") return; // Skip row header
      const columnDef = column.columnDef;
      measureColumn(column.id, columnDef);
    });
  }, [enabled, table, measureColumn]);

  // Debounced measure function
  const debouncedMeasure = useCallback(
    debounce(measureAllColumns, 100),
    [measureAllColumns]
  );

  // Measure columns when data or columns change
  useEffect(() => {
    if (!enabled) return;
    debouncedMeasure();
  }, [enabled, data, table.getAllColumns().length, debouncedMeasure]);

  // Handle zoom changes
  useEffect(() => {
    if (!enabled) return;

    const handleZoom = () => {
      measurementCacheRef.current.clear();
      debouncedMeasure();
    };

    // Listen for zoom changes (visualViewport API)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleZoom);
      return () => {
        window.visualViewport?.removeEventListener("resize", handleZoom);
      };
    } else {
      window.addEventListener("resize", handleZoom);
      return () => {
        window.removeEventListener("resize", handleZoom);
      };
    }
  }, [enabled, debouncedMeasure]);

  return {
    measureColumn,
    measureAllColumns,
  };
}


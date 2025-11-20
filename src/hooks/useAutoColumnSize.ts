import { useEffect, useRef, useCallback, useMemo } from "react";
import { Table, ColumnDef, RowData } from "@tanstack/react-table";
import { measureColumnWidth } from "../utils/measureText";
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
          ? String(columnDef.header({} as Parameters<NonNullable<typeof columnDef.header>>[0]))
          : String(columnDef.header || "");

      // Get all cell values for this column
      const cellValues: (string | number | null | undefined)[] = data.map((row) => {
        // Type guard for accessorKey
        const columnDefWithAccessor = columnDef as ColumnDef<TData> & { accessorKey?: keyof TData };
        if (columnDefWithAccessor.accessorKey) {
          const value = row[columnDefWithAccessor.accessorKey];
          // Convert to string or number for measurement
          if (value === null || value === undefined) {
            return "";
          }
          if (typeof value === "string" || typeof value === "number") {
            return value;
          }
          return String(value);
        }
        if (columnDef.cell && typeof columnDef.cell === "function") {
          // Try to render cell to get value
          // Create a minimal cell context for measurement
          const cellContext = {
            getValue: () => {
              // Try to get value from accessorKey if available
              if (columnDefWithAccessor.accessorKey) {
                return row[columnDefWithAccessor.accessorKey];
              }
              return undefined;
            },
            row: { original: row },
          } as Parameters<typeof columnDef.cell>[0];
          
          const cellValue = columnDef.cell(cellContext);
          if (cellValue === null || cellValue === undefined) {
            return "";
          }
          if (typeof cellValue === "string" || typeof cellValue === "number") {
            return cellValue;
          }
          return String(cellValue);
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
      table.setColumnSizing((old) => ({
        ...old,
        [columnId]: width,
      }));

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

  // Debounced measure function - use useMemo to create stable debounced function
  const debouncedMeasure = useMemo(
    () => debounce(measureAllColumns, 100),
    [measureAllColumns]
  );

  // Measure columns when data or columns change
  const columnCount = table.getAllColumns().length;
  useEffect(() => {
    if (!enabled) return;
    debouncedMeasure();
  }, [enabled, data, columnCount, debouncedMeasure]);

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

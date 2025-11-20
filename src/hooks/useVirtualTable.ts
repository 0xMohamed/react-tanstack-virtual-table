import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  RowData,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, MutableRefObject } from "react";

interface UseVirtualTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  estimateRowHeight?: number;
}

export function useVirtualTable<TData extends RowData>({
  data,
  columns,
  estimateRowHeight = 40,
}: UseVirtualTableProps<TData>) {
  const parentRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement | null>;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    estimateSize: () => estimateRowHeight,
    getScrollElement: () => parentRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return { table, rowVirtualizer, parentRef };
}

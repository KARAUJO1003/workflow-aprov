/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { SliderIcon } from "@radix-ui/react-icons";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./datatable-pagination";
import { DataTableFilters } from "./datatable-filters";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

const getCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-2px 0 2px -2px hsl(var(--border)) inset"
      : isFirstRightPinnedColumn
      ? "2px 0 2px -2px hsl(var(--border)) inset"
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    backgroundColor: "hsl(var(--background))",
  };
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  topHeader?: React.ReactNode;
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  sizePagination?: 10 | 20 | 30 | 40 | 50;
  hiddenColumnsToggle?: boolean;
  exportTableFn?: (data: TData[]) => React.ReactNode | void;
  canQuerySearchParams?: boolean;
  columnTitles?: any;
}

/*************  ✨ Codeium Command ⭐  *************/
/**
 * DataTableGlobal is a component that renders a data table with advanced features
 * such as sorting, filtering, pagination, and column visibility toggling.
 * 
 * @template TData - The type of data being passed to the table.

/******  493cf095-15d1-4b11-a194-92fcc5231332  *******/
export const DataTableGlobal = <TData, TValue>({
  data,
  columns,
  columnTitles,
  topHeader,
  exportTableFn,
  getRowCanExpand, // default: () => false
  renderSubComponent,
  hiddenColumnsToggle = false,
  canQuerySearchParams = false,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [, setQueryUpdate] = React.useState<Record<string, any>>({});
  const [debounceTimer, setDebounceTimer] =
    React.useState<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchQuery = (updatedQuery: any) => {
    setQueryUpdate(updatedQuery);

    // Clear any existing debounce timer
    if (debounceTimer) clearTimeout(debounceTimer);

    // Set a new timer
    const newTimer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      Object.keys(updatedQuery).forEach((key) => {
        if (updatedQuery[key]) {
          params.set(key, updatedQuery[key]);
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();
      const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(updatedPath);
    }, 500); // Delay of 500ms (adjust as needed)

    setDebounceTimer(newTimer);
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  function formatColumnId(value: string): string {
    return value.replace(/_/g, " ");
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: (e: any) => {
      if (canQuerySearchParams) {
        e().forEach((filter: any) => {
          updateSearchQuery({ [filter.id]: filter.value });
        });
      }
      setColumnFilters(e);
    },
    getFacetedRowModel: getFacetedRowModel(), // Requerido para faceted filtering
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
  });

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-end gap-4">
        {exportTableFn &&
          (exportTableFn(
            table.getFilteredRowModel().rows.map((r) => r.original)
          ) ||
            null)}
        {topHeader}
        {!hiddenColumnsToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto"
              >
                Colunas
                <SliderIcon className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column, index) => {
                  const columnTitleAux = columnTitles
                    ? columnTitles[
                        formatColumnId(column.id).replace(/\s+/g, "_")
                      ]
                    : formatColumnId(column.id);
                  return (
                    <DropdownMenuCheckboxItem
                      key={index}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnTitleAux}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="border rounded-md overflow-clip">
        <Table>
          <TableHeader className="bg-background min-w-full">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow
                key={index}
                className="!border-b"
              >
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    className="relative px-0"
                    key={index}
                    style={{
                      width: header.getSize(),
                      ...getCommonPinningStyles(header.column),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col justify-between h-full">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div className="flex !bg-muted mt-auto py-0.5 border-t">
                            <DataTableFilters column={header.column} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-background">
            {table?.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    key={index}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={index}
                        style={{ ...getCommonPinningStyles(cell.column) }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow className="bg-muted hover:bg-muted">
                      <TableCell
                        colSpan={row.getVisibleCells().length}
                        className="!p-2"
                      >
                        {renderSubComponent && renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

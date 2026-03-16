/* eslint-disable */
"use client"

import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { useState } from "react"
import { Input } from "../ui/input"
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenu,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { useUsers } from "@/hooks/use-users"
import type { UserInfo } from "@/types"
import { useTranslation } from "react-i18next"
import { ArrowUpDown, MoreHorizontal, Settings } from "lucide-react"
import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "../ui/checkbox"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const DataTable = <TData, TValue>({
  columns,
  data,
}: Readonly<DataTableProps<TData, TValue>>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const { t } = useTranslation()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder={t("users.search")}
          value={
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
            (table.getColumn("identifier")?.getFilterValue() as string) || ""
          }
          onChange={(event) =>
            table.getColumn("identifier")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {t("users.view")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map(
                (column): React.ReactNode =>
                  column.id !== "identifier" && (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        column.toggleVisibility(value)
                      }}
                    >
                      {t(column.id)}
                    </DropdownMenuCheckboxItem>
                  ),
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("users.no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t("users.of")}{" "}
          {table.getFilteredRowModel().rows.length} {t("users.rows_selected")}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage()
            }}
            disabled={!table.getCanPreviousPage()}
          >
            {t("users.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage()
            }}
            disabled={!table.getCanNextPage()}
          >
            {t("users.next")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DemoPage() {
  const data: UserInfo[] = useUsers()
  const { t } = useTranslation()
  return (
    <div className="max-w-4/5 container mx-auto py-10">
      <DataTable
        columns={[
          /* improve the padding generated when a column btn has an icon */
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => {
                  table.toggleAllPageRowsSelected(value === true)
                }}
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                  row.toggleSelected(value === true)
                }}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "identifier",
            filterFn: (row, columnId, filterValue: string) =>
              row.getValue<number>(columnId).toString().includes(filterValue),
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() => {
                  column.toggleSorting(column.getIsSorted() === "asc")
                }}
              >
                {t("users.identifier")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            ),
          },
          {
            accessorKey: "role",
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() => {
                  column.toggleSorting(column.getIsSorted() === "asc")
                }}
              >
                {t("role")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            ),
          },
          {
            id: "actions",
            header: () => <div>{t("actions")}</div>,
            cell: ({ row }) => {
              const users = row.original

              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard
                          .writeText(users.identifier.toString())
                          .catch(() => undefined)
                      }}
                    >
                      {t("users.copy_id")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => {}}>
                      {t("users.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            },
          },
        ]}
        data={data}
      />
    </div>
  )
}

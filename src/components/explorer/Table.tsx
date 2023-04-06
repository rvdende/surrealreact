import { useRouter } from "next/router";
import { dbSlugs } from "./TreeStructure";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { getSurreal, useAppState } from "../../state/useAppState";
import flatten from "flat";
import { SurrealResult } from "../../surrealdbjs";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { HiXMark } from "react-icons/hi2";

// type UnknownRow = { id: string } & { [index: string]: unknown };

function deriveColumnsFromRows<
  T extends R[],
  R extends { [index: string]: unknown }
>(rows: unknown[]) {
  const columnHelper = createColumnHelper<T>();
  const keys: string[] = ["id"];

  rows.forEach((r) => {
    Object.keys(flatten(r)).forEach((k) => {
      if (keys.includes(k)) return;
      keys.push(k);
    });
  });

  const columns = keys.map((k: keyof R) => {
    return columnHelper.accessor(
      (row: T) => {
        const temp: R = flatten(row);
        return temp[k] as unknown;
      },
      {
        id: k as string,
      }
    );
    // return {
    //   field: k,
    //   flex: 1,
    //   valueGetter: (props) => {
    //     return objectByString(props.row, k);
    //   },
    // };
  });

  return columns;
}

export function Table() {
  const appstate = useAppState();

  const slugs = dbSlugs(useRouter().query.slug);
  const [rows, setRows] = useState<never[]>();
  // const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(-1);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // const fetchDataOptions = {
  //   pageIndex,
  //   pageSize,
  // };

  // const defaultData = useMemo(() => [], []);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const columns = useMemo(() => deriveColumnsFromRows(rows ?? []), [rows]);

  const table = useReactTable({
    data: rows ?? [],
    columns: columns,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: { pagination },
    onPaginationChange: (p) => {
      console.log(p);
      setPagination(p);
    },
  });

  useEffect(() => {
    if (!slugs.ns) return;
    if (!slugs.db) return;
    if (!slugs.tb) return;

    getSurreal()
      .use(slugs.ns, slugs.db)
      .query<[SurrealResult<[{ count: number }]>]>(
        `SELECT count() as count FROM ${slugs.tb} GROUP BY count; `
      )
      .then((r) => {
        const data_count = r[0]?.result[0]?.count ?? 0;
        const data_pagecount = Math.ceil(data_count / pageSize);
        if (data_pagecount != pageCount) setPageCount(data_pagecount);
      })
      .catch(console.error);

    getSurreal()
      .use(slugs.ns, slugs.db)
      .query<[SurrealResult<never[]>]>(
        `SELECT * FROM ${slugs.tb} ORDER BY id LIMIT ${pageSize} START AT ${
          pageSize * pageIndex
        };`
      )
      .then((r) => {
        const data_rows = r[0]?.result;
        if (JSON.stringify(rows) !== JSON.stringify(data_rows))
          setRows(data_rows);
      })
      .catch(console.error);
  }, [
    slugs.ns,
    slugs.db,
    slugs.tb,
    pageSize,
    pageIndex,
    pageCount,
    rows,
    appstate.latestData,
  ]);

  if (!rows) return <div>loading...</div>;

  return (
    <div className={clsx("m-0 grid grid-cols-12")}>
      <div
        className={clsx(
          table.getPageCount() === 1 ? "hidden" : "block",
          "col-span-full flex items-center gap-2 pb-3"
        )}
      >
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <BsChevronDoubleLeft className="icon" />
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <BsChevronLeft className="icon" />
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <BsChevronRight className="icon" />
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <BsChevronDoubleRight className="icon" />
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span>{}</span>
        <span className={clsx("flex items-center gap-1", "hidden md:block")}>
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 rounded border p-1"
          />
        </span>
        <select
          className="hidden md:block"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="tablewrap m-0 w-full p-0">
        <table className="m-0 w-full p-0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th className="w-1"></th>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-pink-400/20"
                onClick={() => {
                  if (!slugs.ns) return;
                  if (!slugs.db) return;
                  if (!slugs.tb) return;

                  appstate.set({
                    activeRow: {
                      ns: slugs.ns,
                      db: slugs.db,
                      tb: slugs.tb,
                      row: JSON.stringify(row.original, null, 2),
                    },
                  });
                }}
              >
                <td>
                  <button
                    className="bg-transparent"
                    onClick={(e) => {
                      if (!slugs.ns) return;
                      if (!slugs.db) return;
                      if (!slugs.tb) return;

                      e.stopPropagation();
                      const { id } = row.original as unknown as { id: string };

                      getSurreal()
                        .use(slugs.ns, slugs.db)
                        .query(`delete ${id}`)
                        .then(async () => {
                          await appstate.update().catch(console.error);
                          appstate.set({ activeRow: undefined });
                        })
                        .catch(console.error);
                    }}
                  >
                    <HiXMark className="icon" />
                  </button>
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

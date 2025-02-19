"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useContext, useEffect, useState } from "react";
import { DownloadBtn } from "./DownloadBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp,
  faSortDown,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import AddNewProductBtn from "./AddNewProductBtn";
import { getProduct } from "@/lib/fetch/Product";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useBranchFetch } from "@/hooks/useBranchFetch";
import { DataContext } from "@/Context/DataContext";
import Loading from "./Loading";
import { redirect } from "next/navigation";

const TanStackTable = () => {
  const queryClient = useQueryClient();

  const {
    branchData: branchDataFromContext,
    setProductData,
    isOpen,
    toggleSideBar,
  } = useContext(DataContext);

  const { user, error, isLoading: Authenticating } = useUser();

  const [search, setSearch] = useState();

  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const {
    data: branchData,
    isLoading: fetchingBranch,
    error: errorInFetchBranch,
    isSuccess,
  } = useBranchFetch(user?.email);

  // // console.log("🚀 ~ TanStackTable ~ branchData:", branchData);

  // // console.log("🚀 ~ TanStackTable ~ user:", user);

  /// Default pagination page index error

  const getPaginationFromLocalStorage = () => {
    let paginationData;

    if (typeof window !== "undefined") {
      paginationData = localStorage.getItem("pagination");
    }

    if (paginationData) {
      return JSON.parse(paginationData);
    } else {
      // If no data in localStorage, return default values
      return { pageIndex: 1, pageSize: 10 };
    }
  };
  const [pagination, setPagination] = useState(getPaginationFromLocalStorage);

  ///////////////////////

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pagination", JSON.stringify(pagination));
    }
  }, [pagination]);

  const dataQuery = useQuery({
    gcTime: 24 * 24 * 60 * 60 * 1000,
    queryKey: ["productData", pagination, search],
    queryFn: () =>
      getProduct(
        branchData.meta.branchId,
        pagination.pageIndex,
        pagination.pageSize,
        search
      ),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });
  ////////////////REFETCH AFTER BRANCHDATA AND USER CHANGE
  useEffect(() => {
    const refetch = async () => {
      await queryClient.refetchQueries({
        queryKey: "branchData",
        type: "active",
        exact: true,
      });
    };
    refetch();
  }, [queryClient, user]);

  useEffect(() => {
    const refetch = async () => {
      await queryClient.refetchQueries({
        queryKey: ["productData"],
        type: "active",
        exact: true,
      });
    };
    refetch();
  }, [queryClient, branchData]);
  //////////////////// REDIRECT TO LOGOUT if not USER
  useEffect(() => {
    if (!Authenticating && !user) {
      return redirect("/login");
    }
  }, [user, Authenticating]);
  /////////////////////

  // // // console.log("🚀 ~ TanStackTable ~ dataQuery:", dataQuery);

  const columns = [
    {
      accessorKey: "no",
      id: "no",
      cell: (info) => (
        <span>
          {info.row.index +
            (pagination.pageIndex - 1) * pagination.pageSize +
            1}
        </span>
      ),
    },
    {
      accessorKey: "name",
      id: "name",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.category,
      id: "category",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.description,
      id: "description",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.notes,
      id: "notes",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.price,
      id: "price",
      cell: (info) => info.getValue().toLocaleString(),
    },
    {
      accessorFn: (row) => row.quantity,
      id: "quantity",
      cell: (info) => info.getValue().toLocaleString(),
    },
  ];

  const table = useReactTable({
    // data: dataQuery.data?.data?.products,
    data: dataQuery?.data?.data?.products ?? [],
    columns,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    state: {
      globalFilter: filtering,
      sorting: sorting,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="p-2 mx-auto bg-background">
      <div className="flex sticky z-10 top-0 bg-[#F2F2F2] justify-between pb-2">
        <div className="w-full flex  items-center justify-between gap-1">
          {/* <SearchBox /> */}
          <div id="searchBox" className="w-2/5">
            <div className="flex relative">
              <div className="relative w-full">
                <input
                  type="search"
                  id="search"
                  className="block p-2 w-full z-20 focus:outline-none text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-lg border border-primary"
                  placeholder="Search..."
                  onChange={(e) => {
                    setPagination((prevPagination) => ({
                      ...prevPagination,
                      pageIndex: 1,
                    }));
                    setSearch(e.target.value);
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute top-0 end-0 p-2.5 px-4 text-sm font-medium h-full text-white bg-active rounded-e-lg  hover:bg-blue-800 focus:outline-none focus:ring-blue-300"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex">
            {" "}
            {dataQuery && (
              <DownloadBtn
                data={dataQuery?.data?.data?.products}
                fileName={`${branchData?.data?.branch?.companyName} Products`}
              />
            )}
            <AddNewProductBtn mode="add-product" />
          </div>
        </div>
      </div>
      <table className=" w-full max-h-[70vh] h-[60vh] overflow-y-scroll text-left">
        <thead className="bg-active sticky top-12 z-10 text-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className="capitalize select-none px-3.5 py-2 border-r-2 border-background"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {
                    {
                      asc: (
                        <FontAwesomeIcon
                          icon={faSortUp}
                          className="ml-2"
                          color="#fff"
                        />
                      ),
                      desc: (
                        <FontAwesomeIcon
                          icon={faSortDown}
                          className="ml-2"
                          color="#fff"
                        />
                      ),
                    }[header.column.getIsSorted() ?? null]
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="w-full h-auto">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row._id}
                className={`h-10
                  ${i % 2 === 0 ? "bg-gray-300" : "bg-gray-200"}
                  `}
                onClick={() => {
                  setProductData(null);

                  setProductData(
                  dataQuery?.data?.data?.products.find(
                  (obj) => obj._id === row.original._id
                  )
                  ),
                  toggleSideBar("edit-product")
                }}
              >
                {row.getVisibleCells().map(
                  (cell) => (
                    console.log(cell.column.getSize()),
                    (
                      <td
                        id="cell"
                        key={cell._id}
                        className="px-2.5 py-1.5 truncate hover:overflow-visible max-w-32"
                        data={cell.getValue() || "No data"}
                        style={{ position: "relative" }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  )
                )}
              </tr>
            ))
          ) : dataQuery.isLoading ? (
            <tr className="text-center h-32 overflow-hidden">
              <td colSpan={12}>
                <Loading size="3x" />
              </td>
            </tr>
          ) : (
            <tr className="text-center h-32">
              <td colSpan={12}>
                <p>No Product Found!</p>
                <p
                  onClick={() => {
                    if (window) {
                      window.location.reload();
                    }
                  }}
                >
                  Refresh
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* pagination */}
      <div className="flex items-center justify-end mt-2 gap-2">
        <button
          onClick={() => {
            table.previousPage();
          }}
          disabled={pagination.pageIndex <= 1}
          className="p-1 border border-gray-500 px-2 disabled:opacity-30"
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            table.nextPage();
          }}
          disabled={
            pagination.pageIndex >=
            Math.ceil(
              dataQuery?.data?.meta?.totalProducts / pagination.pageSize
            )
          }
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {">"}
        </button>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {pagination.pageIndex} of{" "}
            {Math.ceil(
              dataQuery?.data?.meta?.totalProducts / pagination.pageSize
            ) || 0}
          </strong>
        </span>

        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 0;
              // table.setPageIndex(page);
              setPagination((prevPagination) => ({
                ...prevPagination,
                pageIndex: page,
              }));
            }}
            className="border p-1 rounded w-16 bg-transparent"
          />
        </span>
        <select
          value={pagination.pageSize}
          onChange={(e) => {
            // table.setPageSize(Number(e.target.value));
            setPagination((prevPagination) => ({
              ...prevPagination,
              pageIndex: 1,
              pageSize: e.target.value,
            }));
          }}
          className="p-2 bg-transparent"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TanStackTable;

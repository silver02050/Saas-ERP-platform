"use client";
import React, { Suspense, useEffect, useState } from "react";
// import Chart from "react-apexcharts";

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";
import { useBranchDataFetch } from "@/hooks/useBranchDataFetch";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useBranchFetch } from "@/hooks/useBranchFetch";
import { Dropdown } from "flowbite-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getProduct } from "@/lib/fetch/Product";
import { getStaff } from "@/lib/fetch/staff";
import Card from "./Card";

const Branch = () => {
  const queryClient = useQueryClient();
  const { user, error, isLoading } = useUser();

  const [totalRecords, setTotalRecords] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const [search, setSearch] = useState("");

  const {
    data: branchData,
    isLoading: fetchingBranch,
    error: errorInFetchBranch,
    isSuccess,
  } = useBranchFetch(user?.email);
  console.log("🚀 ~ DashBoard ~ branchData:", branchData);

  const [selectedBranch, setSelectedBranch] = useState(
    branchData?.data?.branch?.companyName || ""
  );
  const [selectedBranchID, setSelectedBranchID] = useState(
    branchData?.meta?.branchId || ""
  );

  const {
    data,
    isLoading: fetchingBranchData,
    error: errorInFetchBranchdData,
  } = useBranchDataFetch(branchData?.data?.branch?._id);

  useEffect(() => {
    if (!isLoading && !user) {
      return redirect("/login");
    }
  }, [user, isLoading]);

  useEffect(() => {
    const refetch = async () => {
      await queryClient.refetchQueries({
        queryKey: "dashboardData",
        type: "active",
        exact: true,
      });
    };
    refetch();
  }, [queryClient, branchData]);

  useEffect(() => {
    if (branchData && branchData.data && branchData.data.branch) {
      setSelectedBranch(branchData.data.branch.companyName);
      setSelectedBranchID(branchData.meta.branchId);
    }
  }, [branchData, branchData?.data?.branch?.companyName]);

  //// REFETCH when required data changes
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
    if (data?.data?.dashboardData && selectedBranch) {
      const branchData = data.data.dashboardData[selectedBranch];
      const dailyData = data.data.dailyData[selectedBranch];
      console.log("🚀 ~ useEffect ~ dailyData[0]?.totalPrices:", dailyData[0]);

      if (branchData) {
        const totalRecords = Object.values(branchData).map(
          (data) => data.totalRecords || 0
        );
        console.log("🚀 ~ useEffect ~ totalRecords:", totalRecords);

        setTotalRecords(totalRecords);
        setTotalRevenue(dailyData[0]?.totalPrices);
        setTotalSales(dailyData[0]?.totalQuantities);
      }
    }
  }, [data?.data?.dailyData, data?.data?.dashboardData, selectedBranch]);

  const dataQuery = useQuery({
    // gcTime: 24 * 24 * 60 * 60 * 1000,
    queryKey: ["searchProductData", search],
    queryFn: () => getProduct(selectedBranchID, 1, 9999, search),
    // placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });

  const staffData = useQuery({
    gcTime: 24 * 24 * 60 * 60 * 1000,
    queryKey: ["staffData"],
    queryFn: () => getStaff(selectedBranchID, 1, 99999),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });
  console.log("🚀 ~ Branch ~ staffData:", staffData);

  useEffect(() => {
    const refetch = async () => {
      await queryClient.refetchQueries({
        queryKey: ["searchProductData"],
        type: "active",
        exact: true,
      });
      await queryClient.refetchQueries({
        queryKey: ["staffData"],
        type: "active",
        exact: true,
      });
    };
    console.log("🚀 ~ Branch ~ search:", search?.length);

    if (search?.length == 0) {
      refetch();
    }
  }, [queryClient, branchData, selectedBranch, search]);

  const columns = [
    {
      accessorKey: "no",
      id: "no",
      cell: (info) => <span>{info.row.index + 1}</span>,
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
      accessorFn: (row) => row.price,
      id: "price",
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.quantity,
      id: "quantity",
      cell: (info) => info.getValue(),
    },
  ];

  const table = useReactTable({
    // data: dataQuery.data?.data?.products,
    data: dataQuery?.data?.data?.products ?? [],
    columns,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    manualPagination: true,
  });

  var colChartOption = {
    series: [
      {
        name: "Sales",
        data: totalRecords,
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "Sales",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " MMK";
        },
      },
    },
  };
  return (
    <div className="w-full min-h-[80vh] h-auto flex flex-col content-center drop-shadow-md shadow-md shadow-secondary rounded-lg p-5">
      {/* <Suspense fallback={<Loading size="3x" />}> */}
      <div id="firstRow" className="w-full h-1/2 flex items-start">
        {isLoading || fetchingBranch || fetchingBranchData ? (
          <Loading size="5x" />
        ) : null}

        <Chart
          options={colChartOption}
          series={colChartOption.series}
          type="bar"
          height={400}
          className="w-auto flex-grow"
        />
        <div
          id="firstRowSecCol"
          className="min-w-52 w-auto h-auto min-h-80 flex flex-col justify-start gap-2"
        >
          <Dropdown
            label={selectedBranch || "Select branch"}
            class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex justify-center"
          >
            <Dropdown.Item
              className={` z-40 ${
                selectedBranch == branchData?.data?.branch.companyName
                  ? "text-blue-600"
                  : ""
              }`}
              onClick={() => {
                setSelectedBranch(branchData?.data?.branch.companyName);
                setSelectedBranchID(branchData?.data?.meta?.branchId);
              }}
            >
              {branchData?.data?.branch.companyName}
            </Dropdown.Item>
            {branchData?.data?.branch?.childBranch?.map((branch, index) => {
              return (
                <Dropdown.Item
                  className={`${
                    selectedBranch == branch.companyName ? "text-blue-600" : ""
                  }`}
                  key={index}
                  onClick={() => {
                    setSelectedBranch(branch.companyName);
                    setSelectedBranchID(branch._id);
                  }}
                >
                  {branch.companyName}
                </Dropdown.Item>
              );
            })}
          </Dropdown>
          <input
            type="search"
            id="branchSearch"
            className="block p-2 h-10 w-full focus:outline-none text-sm text-gray-900 bg-gray-50 rounded-lg border border-primary"
            placeholder={`Search products in ${selectedBranch}`}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            required
          />
          <div
            id="cards"
            className="w-full flex flex-col justify-between h-auto"
          >
            <Card
              color="green-400"
              title="Revenue"
              timeFrame="Today"
              value={totalRevenue}
            />
            <Card
              color="yellow-400"
              title="Sales"
              timeFrame="Today"
              value={totalSales}
            />
          </div>
        </div>
      </div>{" "}
      <div id="secRow" className="w-full flex border-t-2 border-blue-600">
        <div id="secRowFirstCol" className="w-1/2">
          {staffData?.data?.data?.staffs?.map((staff) => {
            return (
              <div
                id="staff"
                className="grid grid-cols-3 gap-2 h-12 border-b-2 border-primary items-center"
                key={staff?._id}
              >
                <div className="ml-2 col-span-2">{staff.name}</div>
                <div>{staff.position}</div>
              </div>
            );
          })}{" "}
        </div>
        <div id="secRowSecCol products" className="w-1/2">
          <table className=" w-full max-h-[70vh] overflow-y-scroll text-sm text-left">
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

                      console.log(
                        "🚀 ~ TanStackTable ~ info:",
                        row.original._id,
                        setProductData(
                          dataQuery?.data?.data?.products.find(
                            (obj) => obj._id === row.original._id
                          )
                        ),
                        toggleSideBar("edit-product")
                      ); //This will extract ID
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
                <tr className="text-center relative h-32 overflow-hidden">
                  <td colSpan={12}>
                    <Loading size="3x" />
                  </td>
                </tr>
              ) : dataQuery.isLoadingError ? (
                <tr className="text-center h-32">
                  <td colSpan={12}>
                    <p>No product found!</p>
                    <p>Search in search box</p>
                  </td>
                </tr>
              ) : (
                ""
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* </Suspense> */}
    </div>
  );
};

export default Branch;

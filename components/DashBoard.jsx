"use client";

import { DataContext } from "@/Context/DataContext";
import React, { Suspense, useContext, useEffect, useState } from "react";
// import Chart from "react-apexcharts";
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import Loading from "./Loading";
import { useBranchDataFetch } from "@/hooks/useBranchDataFetch";
import { useBranchFetch } from "@/hooks/useBranchFetch";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";


const DashBoard = () => {
  const queryClient = useQueryClient();
  const { user, error, isLoading } = useUser();
  console.log("🚀 ~ DashBoard ~ user:", user);

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [pieBranch, setPieBranch] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [series, setSeries] = useState([]);
  const [seriesForColChart, setSeriesForColChart] = useState([]);
  const [pieChartData, setPieChartData] = useState({
    salaries: 0,
    bonus: 0,
    revenue: 0,
  });

  //////////////////// REDIRECT TO LOGOUT if not USER
  useEffect(() => {
    if (!isLoading && !user) {
      return redirect("/login");
    }
  }, [user, isLoading]);

  //////////////////////

  const {
    data: branchData,
    isLoading: fetchingBranch,
    error: errorInFetchBranch,
    isSuccess,
  } = useBranchFetch(user?.email);
  console.log("🚀 ~ DashBoard ~ branchData:", branchData);

  const [selectedPieBranch, setSelectedPieBranch] = useState(
    branchData?.data?.branch?.companyName || ""
  );
  useEffect(() => {
    if (branchData && branchData.data && branchData.data.branch) {
      setSelectedPieBranch(branchData.data.branch.companyName);
    }
  }, [branchData, branchData?.data?.branch?.companyName]);

  const {
    data,
    isLoading: fetchingBranchData,
    error: errorInFetchBranchdData,
  } = useBranchDataFetch(branchData?.data?.branch?._id);

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
    const refetch = async () => {
      await queryClient.refetchQueries({
        queryKey: "dashboardData",
        type: "active",
        exact: true,
      });
    };
    refetch();
  }, [queryClient, branchData]);

  ///////////////////Chart Controller Start

  useEffect(() => {
    let branchNames = []; //This is for label in pie chart
    let serie = [];
    let colSeries = [];
    let revenue;

    const currentMonth = new Date().getMonth();

    for (const branchName in data?.data?.dashboardData) {
      const branch = data?.data?.dashboardData[branchName];
      const dashboardData = data?.data?.dashboardData;
      const selectedBranchData =
        dashboardData && dashboardData[selectedPieBranch];
      const piebranch = selectedBranchData && selectedBranchData[currentMonth];

      console.log("🚀 ~ useEffect ~ branch:", piebranch);

      const totalSales =
        Object?.values(branch).map((data) => data.totalSales) || 0;

      const totalRecords = Object.values(branch).map(
        (data) => data.totalRecords
      );

      revenue = totalSales;
      console.log("🚀 ~ useEffect ~ revenue:", revenue);

      let s = {
        name: branchName,
        data: totalSales,
      };
      let colSerie = {
        name: branchName,
        data: totalRecords,
      };
      branchNames.push(branchName);
      serie.push(s);
      colSeries.push(colSerie);
    }

    const branch = data?.data?.dashboardData[selectedPieBranch]?.[currentMonth];
    // const totalSales =
    // Object?.values(branch).map((data) => data.totalSales) || 0;
    revenue = branch?.totalSales;
    console.log("🚀 ~ useEffect ~ revenue:", revenue);

    // console.log("🚀 ~ useEffect ~ totalSales:", totalSales)
    setPieChartData((prevPieChartData) => ({
      ...prevPieChartData,
      revenue: revenue || 0,
    }));
    setPieBranch(branchNames);
    setSeries(serie);
    setSeriesForColChart(colSeries);
  }, [
    branchData,
    data?.data?.dashboardData,
    data?.data?.staffData,
    selectedPieBranch,
  ]);

  useEffect(() => {
    const chartController = () => {
      if (data == null) {
        // return;
      }
      console.log(
        "🚀 ~ chartController ~ data?.data?.staffData:",
        data?.data?.staffData
      );

      setPieChartData((prevPieChartData) => ({
        ...prevPieChartData,
        salaries:
          data?.data?.staffData[selectedPieBranch]?.["0"]?.totalSalary || 0,
        bonus: data?.data?.staffData[selectedPieBranch]?.["0"]?.totalBonus || 0,
        // revenue: revenue || 0,
      }));
    };

    chartController();
  }, [data, pieBranch, revenue, selectedPieBranch]);
  console.log("🚀 ~ DashBoard ~ pieBranch:", pieBranch);

  ///////////////////Chart Controller End

  // console.log("🚀 ~ DashBoard ~ months:", months);

  var chartOptions = {
    chart: {
      type: "area",
    },
    yaxis: {
      title: {
        text: "Branch Revenue",
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.2,
        opacityTo: 0.5,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },

    xaxis: {
      categories: months,
      // categories: chartMonths,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " MMK";
        },
      },
    },
  };

  var colChartOption = {
    series: seriesForColChart,

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
        text: "Customers",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " Products sold";
        },
      },
    },
  };

  var pieOptions = {
    chart: {
      type: "donut",
    },
    series: [pieChartData.salaries, pieChartData.bonus, pieChartData.revenue],
    labels: ["Salaries", "Bonus", "Revenue"],
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          labels: {
            show: true,
          },
        },
      },
    },
  };
  return (
    <Suspense fallback={<Loading size="3x" />}>
      <div className="w-full h-full ">
        <div
          id="chart"
          className="drop-shadow-md shadow-md shadow-secondary rounded-lg p-5 select-none"
        >
          {isLoading || fetchingBranch || fetchingBranchData && (<Loading size="5x" />)}

          <div id="firstRow" className="w-full flex items-start">
            <div id="firstCol" className="w-full">
              {" "}
              <Chart
                options={chartOptions}
                series={series}
                // series={chartOptions.series}
                type={chartOptions.chart.type}
                height={320}
                className="w-full "
              />
            </div>
          </div>

          <div id="secondRow" className="flex items-center">
            <div
              id="firstCol"
              className="w-2/5 border-r-2 border-primary relative"
            >
              <Chart
                options={pieOptions}
                series={pieOptions.series}
                type={pieOptions.chart.type}
                // width={700}
                height={500}
                className="mt-5 max-h-72"
              />
              <ul className="flex flex-col gap-2 absolute bottom-0">
                {pieBranch &&
                  pieBranch.map((branchName) => (
                    <li key={Math.random()}>
                      <input
                        type="radio"
                        id={branchName}
                        name="branch"
                        value={branchName}
                        className="hidden peer"
                        onChange={(e) => {
                          setSelectedPieBranch(e.target.value);
                          console.log(selectedPieBranch);
                        }}
                        // required
                      />
                      <label
                        for={branchName}
                        className={`inline-flex items-center justify-between w-auto p-2 py-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 ${
                          selectedPieBranch === branchName
                            ? "border-blue-600 text-blue-600"
                            : ""
                        }`}
                      >
                        <div className="block">
                          <div className="w-full text-sm font-semibold">
                            {branchName}
                          </div>
                        </div>
                      </label>
                    </li>
                  ))}
              </ul>

              <span className=" absolute bottom-1 right-2">
                Monthly overview
              </span>
            </div>
            <div id="secCol" className="w-2/3 max-h-[300px]">
              {" "}
              <Chart
                options={colChartOption}
                series={colChartOption.series}
                type="bar"
                height={320}
              />
            </div>
          </div>
        </div>
        {/* <ExcelHandler /> */}
      </div>
    </Suspense>
  );
};

export default DashBoard;

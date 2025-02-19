"use client";
import { DataContext } from "@/Context/DataContext";
import { useBranchFetch } from "@/hooks/useBranchFetch";
import { getBranch } from "@/lib/fetch/Branch";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useContext, useEffect } from "react";
import Loading from "./Loading";
import { useQueryClient } from "@tanstack/react-query";
import { ElfsightWidget } from "react-elfsight-widget";
const Setting = () => {
  const queryClient = useQueryClient();

  const { user, error, isLoading } = useUser();
  const { branchData, setBranchData, isOpen, toggleSideBar } =
    useContext(DataContext);

  const {
    data,
    isLoading: fetchingBranch,
    error: errorInFetchBranch,
    isSuccess,
  } = useBranchFetch(user?.email);
  // console.log("🚀 ~ Setting ~ react query data:", data);
  // console.log("🚀 ~ Setting ~ errorInFetchBranch:", errorInFetchBranch);
  // console.log("🚀 ~ Setting ~ fetchingBranch:", fetchingBranch);
  // console.log("🚀 ~ Setting ~ isSuccess:", isSuccess);

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

  //////////////////// REDIRECT TO LOGOUT if not USER
  useEffect(() => {
    if (!isLoading && !user) {
      return redirect("/login");
    }
  }, [user, isLoading]);

  //////////////////////

  return (
    <div className="w-full h-full">
      <ElfsightWidget widgetID="37253bd0-8f3f-4ad0-b767-14378fccb86c" />

      {user && (
        <div
          id="user"
          className="flex flex-col group focus-within: transition-all absolute top-50 right-10 hover:block content-end w-max ml-auto mr-7 gap-3 px-4 py-2 pr-7 rounded-lg bg-background shadow-md shadow-secondary"
        >
          <div className="max-w-lg mx-auto">
            <details className=" outline-none ring-0">
              <summary className="flex gap-2 items-center justify-end text-sm leading-6 text-slate-900 ring-0 font-semibold select-none">
                <Image
                  width={40}
                  height={40}
                  className="rounded-sm"
                  src={`${user?.picture}`}
                  alt="user-profile"
                />
                <p className="font-bold my-2 text-lg text-active">
                  {user?.name}
                </p>
              </summary>
              <div className="mt-3 leading-6 text-active text-md font-semibold">
                <p>Email: {user?.email}</p>
              </div>
            </details>
          </div>
        </div>
      )}

      {user && (
        <div
          id="settings"
          className="flex mt-20 justify-evenly w-full h-auto min-h-[75vh] p-5"
        >
          <div id="leftCol" className="w-2/3 p-3 border-r-2 border-active">
            <div id="editDetails" className="w-full h-[75%]">
              <span className="font-bold my-2 text-3xl text-active">
                Setting
              </span>
              {data?.data?.branch ? (
                <div id="info" className=" max-w-[500px] grid grid-cols-2 mt-5">
                  <span className="font-bold my-2 text-xl text-active">
                    Company Name:
                  </span>
                  <span className="font-bold my-2 text-xl text-active">
                    {data.data.branch.companyName}
                  </span>{" "}
                  <span className="font-bold my-2 text-xl text-active">
                    Country:
                  </span>
                  <span className="font-bold my-2 text-xl text-active">
                    {data.data.branch.countryName}
                  </span>{" "}
                  <span className="font-bold my-2 text-xl text-active">
                    State:
                  </span>
                  <span className="font-bold my-2 text-xl text-active">
                    {data.data.branch.stateName}
                  </span>{" "}
                  <span className="font-bold my-2 text-xl text-active">
                    City:
                  </span>
                  <span className="font-bold my-2 text-xl text-active">
                    {data.data.branch.cityName}
                  </span>{" "}
                  <span className="font-bold my-2 text-xl text-active">
                    Street:
                  </span>
                  <span className="font-bold my-2 text-xl text-active">
                    {data.data.branch.streetName}
                  </span>{" "}
                  <span className="font-bold my-2 text-xl text-active">
                    Website:
                  </span>
                  <span className="font-bold my-2 text-xl text-active">
                    {data.data.branch.websiteUrl}
                  </span>{" "}
                  <span className="font-bold my-2 text-xl text-active">
                    Email:
                  </span>
                  <span className="font-bold my-2 text-xl text-active">
                    {data.data.branch.branchEmail}
                  </span>{" "}
                  <span className="font-bold my-2 text-xl text-active">
                    Phone:
                  </span>
                  <span className="font-bold my-2 text-xl text-active">
                    {data.data.branch.phone}
                  </span>
                </div>
              ) : fetchingBranch ? (
                <div className="w-full h-1/2 flex justify-center items-center">
                  <Loading size="2x" />
                </div>
              ) : errorInFetchBranch ? (
                <div className="w-full h-1/2 flex justify-center items-center">
                  <p className="font-bold text-xl text-active">
                    Branch Doesn&apos;t Created yet
                  </p>
                </div>
              ) : (
                <></>
              )}
              <div className="w-full flex">
                {" "}
                <button
                disabled={!user || !data}
                  className="bg-active text-background ml-auto text-sm p-2.5 px-3 my-5 rounded-lg font-bold"
                  onClick={() =>
                    toggleSideBar(
                      data?.data?.branch ? "edit-branch" : "create-branch"
                    )
                  }
                >
                  {data?.data?.branch ? "Edit info" : "Create branch"}
                </button>
              </div>
            </div>
            {/* <div id="downloadData" className="w-full h-[15%] ">
              <button className="w-full h-full border-2 text-3xl text-primary border-active border-dashed rounded-lg cursor-pointer">
                Download all data
              </button>
            </div> */}
          </div>
          <div
            id="rightCol"
            className="w-1/3 h-[75vh] flex flex-col justify-center items-center p-3 "
          >
            <p>AI Suggestion</p>
            <p>(Avaliable in future.)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;

"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import React, { useContext, useEffect } from "react";
import { ExcelHandler } from "../components/ExcelHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { DataContext } from "@/Context/DataContext";
import { useBranchFetch } from "@/hooks/useBranchFetch";
import dateFormat from "dateformat";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteKey, getActivitiesLogs, removeBranch } from "@/lib/fetch/Branch";
import Loading from "./Loading";
import { ElfsightWidget } from "react-elfsight-widget";

// TODO Adding same branch

const Admin = () => {
  const queryClient = useQueryClient();

  const { user, error, isLoading } = useUser();

  const { data, isOpen, toggleSideBar, setFormMode } = useContext(DataContext);

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [id, setId] = useState("");

  const {
    data: branchData,
    isLoading: fetchingBranch,
    error: errorInFetchBranch,
    isSuccess,
  } = useBranchFetch(user?.email);
  // console.log("🚀 ~ Admin ~ branchData:", branchData);

  const activitiesData = useQuery({
    gcTime: 24 * 24 * 60 * 60 * 1000,
    queryKey: ["activities"],
    queryFn: () => getActivitiesLogs(branchData.meta.branchId),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });
  // // console.log("🚀 ~ Admin ~ activitiesData:", activitiesData);

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
        queryKey: "activities",
        type: "active",
        exact: true,
      });
    };
    refetch();
  }, [queryClient, branchData]);

  //////////////////// REDIRECT TO LOGOUT if not USER
  useEffect(() => {
    if (!isLoading && !user) {
      return redirect("/login");
    }
  }, [user, isLoading]);

  //////////////////////

  const deleteKeyMutation = useMutation({
    mutationFn: async (d) => deleteKey(d),

    onSuccess: async () => {
      console.log("Invalidating branchData");
      await queryClient.invalidateQueries("branchData");
      await queryClient.refetchQueries({
        queryKey: "branchData",
        type: "active",
        exact: true,
      });
      // window.location.reload();
    },
  });

  const removeBranchMutation = useMutation({
    mutationFn: async (d) => removeBranch(d),

    onSuccess: async () => {
      console.log("Invalidating branchData");
      await queryClient.invalidateQueries("branchData");
      await queryClient.refetchQueries({
        queryKey: "branchData",
        type: "active",
        exact: true,
      });
      // window.location.reload();
    },
  });

  const deleteKeyFn = (id) => {
    const d = {
      _id: id,
      branchId: branchData.data.branch._id,
    };
    console.log("RANNNNNNNNNNNN");
    deleteKeyMutation.mutate(d);
  };

  const removeBranchFn = (id) => {
    const d = {
      _id: id,
      branchId: branchData.data.branch._id,
    };
    console.log("RANNNNNNNNNNNN");
    removeBranchMutation.mutate(d);
  };

  return (
    <div>
      {" "}
      <ElfsightWidget widgetID="37253bd0-8f3f-4ad0-b767-14378fccb86c" />
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this{" "}
              {modalMode == "key" ? "key" : "branch"}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  if (modalMode == "key") {
                    deleteKeyFn(id); ///ID of branch that pretend to delete
                  } else if (modalMode == "branch") {
                    console.log(modalMode);
                    removeBranchFn(id);
                  } else {
                    console.log("ERROR");
                  }
                  setOpenModal(false);
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div id="userBaner" className="mb-3 h-14 ">
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
                  <p className="font-bold text-lg text-active">{user?.name}</p>
                </summary>
                <div className="mt-3 leading-6 text-active text-md font-semibold">
                  <p>Email: {user?.email}</p>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>{" "}
      <div className="w-full min-w-[70vw] min-h-[80vh] flex">

        <div id="left_col" className=" w-3/4 flex flex-col justify-start">
          <div id="first_row" className="w-full h-2/3">
            <div id="keys" className="active">
              <span className="font-bold text-3xl text-active">
                KEYS{" "}
                <span
                  title="Connect to parent branch."
                  className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full "
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Icon description</span>
                </span>
              </span>
              {branchData?.data?.branch?.keys?.map((key) => {
                return (
                  <div
                    id="key"
                    className="grid grid-cols-10 grid-rows-1 gap-2 h-12 border-b-2 border-primary items-center"
                    key={key.name}
                  >
                    <div className="ml-2 truncate col-span-2">{key.name}</div>
                    <div className="truncate col-span-3 px-2 py-1 shadow-inner font-semibold shadow-[#aaaa] rounded-lg">
                      {key.key}
                    </div>

                    <div className=" col-span-3">{key.description}</div>
                    <div className="text-sm ">
                      {dateFormat(key.createdTime, "paddedShortDate")}
                    </div>

                    <div className=" grid justify-end">
                      <button
                        className="w-10 h-auto"
                        onClick={() => {
                          setModalMode("key");
                          setOpenModal(true);
                          setId(key?._id);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEllipsis}
                          height={22}
                          width={22}
                          alt="threeDots"
                          className="mr-2"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="w-full flex">
                {" "}
                <button
                  className="bg-active text-background ml-auto text-sm p-2.5 px-3 my-5 rounded-lg font-bold"
                  onClick={() => toggleSideBar("add-key")}
                >
                  Generate new keys
                </button>
              </div>
            </div>
            {isLoading || fetchingBranch ? (<div className="w-full h-20 relative"><Loading size="4x" /></div>) : null}

            <div id="branches" className="mt-3 pb-5">
              <span className="font-bold text-3xl text-active">Branches</span>
              {branchData?.data?.branch?.childBranch?.map((branch, index) => {
                return (
                  <div
                    id="key"
                    className="grid grid-cols-6 gap-2 h-12 border-b-2 border-primary items-center"
                    key={index}
                  >
                    <div className="ml-2 col-span-2">{branch.companyName}</div>
                    <div>{branch.phone}</div>
                    <div className="col-span-2">{branch.cityName}</div>
                    <div className=" grid justify-end">
                      <button
                        className="w-10 h-auto"
                        onClick={() => {
                          setModalMode("branch");
                          setOpenModal(true);
                          setId(branch?._id);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEllipsis}
                          height={22}
                          width={22}
                          alt="threeDots"
                          className="mr-2"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="w-full flex">
                {" "}
                <button
                  className="bg-active text-background ml-auto text-sm p-2.5 px-3 my-5 rounded-lg font-bold"
                  onClick={() => toggleSideBar("add-child-branch")}
                >
                  Add new branch
                </button>
              </div>
            </div>
          </div>

        </div>
        <div
          id="right_col"
          className="mx-7 px-3 w-1/4 max-w-[300px] min-h-[80vh] max-h-[95vh] border-l-2 border-active"
        >
          <span className="font-bold text-3xl text-active">Activities</span>{" "}
          <br />
          <br />
          {isLoading || fetchingBranch || activitiesData?.isLoading ? (<div className="relative mt-[12vh]"><Loading size="3x" /></div>) : null}
          {activitiesData?.data?.data?.activities?.map((activity) => {
            return (
              <details
                key={activity._id}
                className="outline-none ring-0 text-text mb-3"
              >
                <summary className="flex ring-0 select-none items-center">
                  <p className="font-semibold text-md">
                    {activity.process}
                    <FontAwesomeIcon
                      icon={faSortDown}
                      className="ml-2"
                      color="#0050C8"
                    />
                  </p>
                </summary>
                <div className="mt-1 ml-1 leading-6 text-md">
                  <p>
                    Time: {dateFormat(activity.timestamp, "d/m/yy - h:mm tt")}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;

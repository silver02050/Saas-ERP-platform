import { DataContext } from "@/Context/DataContext";
import { useBranchFetch } from "@/hooks/useBranchFetch";
import { addBranch, createBranch, generateKey, updateBranch } from "@/lib/fetch/Branch";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading";

export default function KeyAndNodeForm({ mode }) {
  const queryClient = useQueryClient()

  const [loading, setLoading] = useState(false)
  const { user, error } = useUser();
  const { branchData, setBranchData, isOpen, setIsOpen, toggleSideBar } =
    useContext(DataContext);

  const {
    data: branchDataFromUseBranchFetch,
    isLoading: fetchingBranch,
    error: errorInFetchBranch,
    isSuccess,
  } = useBranchFetch(user?.email);

  const generateKeyMutation = useMutation({
    mutationFn: async (d) => generateKey(d),

    onSuccess: async () => {
      console.log("Invalidating branchData");
      await queryClient.invalidateQueries("branchData");
      await queryClient.refetchQueries({
        queryKey: "branchData",
        type: "active",
        exact: true,
      });
      // window.location.reload();
      setLoading(false);
      setIsOpen(false);
    },
  });

  const addBranchMutation = useMutation({
    mutationFn: async (d) => addBranch(d),

    onSuccess: async () => {
      console.log("Invalidating branchData");
      await queryClient.invalidateQueries("branchData");
      await queryClient.refetchQueries({
        queryKey: "branchData",
        type: "active",
        exact: true,
      });
      // window.location.reload();
      setLoading(false);
      setIsOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isLoading, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true)
    const d = {
      _id: branchDataFromUseBranchFetch?.data?.branch?._id,
      ...data,
    };
    console.log("🚀 ~ onSubmit ~ d.data:", branchDataFromUseBranchFetch)
    console.log("🚀 ~ onSubmit ~ d:", d)

    if (mode == "key") {
      try {
        console.log(mode);
        generateKeyMutation.mutate(d);
      } catch (error) {
        console.log(error);
      }
    } else if (mode == "child") {
      try {
        console.log(mode);
        addBranchMutation.mutate(d);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col relative rounded-xl p-5 bg-[#eeeeee]"
    >
      <span className="font-bold text-3xl mb-5 text-active">
        {mode == "key" ? "Generate new key" : "Add sub-branch"}
      </span>

      {/* register your input into the hook by invoking the "register" function */}
      {loading && <Loading size="3x" classes="left-[42%] top-[35%]" />}

      {mode == "key" ? (
        <>
          <input
            className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
            placeholder="Name"
            type="text"
            {...register("name", { required: "Key name required." })}
          />
          {errors?.name && (
            <span className="text-warning font-medium">
              {errors?.name.message}
            </span>
          )}
          <input
            className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
            placeholder="Description"
            type="text"
            {...register("description", {
              required: "Description required. eg. Key for branch1",
            })}
          />
          {errors?.description && (
            <span className="text-warning font-medium">
              {errors?.description.message}
            </span>
          )}
        </>
      ) : (
        <>
          <input
            className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
            placeholder="Key"
            type="text"
            {...register("key", { required: "Key required." })}
          />
          {errors?.key && (
            <span className="text-warning font-medium">
              {errors?.key.message}
            </span>
          )}
        </>
      )}

      <button
        disabled={isLoading || isSubmitting || loading}
        className="bg-active text-background mx-auto text-sm p-2.5 px-3 my-5 rounded-lg font-bold"
        type="submit"
      >
        {mode == "key" ? "Generate" : "Add"}
      </button>
    </form>
  );
}

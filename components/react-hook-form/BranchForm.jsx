import { DataContext } from "@/Context/DataContext";
import { createBranch, updateBranch } from "@/lib/fetch/Branch";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading";

export default function BranchForm({ mode }) {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData("branchData");
  console.log("🚀 ~ BranchForm ~ data:", data);

  const { user, error } = useUser();
  const { branchData, isOpen, setIsOpen, setBranchData, toggleSideBar } =
    useContext(DataContext);

    const [loading, setLoading] = useState(false)

  const createBranchMutation = useMutation({
    mutationFn: async (d) => createBranch(d),

    onSuccess: async () => {
      console.log("Invalidating branchData");
      await queryClient.invalidateQueries("branchData");
      await queryClient.refetchQueries({
        queryKey: "branchData",
        type: "active",
        exact: true,
      });
      //window.location.reload();
      setLoading(false);
      setIsOpen(false);
    },
  });

  const editBranchMutation = useMutation({
    mutationFn: async (d) => updateBranch(d),

    onSuccess: async () => {
      console.log("Invalidating branchData");
      await queryClient.invalidateQueries("branchData");
      await queryClient.refetchQueries({
        queryKey: "branchData",
        type: "active",
        exact: true,
      });
      //window.location.reload();
      setLoading(false);
      setIsOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true)
    const d = {
      ...data,
      ...user,
    };

    if(mode == "edit" )
    {
      try {
        console.log(mode)
        editBranchMutation.mutate(d);
      } catch (error) {
        console.log(error);
      }
    } else if(mode == "create"){
      try {
        console.log(mode)
          createBranchMutation.mutate(d);
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
      <span className="font-bold text-3xl text-active">
        {mode == "edit" ? "Edit Branch" : "Create Branch"}
      </span>

      {/* register your input into the hook by invoking the "register" function */}
      {loading && <Loading size="3x" classes="left-[42%]" />}
      <input
        className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
        defaultValue={data?.data?.branch?.companyName}
        placeholder="Company Name"
        type="text"
        {...register("companyName", { required: "Company Name required." })}
      />
      {errors?.companyName && (
        <span className="text-warning font-medium">
          {errors?.companyName.message}
        </span>
      )}
      <input
        className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
        defaultValue={data?.data?.branch?.countryName}
        placeholder="Country Name"
        type="text"
        {...register("countryName", { required: "Country Name required." })}
      />
      {errors?.countryName && (
        <span className="text-warning font-medium">
          {errors?.countryName.message}
        </span>
      )}
      <input
        className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
        defaultValue={data?.data?.branch?.stateName}
        placeholder="State Name"
        type="text"
        {...register("stateName", { required: "State Name required." })}
      />
      {errors?.stateName && (
        <span className="text-warning font-medium">
          {errors?.stateName.message}
        </span>
      )}
      <input
        className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
        defaultValue={data?.data?.branch?.cityName}
        placeholder="City Name"
        type="text"
        {...register("cityName", { required: "City Name required." })}
      />
      {errors?.cityName && (
        <span className="text-warning font-medium">
          {errors?.cityName.message}
        </span>
      )}
      <input
        className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
        defaultValue={data?.data?.branch?.streetName}
        placeholder="Street Name"
        type="text"
        {...register("streetName", { required: "Street Name required." })}
      />
      {errors?.streetName && (
        <span className="text-warning font-medium">
          {errors?.streetName.message}
        </span>
      )}
      <input
        className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
        defaultValue={data?.data?.branch?.websiteUrl}
        placeholder="Website"
        type="url"
        {...register("websiteUrl")}
      />
      {errors?.websiteUrl && (
        <span className="text-warning font-medium">
          {errors?.websiteUrl.message}
        </span>
      )}
      <input
        className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
        defaultValue={data?.data?.branch?.branchEmail}
        placeholder="Email"
        type="email"
        {...register("branchEmail", { required: "Email required." })}
      />
      {errors?.branchEmail && (
        <span className="text-warning font-medium">
          {errors?.branchEmail.message}
        </span>
      )}
      <input
        className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
        defaultValue={data?.data?.branch?.phone}
        placeholder="Phone Number"
        type="tel"
        {...register("phone")}
      />

      {errors?.phone && (
        <span className="text-warning font-medium">
          {errors?.phone.message}
        </span>
      )}

      <button
        disabled={isLoading || isSubmitting || loading}
        className="bg-active text-background mx-auto text-sm p-2.5 px-3 my-5 rounded-lg font-bold"
        type="submit"
      >
        {mode == "edit" ? "Save" : "Create"}
      </button>
    </form>
  );
}

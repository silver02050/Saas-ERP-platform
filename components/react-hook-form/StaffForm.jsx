import { DataContext } from "@/Context/DataContext";
import { createBranch, updateBranch } from "@/lib/fetch/Branch";
import { createStaff, removeStaff, updateStaff } from "@/lib/fetch/staff";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Loading from "../Loading";

export default function BranchForm({ mode }) {

  const [loading, setLoading] = useState(false)
  const [staffToEdit, setStaffToEdit] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData("branchData");
  console.log("🚀 ~ BranchForm ~ data:", data);

  const { user, error } = useUser();
  const { productData, isOpen, setIsOpen, setProductData, toggleSideBar } =
    useContext(DataContext);
  useEffect(() => {
    setStaffToEdit(productData);
  }, [productData]);
  console.log("🚀 ~ ProductForm ~ staffToEdit:", staffToEdit);

  const createStaffMutation = useMutation({
    mutationFn: async (d) => createStaff(d),

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

  const editStaffMutation = useMutation({
    mutationFn: async (d) => updateStaff(d),

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
  
  const removeStaffMutation = useMutation({
    mutationFn: async (d) => removeStaff(d),

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

  const removeStaffFn = (id) => {
    const d = {
      _id: id,
    };
    console.log("RANNNNNNNNNNNN");
    removeStaffMutation.mutate(d);
  };

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
      _id: staffToEdit?._id,
      email: user.email,
    };
    console.log("🚀 ~ onSubmit ~ d:", d);

    if (mode == "edit") {
      try {
        console.log(mode);
        editStaffMutation.mutate(d);
      } catch (error) {
        console.log(error);
      }
    } else if (mode == "add") {
      try {
        console.log(mode);
        createStaffMutation.mutate(d);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <div className="h-[90vh] flex flex-col justify-between">
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
              Are you sure you want to remove this staff?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setLoading(true)
                  removeStaffFn(staffToEdit._id)
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col relative rounded-xl p-5 bg-[#eeeeee]"
      >
        <span className="font-bold text-3xl text-active">
          {mode == "edit" ? "Edit staff info" : "Add staff"}
        </span>

        {/* register your input into the hook by invoking the "register" function */}
        {loading && <Loading size="3x" classes="left-[42%] top-[40%] " />}

        <input
          className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
          defaultValue={staffToEdit?.name}
          placeholder="Name"
          type="text"
          {...register("name", { required: "Name required." })}
        />
        {errors?.name && (
          <span className="text-warning font-medium">
            {errors?.name.message}
          </span>
        )}
        <input
          className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
          defaultValue={staffToEdit?.position}
          placeholder="Position"
          type="text"
          {...register("position", { required: "Position required." })}
        />
        {errors?.position && (
          <span className="text-warning font-medium">
            {errors?.position.message}
          </span>
        )}
        <input
          className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
          defaultValue={staffToEdit?.phone}
          placeholder="Phone Number"
          type="tel"
          {...register("phone", { required: "Pnone required." })}
        />

        {errors?.phone && (
          <span className="text-warning font-medium">
            {errors?.phone.message}
          </span>
        )}
        <input
          className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
          defaultValue={staffToEdit?.address}
          placeholder="Address"
          type="text"
          {...register("address", { required: "Address required." })}
        />
        {errors?.address && (
          <span className="text-warning font-medium">
            {errors?.address.message}
          </span>
        )}
        <input
          className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
          defaultValue={staffToEdit?.salary}
          placeholder="Salary"
          type="number"
          {...register("salary", {
            min: 1,
            required: "Salary required.",
          })}
        />

        {errors?.salary && (
          <span className="text-warning font-medium">
            {errors?.salary.message}
          </span>
        )}
        <input
          className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
          defaultValue={staffToEdit?.bonus}
          placeholder="Bonus"
          type="number"
          {...register("bonus")}
        />

        <input
          className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
          defaultValue={staffToEdit?.dayOff}
          placeholder="Taken day off"
          type="number"
          {...register("dayOff")}
        />

        <button
          disabled={isLoading || isSubmitting || loading}
          className="bg-active text-background mx-auto text-sm p-2.5 px-3 my-5 rounded-lg font-bold"
          type="submit"
        >
          {mode == "edit" ? "Save" : "Add"}
        </button>
      </form>
      {mode == "edit" && (
        <div className="flex flex-col rounded-xl mb-5">
          <button disabled={loading} onClick={()=>{
            setOpenModal(true)
          }} className="p-3 font-semibold text-background rounded-lg bg-[#c22525] hover:bg-warning">
            Remove this staff
          </button>
        </div>
      )}
    </div>
  );
}

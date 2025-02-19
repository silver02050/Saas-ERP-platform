import { DataContext } from "@/Context/DataContext";
import { createProduct, sellProduct, updateProduct } from "@/lib/fetch/Product";
import { useUser } from "@auth0/nextjs-auth0/client";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading";

export default function ProductForm({ mode }) {
  const [productToEdit, setproductToEdit] = useState({});
  const [sellForm, setSellForm] = useState(true);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isLoading, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const [loading, setLoading] = useState(false)
  const { user, error } = useUser();
  const { productData, isOpen, setIsOpen, setProductData, toggleSideBar } =
    useContext(DataContext);

  useEffect(() => {
    setproductToEdit(null)
    setproductToEdit(productData);
  }, [productData]);
  console.log("🚀 ~ ProductForm ~ productData:", productData);
  console.log("🚀 ~ ProductForm ~ productToEdit:", productToEdit);


  useEffect(() => {
    setValue('name', productToEdit?.name || '');
    setValue('description', productToEdit?.description || '');
    setValue('category', productToEdit?.category || '');
    setValue('price', productToEdit?.price || '');
    setValue('quantity', productToEdit?.quantity || '');
    setValue('notes', productToEdit?.notes || '');
  }, [productToEdit, setValue]);

  const decreaseQuantity = () => {
    if (getValues("soldQuantity") > 1) {
      setValue("soldQuantity", parseInt(getValues("soldQuantity")) - 1);
    }
  };

  const increaseQuantity = () => {
    if (productData.quantity > getValues("soldQuantity")) {
      setValue("soldQuantity", parseInt(getValues("soldQuantity")) + 1);
    }
  };

  const createProductMutation = useMutation({
    mutationFn: async (d) => createProduct(d),

    onSuccess: async () => {
      console.log("Invalidating branchData");
      await queryClient.invalidateQueries("productData");
      await queryClient.refetchQueries({
        queryKey: "products",
        type: "active",
        exact: true,
      });
      // window.location.reload();
      setLoading(false);
      setIsOpen(false);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (d) => updateProduct(d),

    onSuccess: async () => {
      console.log("Invalidating branchData");
      await queryClient.invalidateQueries("productData");
      await queryClient.refetchQueries({
        queryKey: "productData",
        type: "active",
        exact: true,
      });
      // window.location.reload();
      setLoading(false)
      setIsOpen(false);
    },
  });

  const sellProductMutation = useMutation({
    mutationFn: async (d) => sellProduct(d),

    onSuccess: async () => {
      console.log("Invalidating branchData");
      await queryClient.invalidateQueries("productData");
      await queryClient.refetchQueries({
        queryKey: "productData",
        type: "active",
        exact: true,
      });
      // window.location.reload();
      setLoading(false)
      setIsOpen(false);
    },
  });

  const sell = async (data) => {
    console.log("🚀 ~ onSubmit ~ sellForm:", sellForm, "🚩", mode);
    setLoading(true)
    const d = {
      _id: productData._id,
      quantity :data.soldQuantity
    };

    try {
      console.log(mode);
      sellProductMutation.mutate(d);
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = async (data) => {
    console.log("🚀 ~ onSubmit ~ sellForm:", sellForm, "🚩", mode);
    setLoading(true)
    const d = {
      email: user.email,
      _id: productData?._id,
      ...data,
    };

    if (mode == "edit") {
      try {
        console.log(mode);
        updateProductMutation.mutate(d);
      } catch (error) {
        console.log(error);
      }
    } else if (mode == "add") {
      try {
        console.log(mode);
        createProductMutation.mutate(d);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      {mode == "edit" && (
        <ul className="grid w-full select-none gap-3 grid-cols-2 mb-4">
          <li>
            <input
              type="radio"
              id="sell"
              checked={sellForm}
              onChange={() => setSellForm(true)}
              name="formMode"
              value="formMode"
              className="hidden peer"
              required
            />
            <label
              for="sell"
              className="flex items-center  text-center justify-center w-full p-5 text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 "
            >
              <div className="block">
                <div className="w-full text-lg font-semibold">Sell</div>
              </div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              id="edit"
              onChange={() => setSellForm(false)}
              name="formMode"
              value="formMode"
              className="hidden peer"
            />
            <label
              for="edit"
              className="inline-flex items-center justify-center w-full p-5 text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 "
            >
              <div className="block">
                <div className="w-full capitalize text-lg font-semibold">
                  Edit
                </div>
              </div>
            </label>
          </li>
        </ul>
      )}

      {mode == "edit" && sellForm ? (
        <form
          id="form"
          onSubmit={handleSubmit(sell)}
          className="flex flex-col relative rounded-xl p-5 bg-[#eeeeee]"
        >
          <span className="font-bold text-3xl text-active">Sell</span>
          {loading && <Loading size="3x" classes="left-[42%] top-[40%] " />}

          <div className="w-full flex items-center justify-center">

            <input
              className="bg-gray-50 border mt-3 ml-1 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-l-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
              defaultValue="1"
              placeholder="Sold units"
              type="number"
              {...register("soldQuantity", {
                min: 1,
                required: "Product quantity required.",
              })}
            />
            <button
              onClick={() => increaseQuantity()}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-[11px] mt-2 "
            >
              <FontAwesomeIcon
                title="Add new products from excle."
                icon={faPlus}
                size="1x"
                color="#eee"
              />
            </button>

            <button
              onClick={() => decreaseQuantity()}
              type="button"
              className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-r-lg text-sm px-5 py-[11px] mt-2"
            >
              <FontAwesomeIcon
                title="Add new products from excle."
                icon={faMinus}
                size="1x"
                color="#eee"
              />
            </button>
          </div>{" "}
          {errors?.quantity && (
            <span className="text-warning font-medium">
              {errors?.quantity.message}
            </span>
          )}
          <textarea
            className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
            defaultValue={productToEdit?.sellNotes}
            placeholder="Note"
            type="text"
            {...register("sellNotes")}
          />
          <button
            disabled={isLoading || isSubmitting}
            className="bg-active text-background mx-auto text-sm p-2.5 px-3 my-5 rounded-lg font-bold"
            type="submit"
          >
            Save
          </button>
        </form>
      ) : (
        <form
          id="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col relative rounded-xl p-5 bg-[#eeeeee]"
        >
          <span className="font-bold text-3xl text-active">
            {mode == "edit" ? "Edit Product" : "Create Product"}
          </span>

          {loading && <Loading size="3x" classes="left-[42%]" />}

          {/* register your input into the hook by invoking the "register" function */}
          <input
            className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
            placeholder="Product Name"
            type="text"
            {...register("name", { required: "Product name required." })}
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
            {...register("description")}
          />

          <input
            className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
            placeholder="Category"
            type="text"
            {...register("category")}
          />

          <input
            className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
            placeholder="Price"
            type="number"
            {...register("price", {
              min: 1,
              required: "Product price required.",
            })}
          />

          {errors?.price && (
            <span className="text-warning font-medium">
              {errors?.price.message}
            </span>
          )}
          <input
            className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
            placeholder="Quantity"
            type="number"
            {...register("quantity", {
              min: 1,
              required: "Quantity required.",
            })}
          />

          {errors?.quantity && (
            <span className="text-warning font-medium">
              {errors?.quantity.message}
            </span>
          )}
          <textarea
            className="bg-gray-50 border mt-3 mb-1 border-gray-500 text-gray-900 text-md font-semibold rounded-lg focus:ring-primary focus:outline-none focus:border-primary block w-full p-2"
            placeholder="Note"
            type="text"
            {...register("notes")}
          />

          <button
            disabled={isLoading || isSubmitting || loading}
            className="bg-active text-background mx-auto text-sm p-2.5 px-3 my-5 rounded-lg font-bold"
            type="submit"
          >
            {mode == "edit" ? "Save" : "Create"}
          </button>
        </form>
      )}
    </>
  );
}

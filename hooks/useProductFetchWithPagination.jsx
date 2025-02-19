import { DataContext } from "@/Context/DataContext";
import { getProduct } from "@/lib/fetch/Product";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const useBranchFetch = ({page, skip}) => {
  const { setData } = useContext(DataContext);

  return useQuery({
    gcTime: 24 * 24 *60 * 60 * 1000,
    queryKey: ["productData"],
    retry: 10,
    queryFn: () => getProduct(email),
    onSuccess(data) {
        console.log("🚀 ~ onSuccess ~ sueBranch data:", data)
        //   setData(data);
    },
  });
};

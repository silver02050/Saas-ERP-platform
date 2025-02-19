import { DataContext } from "@/Context/DataContext";
import { getBranch } from "@/lib/fetch/Branch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";

export const useBranchFetch = (email) => {
  const { setBranchData } = useContext(DataContext);

  return useQuery({
    gcTime: 24 * 24 *60 * 60 * 1000,
    queryKey: "branchData",
    retry: 10,
    queryFn: () => getBranch(email),
    onSuccess(data) {
        console.log("🚀 ~ onSuccess ~ sueBranch data:", data)
        setBranchData(data);
    },
  });
};

import { DataContext } from "@/Context/DataContext";
import { getBranch, getBranchData } from "@/lib/fetch/Branch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";

export const useBranchDataFetch = (_id) => {
  const { setBranchData } = useContext(DataContext);

  return useQuery({
    gcTime: 24 * 24 *60 * 60 * 1000,
    queryKey: "dashboardData",
    retry: 10,
    queryFn: () => getBranchData(_id),
    onSuccess(data) {
        console.log("🚀 ~ onSuccess ~ useBranch data:", data)
        setBranchData(data);
    },
  });
};

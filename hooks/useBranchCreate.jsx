import { getBranch } from "@/lib/fetch/Branch";
import { useMutation } from "@tanstack/react-query";

export const useBranchCreate = (data) => {

  return useMutation({
    queryKey: "branchData",
    queryFn: () => getBranch(data),
    onSuccess(data) {
        console.log("🚀 ~ onSuccess ~ sueBranch data:", data)
        //   setData(data);
    },
  });
};

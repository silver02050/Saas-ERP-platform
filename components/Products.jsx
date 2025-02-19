"use client";

import React, { useContext } from "react";
import { DataContext } from "@/Context/DataContext";
import { redirect } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import TanStackTable from "./TanstackTable";

const Products = () => {
  const { user, error, isLoading } = useUser();

  const { branchData, setBranchData } = useContext(DataContext);
  
  if (error) {
    return redirect("/login");
  }
  return (
    <div>
      <TanStackTable />
    </div>
  );
};

export default Products;

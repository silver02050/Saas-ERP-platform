"use client";

import { DataContext } from "@/Context/DataContext";
import React, { useContext } from "react";
import RecordTable from "./RecordTable";

const Record = () => {
  const { data, setdata } = useContext(DataContext);
  return (
    <div className="w-full">
      <RecordTable />
    </div>
  );
};

export default Record;

"use client";
import { DataContext } from "@/Context/DataContext";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";

const AddNewProductBtn = ({mode}) => {
  const { setProductData, setBranchData, isOpen, toggleSideBar } =
    useContext(DataContext);
  return (
    <button
      onClick={() => {
        setProductData(null);
        toggleSideBar(mode);
      }}
    >
      {" "}
      <FontAwesomeIcon
        title="Add a new product."
        icon={faPlusSquare}
        size="2x"
        className="ml-2"
        color="#0050C8"
      />
    </button>
  );
};

export default AddNewProductBtn;

"use client";

import { createContext, useReducer, useState } from "react";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  // const [state, dispatch] = useReducer(reducer, { product: null });

  const [branchData, setBranchData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [formMode, setFormMode] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const toggleSideBar = (mode) => {
    setFormMode(mode);

    setIsOpen(!isOpen);
    console.log(isOpen);
    console.log("mc = " + formMode);
  };

  return (
    <DataContext.Provider
      value={{
        branchData,
        isOpen,
        formMode,
        productData,
        toggleSideBar,
        setProductData,
        setIsOpen,
        setBranchData,
        setFormMode,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

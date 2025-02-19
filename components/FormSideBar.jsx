"use client";

import { DataContext } from "@/Context/DataContext";
import { Drawer } from "flowbite-react";
import { useContext } from "react";
import BranchForm from "./react-hook-form/BranchForm";
import StaffForm from "./react-hook-form/StaffForm";
import ProductForm from "./react-hook-form/ProductForm";
import KeyAndNodeForm from "./react-hook-form/KeyAndNodeForm";

const FormSideBar = () => {
  const { isOpen, formMode,setIsOpen } = useContext(DataContext);
// console.log("mode = "+formMode)
  return (
    <>
      <Drawer className="min-w-[400px]  max-w-[500px] z-50" open={isOpen} onClose={()=>{setIsOpen(false)}} position="right">
        <Drawer.Header title="Drawer" />
        <Drawer.Items>
          {formMode === 'add-key' && <KeyAndNodeForm mode="key"/>}
          {formMode === 'add-child-branch' && <KeyAndNodeForm mode="child"/>}  
          {formMode === 'add-product' && <ProductForm mode="add"/>}
          {formMode === 'edit-product' && <ProductForm mode="edit"/>}
          {formMode === 'edit-staff' && <StaffForm mode="edit"/>}
          {formMode === 'add-staff' && <StaffForm mode="add"/>}
          {formMode === 'edit-branch' && <BranchForm mode = "edit"/>}
          {formMode === 'create-branch' && <BranchForm mode = "create"/>}
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default FormSideBar;

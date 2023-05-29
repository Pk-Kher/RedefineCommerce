/*Component Name: CheckBoxAction
Component Functional Details: User can create or update Create master details from here.
Created By: Shrey Patel
Created Date: 
Modified By: Shrey Patel
Modified Date: 06/01/2022 */

import React from "react";
import { useSelector } from "react-redux";

const CheckBoxAction = ({
  selectedFlatRows,
  setOpenDeleteModal,
  setSizeChart,
  ...rest
}) => {
  const permission = useSelector(store => store.permission);
  const handleonClick = () => {
    setOpenDeleteModal((prev) => !prev);
    setSizeChart(() => {
      return selectedFlatRows.map((row) => row.original);
    });
  };
  return (
    <>
      {permission?.isDelete && <div className="flex">
        <button
          className="text-xs btn-xs mx-1 bg-white border-rose-300 hover:border-rose-400 text-rose-500 flex items-center"
          onClick={handleonClick}
        >
          Delete
        </button>
      </div>}
    </>
  );
};

export default CheckBoxAction;

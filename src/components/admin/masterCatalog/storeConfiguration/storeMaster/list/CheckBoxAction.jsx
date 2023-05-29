import React from "react";
import { useSelector } from "react-redux";

function CheckBoxAction({
  selectedFlatRows,
  setOpenDeleteModal,
  setStore,
  ...rest
}) {
  const permission = useSelector(store => store.permission);
  const handleonClick = () => {
    setOpenDeleteModal((prev) => !prev);
    setStore(() => {
      return selectedFlatRows.map((row) => row.original);
    });
  };
  return (
    <>
      <div className="flex">
        {permission?.isDelete && <div className="left-full bg-white input-check w-64 items-center">
          {/* <button className="text-xs btn-xs mx-1 bg-white border-indigo-300 hover:border-indigo-400 text-indigo-500 flex items-center">
          Clone
        </button> */}
          {/*  <button className="text-xs btn-xs mx-1 bg-white border-indigo-300 hover:border-indigo-400 text-indigo-500 flex items-center">Inactive</button> */}
          <button
            className="text-xs btn-xs mx-1 bg-white border-rose-300 hover:border-rose-400 text-rose-500 flex items-center"
            onClick={handleonClick}
          >
            Delete
          </button>
        </div>}
      </div>
    </>
  );
}

export default CheckBoxAction;

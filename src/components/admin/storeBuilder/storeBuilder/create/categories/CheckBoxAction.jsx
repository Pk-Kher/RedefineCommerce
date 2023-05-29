import React from "react";

function CheckBoxAction({
  selectedFlatRows,
  setOpenDeleteModal,
  setCategory,
  ...rest
}) {
  const handleonClick = () => {
    setOpenDeleteModal((prev) => !prev);
    setCategory(() => {
      return selectedFlatRows.map((row) => row.original);
    });
  };
  return (
    <>
      <div className="flex">
        <button
          className="text-xs btn-xs mx-1 bg-white border-rose-300 hover:border-rose-400 text-rose-500 flex items-center"
          onClick={handleonClick}
        >
          Delete
        </button>
      </div>
    </>
  );
}

export default CheckBoxAction;

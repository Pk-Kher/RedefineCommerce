import { RecStatusValuebyName } from 'global/Enum';
import React from 'react';

function CheckBoxAction({ selectedFlatRows, setOpenDeleteModal, setUser }) {
  const handleonClick = () => {
    setOpenDeleteModal(prev => !prev);
    setUser(() => {
      return selectedFlatRows.map((row) => {
        return { ...row.original, changeStatus: RecStatusValuebyName.Archived }
      });
    });
  }
  return (
    <>
      <div className="flex">
        <button className="text-xs btn-xs mx-1 bg-white border-rose-300 hover:border-rose-400 text-rose-500 flex items-center" onClick={handleonClick}>Delete</button>
      </div>
    </>
  )
}

export default CheckBoxAction;
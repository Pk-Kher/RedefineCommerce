import React, { useEffect, useState } from "react";
import Transition from "utils/Transition";
import { RecStatusValuebyName } from "global/Enum";
import { set } from "date-fns";

const ConfirmDelete = ({
  data,
  message,
  title,
  openDeleteModal,
  setOpenDeleteModal,
  module,
  handleDelete,
  deleteButtonName,
  displayCancelButton,
  cancelButtonName,
  cancelButtonAction,
}) => {
  const [deleteInput, setDeleteInput] = useState("");
  const { Archived } = RecStatusValuebyName;
  const [deleteError, setDeleteError] = useState("");
  // esc hide modal
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!openDeleteModal || keyCode !== 27) return;
      setOpenDeleteModal(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
  useEffect(() => {
    setDeleteInput("");
  }, [openDeleteModal]);

  const deleteConfirmation = () => {
    if (deleteValidations() && handleDelete instanceof Function) {
      handleDelete(data);
      setOpenDeleteModal(false);
      setDeleteError("");
    }
  };
  const cancelFunction = () => {
    if (cancelButtonAction instanceof Function) {
      cancelButtonAction();
    }
    setOpenDeleteModal(false);
    setDeleteError("");
  };
  const deleteValidations = (e) => {
    if (deleteInput === "delete" && handleDelete instanceof Function) {
      setDeleteError("");
      return true;
    } else {
      setDeleteError('Please enter "delete" to delete this record.');
      return false;
    }
  }
  return (
    <>
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-95 z-50 transition-opacity"
        show={openDeleteModal}
        tag="div"
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        onClick={() => setOpenDeleteModal(false)}
      ></Transition>
      <Transition
        className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
        show={openDeleteModal}
        tag="div"
        id="basic-modal"
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div className="bg-white rounded shadow-lg overflow-auto max-w-lg w-full max-h-full">
          <div className="px-5 py-3 border-b border-neutral-200 bg-rose-500">
            <div className="flex justify-between items-center">
              <div className="font-bold text-white">{title}</div>
              <button
                className="text-white hover:text-gray-400"
                type="button"
                onClick={() => { setOpenDeleteModal(false); setDeleteError(""); }}
              >
                <div className="sr-only">Close</div>
                <svg className="w-4 h-4 fill-current">
                  <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="px-5 pt-4 pb-1">
            <div className="text-sm">
              <div className="space-y-2">
                <p className="mb-2">
                  {message
                    ? message
                    : `Deleting these ${module} will permanently remove this record from your account. This can't be undone`}
                </p>
                <p className="mb-2">
                  Type "<b>delete</b>" below to verify that you want to delete
                  this record.
                </p>
                <input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  name="delete"
                  className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                  type="text"
                  placeholder="delete"
                  onBlur={deleteValidations}
                />
                {deleteError !== '' ?
                  <p className="mb-2 text-red-500">
                    Please Type "<b>delete</b>" to verify that you want to delete this record.
                  </p> : ''}
              </div>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap justify-start space-x-2">
              <button
                type="button"
                onClick={deleteConfirmation}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {deleteButtonName ? deleteButtonName : "Delete"}
              </button>
              {(displayCancelButton === true ||
                displayCancelButton === undefined) && (
                  <button
                    className="btn border-gray-300 hover:border-neutral-400 text-gray-500"
                    onClick={() => cancelFunction()}
                  >
                    {cancelButtonName ? cancelButtonName : "Cancel"}
                  </button>
                )}
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default ConfirmDelete;

import React, { useState } from "react";
import { RecStatusValueName, RecStatusValuebyName } from "global/Enum";
import { useSelector } from "react-redux";

const TierActions = (props) => {
  const permission = useSelector(store => store.permission);
  const tierRow = props.tierRow;
  const handleShowModal = props.handleShowModal;
  const setOpenDeleteModal = props.setOpenDeleteModal;
  const setModalInfo = props.setModalInfo;

  return (
    <>
      {(permission?.isEdit || permission?.isDelete) && <div className="relative item-center">
        <button type="button"
          className="text-indigo-500"
          onClick={() => {
            handleShowModal(tierRow);
          }
          }
        >
          <span className="material-icons-outlined">edit</span>
        </button>
        {tierRow.original?.recStatus !== RecStatusValuebyName.Archived && (
          <button type="button"
            className="text-rose-500"
            onClick={() => {
              setModalInfo((prev) => {
                return {
                  ...prev,
                  data: {
                    ...tierRow.original,
                  },
                };
              });
              setOpenDeleteModal(true);
            }}
          >
            <span className="material-icons-outlined">close</span>
          </button>
        )}

      </div>}
    </>
  );
};

export default TierActions;

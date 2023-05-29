import React, { useCallback, useEffect, useState } from "react";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { useParams } from "react-router-dom";
import Actions from "./Actions";
import Status from "components/common/displayStatus/Status";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = ({
  setopenFeesModal,
  setFeesData,
  getFeesEditData,
  feesData,
  openFeesDeleteModal,
  setOpenFeesDeleteModal,
  setEditfeesData,
}) => {
  const [deleteData, setDeleteData] = useState(null);
  const dispatch = useDispatch();
  const { id } = useParams(); 

  const getFeesData = useCallback(() => {
    dispatch(setAddLoading(true));

    StoreBuilderService.getFeesInfo(id)
      .then((res) => {
        if (res.data.success) {
          setFeesData(res.data.data);
        }

        dispatch(setAddLoading(false));
      })
      .catch(() => {
        dispatch(setAddLoading(false));
      });
  }, []);

  const handleDelete = (fee) => {
    StoreBuilderService.deleteFeesInfo({ feesId: fee.id })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: "Fee deleted successfully",
            })
          );
          getFeesData();
          setOpenFeesDeleteModal(false);
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: "Fee is not deleted",
            })
          );
          setOpenFeesDeleteModal(false);
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    getFeesData();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="uppercase tracking-wide text-gray-500 text-lg font-bold">
          fee
        </div>
        <div>
          <span
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
            onClick={() => getFeesEditData.current(null)}
          >
            <span className="material-icons-outlined">add_circle_outline</span>{" "}
            <span className="ml-1">Add Fees </span>
          </span>
        </div>
      </div>
      <div className="mt-6">
        <div className="overflow-x-auto max-h-screen">
          <table className="table-auto w-full text-sm text-[#191919] font-semibold">
            <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200 border-t">
              <tr>
                <th className="px-2 first:pl-5 py-4">
                  <div className="font-semibold text-left max-w-max flex items-center">
                    Name
                  </div>
                </th>
                <th className="px-2 first:pl-5 py-4">
                  <div className="font-semibold text-left max-w-max flex items-center">
                    Type
                  </div>
                </th>
                <th className="px-2 first:pl-5 py-4">
                  Amount
                  <div className="font-semibold text-left max-w-max flex items-center"></div>
                </th>
                <th className="px-2 first:pl-5 py-4">
                  <div className="font-semibold text-left max-w-max flex items-center">
                    Status
                  </div>
                </th>
                <th className="px-2 first:pl-5 py-4">
                  <div className="font-semibold text-left max-w-max flex items-center"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {feesData && feesData.length > 0 ? (
                feesData.map((fee, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-2 first:pl-5 py-3">{fee?.name}</td>
                      <td className="px-2 first:pl-5 py-3">
                        {fee?.type === "1" ? "Percentage" : "Flat amount"}
                      </td>
                      <td className="px-2 first:pl-5 py-3">{fee?.amount}</td>
                      <td className="px-2 first:pl-5 py-3">
                        <Status type={fee?.recStatus} />
                      </td>
                      <td className="px-2 first:pl-5 py-3">
                        <Actions
                          id={fee?.id}
                          row={fee}
                          getFeesEditData={getFeesEditData}
                          setEditfeesData={setEditfeesData}
                          setDeleteData={setDeleteData}
                          setOpenFeesDeleteModal={setOpenFeesDeleteModal}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-4 text-rose-500 text-center" colSpan={5}>
                    <p>No Record Found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ConfirmDelete
            handleDelete={handleDelete}
            data={deleteData}
            message="Deleting this fee will permanently remove this record from your account. This can't be undone"
            title={"Delete"}
            openDeleteModal={openFeesDeleteModal}
            setOpenDeleteModal={setOpenFeesDeleteModal}
          />
        </div>
      </div>
    </>
  );
};

export default List;

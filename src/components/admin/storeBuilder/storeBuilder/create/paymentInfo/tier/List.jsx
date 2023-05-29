import React, { useCallback, useEffect, useState } from "react";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { useParams } from "react-router-dom";
import Actions from "./Actions";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = ({
  setopenTierModal,
  setTierData,
  getTierEditData,
  tierData,
  openTierDeleteModal,
  setOpenTierDeleteModal,
}) => {
  const { id } = useParams();
  const [deleteData, setDeleteData] = useState(null);
  const dispatch = useDispatch();

  const getTierData = useCallback(() => {
    dispatch(setAddLoading(true));

    StoreBuilderService.getTierInfo(id)
      .then((res) => {
        if (res.data.success) {
          setTierData(res.data.data);
        }

        dispatch(setAddLoading(false));
      })
      .catch(() => {
        dispatch(setAddLoading(false));
      });
  }, []);

  const handleDelete = (tier) => {
    StoreBuilderService.deleteTierShippingInfo({ id: tier.id })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: "Tier fee deleted successfully",
            })
          );
          getTierData();
          setOpenTierDeleteModal(false);
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: "Tier fee is not deleted",
            })
          );
          setOpenTierDeleteModal(false);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    getTierData();
  }, []);
  return (
    <>
      <div className="col-span-12">
        <div className="flex justify-between items-center">
          <div className="uppercase tracking-wide text-gray-500 text-lg font-bold"></div>
          <div>
            <span
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
              onClick={() => getTierEditData.current(null)}
            >
              <span className="material-icons-outlined">
                add_circle_outline
              </span>{" "}
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
                      Cart Amount From
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="font-semibold text-left max-w-max flex items-center">
                      Cart Amount To
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="font-semibold text-left max-w-max flex items-center">
                      Fee
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4">
                    <div className="font-semibold text-left max-w-max flex items-center"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {tierData && tierData.length > 0 ? (
                  tierData.map((tier, index) => {
                    return (
                      <tr key={index}>
                        <td className="px-2 first:pl-5 py-3">{tier?.name}</td>
                        <td className="px-2 first:pl-5 py-3">
                          {tier?.amountFrom}
                        </td>
                        <td className="px-2 first:pl-5 py-3">
                          {tier?.amountTo}
                        </td>
                        <td className="px-2 first:pl-5 py-3">{tier?.charge}</td>
                        <td className="px-2 first:pl-5 py-3">
                          <Actions
                            id={tier?.id}
                            row={tier}
                            getTierEditData={getTierEditData}
                            setDeleteData={setDeleteData}
                            setOpenTierDeleteModal={setOpenTierDeleteModal}
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
              message="Deleting this Tiered fee will permanently remove this record from your account. This can't be undone"
              title={"Delete"}
              openDeleteModal={openTierDeleteModal}
              setOpenDeleteModal={setOpenTierDeleteModal}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default List;

import React, { useCallback, useEffect, useState } from "react";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { useParams } from "react-router-dom";
import Actions from "./Actions";
import Status from "components/common/displayStatus/Status";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = ({
  setopenCouponModal,
  setCouponData,
  couponData,
  getCouponEditData,
  openCouponDeleteModal,
  setOpenCouponDeleteModal,
}) => {
  const { id } = useParams(); //Store ID
  const [deleteData, setDeleteData] = useState(null);
  const dispatch = useDispatch();

  const getCouponData = useCallback(() => {
    dispatch(setAddLoading(true));
    
    StoreBuilderService.getCouponInfo(id)
      .then((res) => {
        if (res.data.success) {
          setCouponData(res.data.data);
        }
        dispatch(setAddLoading(false))
      })
      .catch(() => {
        dispatch(setAddLoading(false))
      });
  }, []);

  const handleDelete = (coupon) => {
    dispatch(setAddLoading(true))

    StoreBuilderService.deleteCouponInfo({ id: coupon.id })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: "Coupon deleted successfully",
            })
          );
          getCouponData();
          setOpenCouponDeleteModal(false);
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: "Coupon is not deleted",
            })
          );
          setOpenCouponDeleteModal(false);
          dispatch(setAddLoading(false))
        }
      })
      .catch(() => {
        dispatch(setAddLoading(false))
      });
  };

  useEffect(() => {
    getCouponData();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="uppercase tracking-wide text-gray-500 text-lg font-bold">
          Coupons & Rebates
        </div>
        <div>
          <button
            type="button"
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={() => getCouponEditData.current(null)}
          >
            <span className="material-icons-outlined">add_circle_outline</span>{" "}
            <span className="ml-1">Add Coupons & Rebates </span>
          </button>
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
                  <div className="font-semibold text-left max-w-max flex items-center">
                    Amount
                  </div>
                </th>
                <th className="px-2 first:pl-5 py-4">
                  <div className="font-semibold text-left max-w-max flex items-center">
                    Coupon Codes
                  </div>
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
              {couponData && couponData.length > 0 ? (
                couponData.map((coupon, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-2 first:pl-5 py-3">{coupon?.name}</td>
                      <td className="px-2 first:pl-5 py-3">
                        {coupon?.type === 1 ? "Percentage" : "Flat amount"}
                      </td>
                      <td className="px-2 first:pl-5 py-3">{coupon?.amount}</td>
                      <td className="px-2 first:pl-5 py-3">
                        {coupon?.couponCodes}
                      </td>
                      <td className="px-2 first:pl-5 py-3">
                        <Status type={coupon?.recStatus} />
                      </td>
                      <td className="px-2 first:pl-5 py-3">
                        <Actions
                          id={coupon?.id}
                          row={coupon}
                          getCouponEditData={getCouponEditData}
                          setDeleteData={setDeleteData}
                          setOpenCouponDeleteModal={setOpenCouponDeleteModal}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-4 text-rose-500 text-center" colSpan={6}>
                    <p>No Record Found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ConfirmDelete
            handleDelete={handleDelete}
            data={deleteData}
            message="Deleting this coupon will permanently remove this record from your account. This can't be undone"
            title={"Delete"}
            openDeleteModal={openCouponDeleteModal}
            setOpenDeleteModal={setOpenCouponDeleteModal}
          />
        </div>
      </div>
    </>
  );
};

export default List;

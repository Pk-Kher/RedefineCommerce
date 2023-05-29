/*Component Name: DiscountDetail
Component Functional Details: User can create or update DiscountDetail master details from here.
Created By: Happy
Created Date: 31/5/22
Modified By: pradip kher
Modified Date: 6-17-2022 */

import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import axios from "axios";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { RecStatusValuebyName } from "global/Enum";
import DiscountDetailsService from "services/admin/quantityDiscount/DiscountDetailsService";
import ToggleButton from "components/common/formComponent/ToggleButton";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const DiscountDetail = ({ quantityId, isAddMode, setShowDetailModal, showDetailModal }) => {
  const permission = useSelector(store => store.permission);
  const [discountData, setDiscountData] = useState([]);
  const [editDiscountDetails, setEditDiscountDetails] = useState([]);
  const [discountDetailId, setDiscountDetailId] = useState(null);
  const [DetailData, setDetailData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const detailsIsAddMode = !discountDetailId;

  const getDiscountsDetails = useCallback(() => {
    if (!isAddMode) {
      dispatch(setAddLoading(true))

      DiscountDetailsService.getDiscountsDetail(quantityId, {
        pageIndex: 0,
        pageSize: 100,
        pagingStrategy: 0,
        sortingOptions: [
          {
            field: "lowQuantity",
            direction: 0,
            priority: 0,
          },
        ],
        filteringOptions: []
      })
        .then((response) => {
          if (response.data.success) {
            setDiscountData(response.data.data.items);
          }
          dispatch(setAddLoading(false))

        })
        .catch((err) => {
          dispatch(setAddLoading(false))

        });
    }
  }, [quantityId, isAddMode]);

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    if (!unmounted && quantityId) {
      getDiscountsDetails();
    }
    return () => {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, [quantityId, isAddMode, getDiscountsDetails]);

  const validationSchema = Yup.object({
    lowQuantity: Yup.number()
      .min(1, "LowQuantity must be greater then zero ")
      .typeError(ValidationMsgs.quantityDiscountDetail.lowQuantityTypeError)
      .required(ValidationMsgs.quantityDiscountDetail.lowQuantityRequired),
    highQuantity: Yup.number()
      .typeError(ValidationMsgs.quantityDiscountDetail.highQuantityTypeError)
      .required(ValidationMsgs.quantityDiscountDetail.highQuantityRequired).when('lowQuantity', (lowQuantity) => {
        if (lowQuantity) {
          return Yup.number()
            .min(lowQuantity, ValidationMsgs.quantityDiscountDetail.highQuantityMin)
        }
      }),
    discountPercent: Yup.number()
      .typeError(ValidationMsgs.quantityDiscountDetail.discountPercentTypeError)
      .max(100, ValidationMsgs.quantityDiscountDetail.discountPercentMax)
      .required(ValidationMsgs.quantityDiscountDetail.discountPercentRequired),
  });
  useEffect(() => {
    if (!showDetailModal) {
      setEditDiscountDetails([]);
    }
  }, [showDetailModal]);
  const onSubmit = (fields, { resetForm }) => {
    if (discountDetailId) {
      updateDiscountDetail(fields, resetForm);
    } else {
      createDiscountDetail(fields, resetForm);
    }
  };
  const editDetails = (id) => {
    dispatch(setAddLoading(true))

    setDiscountDetailId(id);
    DiscountDetailsService.getDiscountsDetailById(id)
      .then((response) => {
        if (response.data.success) {
          setEditDiscountDetails(response.data.data);
          setShowDetailModal((prev) => !prev);
        }
        dispatch(setAddLoading(false))

      })
      .catch(() => {
        dispatch(setAddLoading(false))

      });
  };
  const createDiscountDetail = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    DiscountDetailsService.createDiscountsDetail({
      quantityDiscountDetailModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.quantityDiscountDetail.quantityDiscountDetailCreated,
            })
          );
          resetForm({});
          setShowDetailModal(false);
          getDiscountsDetails();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          setShowDetailModal(true);
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.quantityDiscountDetail.quantityDiscountDetailNotCreated,
          })
        );
        setShowDetailModal(false);
        dispatch(setAddLoading(false))

      });
  };
  const updateDiscountDetail = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    DiscountDetailsService.updateDiscountsDetail({
      quantityDiscountDetailModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.quantityDiscountDetail.quantityDiscountDetailUpdated,
            })
          );
          getDiscountsDetails();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false))
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            message: ValidationMsgs.quantityDiscountDetail.quantityDiscountDetailNotUpdated,
            type: "danger",
          })
        );
        dispatch(setAddLoading(false))
      });
    setShowDetailModal((prev) => !prev);
  };
  const handleDelete = (quantityDetail) => {
    dispatch(setAddLoading(true))

    var ids = [];
    if (Array.isArray(quantityDetail)) {
      ids = quantityDetail.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: quantityDetail.id, item2: quantityDetail.rowVersion }];
    }
    DiscountDetailsService.updateMultipleStatus({
      args: {
        idsRowVersion: ids,
        status: RecStatusValuebyName.Archived,
        ...location,
      },
    }).then((response) => {
      if (response.data.data) {
        dispatch(
          setAlertMessage({
            view: true,
            type: "success",
            message: ValidationMsgs.quantityDiscountDetail.quantityDiscountDetailDeleted,
          })
        );
        getDiscountsDetails();
      } else {
        dispatch(
          setAlertMessage({ type: "danger", message: serverError(response) })
        );
        dispatch(setAddLoading(false))
      }
    }).catch((errors) => {

      dispatch(
        setAlertMessage({
          message: ValidationMsgs.quantityDiscountDetail.quantityDiscountDetailNotDeleted,
          type: "danger",
        })
      );
      dispatch(setAddLoading(false))
    });
    setOpenDeleteModal(false);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-full xl:col-span-9">
            <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
              <div className="w-full mb-6 last:mb-0">
                <div className="flex items-center justify-between p-6">
                  <label className="flex flex-wrap uppercase tracking-wide text-gray-500 text-base font-bold">
                    Quantity Discount
                  </label>
                  {(permission?.isEdit || permission?.isDelete) && <div >
                    <button
                      type="button"
                      title="Add"
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-500"
                      disabled={isAddMode}
                      onClick={() => {
                        setShowDetailModal((prev) => !prev);
                        setDiscountDetailId(null);
                      }}
                    >
                      <span className="material-icons-outlined">
                        add_circle_outline
                      </span>{" "}
                      <span className="ml-1">Add Quantity Discount</span>
                    </button>
                  </div>}
                </div>
                <div >
                  <div className="overflow-x-auto max-h-screen border-t border-neutral-200">
                    {discountData.length > 0 && (
                      <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                        <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200 border-t">
                          <tr>
                            <th className="px-2 first:pl-5 py-4">
                              <div className="font-semibold text-left max-w-max flex items-center">
                                <span>Low Quantity</span>
                              </div>
                            </th>
                            <th className="px-2 first:pl-5 py-4">
                              <div className="font-semibold text-left max-w-max flex items-center">
                                <span>High Quantity</span>
                              </div>
                            </th>
                            <th className="px-2 first:pl-5 py-4">
                              <div className="font-semibold text-left flex items-center">
                                <span>Discount Percent</span>
                              </div>
                            </th>

                            {(permission?.isEdit || permission?.isDelete) && <th className="px-2 first:pl-5 py-4">Action</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {discountData.map((values, index) => {
                            return (
                              <tr key={index}>
                                <td className="px-2 first:pl-5 py-3">
                                  {values.lowQuantity}
                                </td>
                                <td className="px-2 first:pl-5 py-3">
                                  {values.highQuantity}
                                </td>
                                <td className="px-2 first:pl-5 py-3">
                                  {values.discountPercent}%
                                </td>
                                {(permission?.isEdit || permission?.isDelete) && <td className="px-2 first:pl-5 py-3">
                                  <div className="relative text-center">
                                    <button
                                      type="button"
                                      title="Edit"
                                      className="text-indigo-500"
                                      onClick={editDetails.bind(
                                        null,
                                        values.id
                                      )}
                                    >
                                      <span className="material-icons-outlined">
                                        edit
                                      </span>
                                    </button>
                                    {(values.recStatus !==
                                      RecStatusValuebyName.Archived && permission?.isDelete) && (
                                        <button
                                          type="button"
                                          title="Delete"
                                          className="text-rose-500"
                                          onClick={() => {
                                            setDetailData(values);
                                            setOpenDeleteModal((prev) => !prev);
                                          }}
                                        >
                                          <span className="material-icons-outlined">
                                            close
                                          </span>
                                        </button>
                                      )}
                                  </div>
                                </td>}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                    {isAddMode && (
                      <div className="flex flex-wrap uppercase font-bold text-sm mb-4 ml-8 text-rose-500">
                        <span className="text-rose-500 text-2xl leading-none">
                          *
                        </span>
                        Add Quantity First To Add Discount Data
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        showDetailModal && (
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: editDiscountDetails?.id || 0,
              parentId: quantityId || "",
              lowQuantity: editDiscountDetails?.lowQuantity || "",
              highQuantity: editDiscountDetails?.highQuantity || "",
              discountPercent: editDiscountDetails?.discountPercent || 0,
              recStatus:
                editDiscountDetails?.recStatus || RecStatusValuebyName.Active,
              rowVersion: editDiscountDetails?.rowVersion || null,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={true}
            validateOnBlur={false}
          >
            {({ setFieldValue, errors, values }) => {
              return (
                <FormikForm>
                  <div
                    id="discountModal"
                    className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0"
                  >
                    <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                        <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                          <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                            <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl ">
                              {detailsIsAddMode
                                ? "Add Quantity Discount"
                                : "Edit Quantity Discount"}
                            </h3>
                            <button
                              type="button"
                              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                              data-modal-toggle="discountModal"
                              onClick={() => setShowDetailModal((prev) => !prev)}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                          <Messages />
                          <div className="p-6">
                            <div className="mb-4">
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                htmlFor=""
                              >
                                Low Quantity
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </label>
                              <Input
                                type={"text"}
                                name="lowQuantity"
                                onKeyPress={(event) => {
                                  if (!/^\d*$/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                htmlFor=""
                              >
                                High Quantity
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </label>

                              <Input
                                type={"text"}
                                name="highQuantity"
                                onKeyPress={(event) => {
                                  if (!/^\d*$/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                htmlFor=""
                              >
                                Discount Percent
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </label>

                              <Input
                                type={"text"}
                                name="discountPercent"
                                onKeyPress={(event) => {
                                  if (!/^\d*\.?\d*$/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                              />
                            </div>

                          </div>
                          <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 ">
                            <button
                              data-modal-toggle="discountModal"
                              type="button"
                              className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowDetailModal((prev) => !prev)}
                            >
                              Cancel
                            </button>
                            <button
                              disabled={GlobalLoading}
                              data-modal-toggle="discountModal"
                              type="submit"
                              className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                            // onClick={handleShowModal}
                            >
                              <div className={`w-full flex justify-center align-middle `}>
                                {GlobalLoading && (
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                )}
                                Save
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormikForm>
              );
            }}
          </Formik>
        )
      }
      <ConfirmDelete
        handleDelete={handleDelete}
        data={DetailData}
        module={"Quantity Discount Detail"}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />
    </>
  );
};

export default React.memo(DiscountDetail);

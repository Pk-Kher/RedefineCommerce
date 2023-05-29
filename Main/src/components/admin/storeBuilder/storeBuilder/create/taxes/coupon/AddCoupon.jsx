import React, { useState, useCallback, useLayoutEffect } from "react";
import Transition from "utils/Transition";
import { Formik, Form as FormikForm } from "formik";
import Input from "components/common/formComponent/Input";
import { ValidationMsgs } from "global/ValidationMessages";
import * as Yup from "yup";
import RadioButton from "components/common/formComponent/RadioButton";
import { useParams } from "react-router-dom";
import InputNumber from "components/common/formComponent/InputNumber";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Checkbox from "components/common/formComponent/Checkbox";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { RecStatusValuebyName } from "global/Enum";

const AddCoupon = ({
  openCouponModal,
  setCouponData,
  getCouponEditData,
  setopenCouponModal,
}) => {
  const { id } = useParams(); //Store ID
  const [editId, setEditId] = useState();
  const isAddMode = !editId;

  const [coupon, setCoupon] = useState([]);
  const dispatch = useDispatch();
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
  const location = useSelector((store) => store?.location);

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.storeBuilder.coupon.name),
    type: Yup.string().required(ValidationMsgs.storeBuilder.coupon.type),
    amount: Yup.number()
      .required(ValidationMsgs.storeBuilder.coupon.amount)
      .min(1, ValidationMsgs.storeBuilder.coupon.minamount)
      .when("type", {
        is: "1",
        then: Yup.number().max(100, ValidationMsgs.storeBuilder.commonMessages.maxpercentage)
      }),
      couponCodes: Yup.string().required(
      ValidationMsgs.storeBuilder.coupon.couponCodes
    ),
  });

  const handleSubmitHandler = (fields, { resetForm }) => {
    if (isAddMode) {
      createCoupon(fields, resetForm);
    } else {
      updateCoupon(fields, resetForm);
    }
  };

  const createCoupon = useCallback((fields, resetForm) => {
    dispatch(setAddLoading(true))

    StoreBuilderService.updateCouponInfo({
      sbCouponRebatesModel: fields,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.storeBuilder.coupon.created,
            })
          );
          fetchAllData();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))

        }
        setopenCouponModal(false);
        resetForm();
      })
      .catch((error) => {
        console.log("catch ", error)

        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: "Something went wrong.",
          })
        );
        setopenCouponModal(false);
        dispatch(setAddLoading(false))

        resetForm();
      });
  }, []);

  const updateCoupon = useCallback(
    (fields, resetForm) => {
      dispatch(setAddLoading(true))

      // const updateDataObj = { ...fields, id: editId };
      StoreBuilderService.updateCouponRebatesInfo({
        sbCouponRebatesModel: fields,
      })
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                view: true,
                type: "success",
                message: ValidationMsgs.storeBuilder.coupon.updated,
              })
            );
            fetchAllData();
          } else {
            dispatch(
              setAlertMessage({
                type: "danger",
                message: serverError(response),
              })
            );
          }
          setopenCouponModal(false);
          dispatch(setAddLoading(false))

          resetForm();
        })
        .catch((error) => {
          console.log("catch ", error)

          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: "Something went wrong.",
            })
          );
          setopenCouponModal(false);
          dispatch(setAddLoading(false))

          resetForm();
        });
    },
    [editId]
  );

  const fetchAllData = () => {
    dispatch(setAddLoading(true))

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
  };

  useLayoutEffect(() => {
    getCouponEditData.current = fetchData;
  }, []);

  const fetchData = (couponId) => {
    if (couponId !== null) {
      dispatch(setAddLoading(true))

      setCoupon([]);
      StoreBuilderService.getCouponInfo(id)
        .then((res) => {
          if (res.data.success) {
            setCoupon(res.data.data);
          }
          dispatch(setAddLoading(false))

        })
        .catch(() => {
          dispatch(setAddLoading(false))
        });
      setEditId(couponId);
    } else {
      setCoupon([]);
      setEditId(null);
    }

    setopenCouponModal(true);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id:coupon?.id ||0,
          name: coupon?.name || "",
          type: coupon?.type || "",
          amount: coupon?.amount || "",
          couponCodes: coupon?.couponCodes || "",
          couponCodeUsedOnes: coupon?.couponCodeUsedOnes || false,
          recstatus: coupon?.recstatus || RecStatusValuebyName.Active,
          storeId: id,
          rowVersion: coupon?.rowVersion || null,
          ...location,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitHandler}
      >
        {({ values, setFieldValue, resetForm, errors }) => {
          return (
            <FormikForm>
              <Transition
                className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity 1234"
                show={openCouponModal}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
              ></Transition>
              <Transition
                className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                show={openCouponModal}
                tag="div"
                id="basic-modal"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
              >
                <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                  <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                    <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                      <div className="text-xl font-semibold text-gray-900 lg:text-2xl">
                        {isAddMode ? "Add" : "Edit"} Coupons &amp; Rebates
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Name{" "}
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <Input name={"name"} />
                        </div>
                        <div className="col-span-12">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Type{" "}
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <div className="flex">
                            <div className="mr-5">
                              <label className="text-gray-500 inline-flex items-center mb-2">
                                <RadioButton
                                  name="type"
                                  label="(%) Percentage"
                                  id={"(%) Percentage"}
                                  checked={values?.type == "1"}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "type",
                                      e.target.checked ? "1" : ""
                                    );
                                  }}
                                />
                              </label>
                            </div>
                            <div className="mr-5">
                              <label className="text-gray-500 inline-flex items-center mb-2">
                                <RadioButton
                                  name="type"
                                  label="($) Flat amount"
                                  id={"($) Flat amount"}
                                  checked={values?.type == "2"}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "type",
                                      e.target.checked ? "2" : ""
                                    );
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                          {errors && (
                            <div className="text-rose-500">{errors?.type}</div>
                          )}
                        </div>
                        <div className="col-span-12">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Value{" "}
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <InputNumber
                            name={"amount"}
                            value={values.amount}
                            onChange={(e) =>
                              setFieldValue("amount", e.target.value)
                            }
                            displayError={true}
                          />
                        </div>
                        <div className="col-span-12">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Coupon codes{" "}
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <Input name={"couponCodes"} />
                        </div>
                        <div className="col-span-12">
                          <label className="text-gray-500 inline-flex items-center">
                            <Checkbox
                              name="couponCodeUsedOnes"
                              label="Coupons can only be used once"
                              id="couponCodeUsedOnes"
                              checked={values?.couponCodeUsedOnes == "1"}
                              onChange={(e) => {
                                setFieldValue(
                                  "couponCodeUsedOnes",
                                  e.target.checked ? "1" : "0"
                                );
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                      <span
                        className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => {
                          setopenCouponModal(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </span>
                      <button
                        className={`btn bg-indigo-500 hover:bg-indigo-600 text-white mr-1 ${GlobalLoading
                          ? "bg-indigo-200 hover:bg-indigo-200"
                          : "cursor-pointer"
                          }`}
                        type="submit"
                      >
                        {GlobalLoading && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default AddCoupon;

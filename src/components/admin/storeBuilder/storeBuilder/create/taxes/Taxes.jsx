import Checkbox from "components/common/formComponent/Checkbox";
import InputNumber from "components/common/formComponent/InputNumber";
import { Formik, Form as FormikForm } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import AddCoupon from "./coupon/AddCoupon";
import AddFees from "./fees/AddFees";
import FeesList from "./fees/List";
import CouponList from "./coupon/List";
import Messages from "components/common/alerts/messages/Index";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import * as Yup from "yup";
import { RecStatusValuebyName } from "global/Enum";

const Taxes = ({
  id,
  isAddMode,
  setFormSubmit,
  index,
  activeTab,
  generalTabData,
  setactiveTab,
  user,
  mode,
}) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [data, setdata] = useState([]);
  const param = useParams();
  const [openFeesModal, setopenFeesModal] = useState(false);
  const [openFeesDeleteModal, setOpenFeesDeleteModal] = useState(false);
  const [feesData, setFeesData] = useState([]);
  const getFeesEditData = useRef(null);
  const location = useSelector((store) => store?.location);
  const [EditfeesData, setEditfeesData] = useState([]);

  const [openCouponModal, setopenCouponModal] = useState(false);
  const [openCouponDeleteModal, setOpenCouponDeleteModal] = useState(false);
  const [couponData, setCouponData] = useState([]);
  const getCouponEditData = useRef(null);

  const schema = Yup.object().shape({
    fixedCharge: Yup.number()
      .min(0, ValidationMsgs.storeBuilder.commonMessages.minpercentage)
      .max(100, ValidationMsgs.storeBuilder.commonMessages.maxpercentage),
    cardProcessingCharge: Yup.number()
      .min(0, ValidationMsgs.storeBuilder.commonMessages.minpercentage)
      .max(100, ValidationMsgs.storeBuilder.commonMessages.maxpercentage),
  });

  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  const getTaxesInfo = useCallback(() => {
    StoreBuilderService.getTaxesInfo(param.id)
      .then((res) => {
        if (res.data.success) {
          setdata(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  // const fetchAllData = useCallback(() => {
  //   // dispatch(setAddLoading(true))

  //   StoreBuilderService.getFeesInfo(4)
  //     .then((res) => {
  //       // if (res.data.success) {
  //       setFeesData(res.data.data);
  //       // }
  //       // dispatch(setAddLoading(false))
  //     })
  //     .catch(() => {
  //       // dispatch(setAddLoading(false))
  //     });
  // }, []);

  const createFeesInfo = useCallback((fields) => {
    StoreBuilderService.createTaxesInfo({
      feesTaxModel: fields,
    })
      .then((response) => {
        if (response.data.success) {
          /* if (mode == "create") setactiveTab((prev) => prev + 1); */
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.storeBuilder.taxes.feesTax
            })
          );
          getTaxesInfo(); 
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
        }
        dispatch(setAddLoading(false));
      })
      .catch((error) => {
        console.log("catch ", error);

        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: "Something went wrong.",
          })
        );
        dispatch(setAddLoading(false));
      });
  }, []);

  const updateTaxesInfo = useCallback((fields) => { 
    dispatch(setAddLoading(true));

    StoreBuilderService.updateTaxesInfo({
      feesTaxModel: fields,
    })
      .then((response) => {
        if (response.data.success) {
          /* if (mode == "create") setactiveTab((prev) => prev + 1); */
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.storeBuilder.taxes.updated,
            })
          );
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
        }
        dispatch(setAddLoading(false));
      })
      .catch((error) => {

        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: "Something went wrong.",
          })
        );
        dispatch(setAddLoading(false));
      });
  }, []);

  useEffect(() => {
    getTaxesInfo();
  }, []);

  // useEffect(() => {
  //   fetchAllData();
  // }, []);

  const submitHandler = (fields) => {
    if (fields.id) {
      updateTaxesInfo(fields);
    } else {
      createFeesInfo(fields);
    }
  };

  const fetchAllData = () => {
    dispatch(setAddLoading(true));

    StoreBuilderService.getFeesInfo(param.id)
      .then((res) => {
        if (res.data.success) {
          setFeesData(res.data.data);
        }
        dispatch(setAddLoading(false));
      })
      .catch(() => {
        dispatch(setAddLoading(false));
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: data?.id || 0,
          isAvalaraTaxes: data?.isAvalaraTaxes || true,
          fixedCharge: parseInt(data?.fixedCharge) || "",
          cardProcessingCharge: parseInt(data?.cardProcessingCharge) || "",
          storeId: param.id,
          recStatus: data?.recStatus || RecStatusValuebyName.Active,
          rowVersion: data?.rowVersion || null,
          ...location,
        }}
        onSubmit={submitHandler}
        validationSchema={schema}
        innerRef={formRef}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <FormikForm>
              <Messages />
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
                  <div className="uppercase tracking-wide text-gray-500 text-lg font-bold">
                    Taxes
                  </div>
                  <div>
                    <div className="grid grid-cols-12 gap-6 mt-6">
                      <div className="col-span-12">
                        <label className="text-gray-500 inline-flex items-center">
                          <Checkbox
                            name="isAvalaraTaxes"
                            label="Calculate taxes(Avalara) automatically"
                            id="isAvalaraTaxes"
                            checked={values?.isAvalaraTaxes}
                            onChange={(e) => {
                              setFieldValue("isAvalaraTaxes", e.target.checked);
                            }}
                            disabled={true}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fees List ---- Start */}
                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
                  <FeesList
                    setopenFeesModal={setopenFeesModal}
                    openFeesDeleteModal={openFeesDeleteModal}
                    setOpenFeesDeleteModal={setOpenFeesDeleteModal}
                    setFeesData={setFeesData}
                    setEditfeesData={setEditfeesData}
                    getFeesEditData={getFeesEditData}
                    feesData={feesData}
                  />
                </div>
                {/* Fees List ---- End */}
                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
                  <div className="uppercase tracking-wide text-gray-500 text-lg font-bold">
                    {generalTabData?.code} fee
                  </div>
                  <div>
                    <div className="grid grid-cols-12 gap-6 mt-6">
                      <div className="col-span-12">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          {generalTabData?.code} Fees %
                        </label>
                        <InputNumber
                          name="fixedCharge"
                          value={values.fixedCharge}
                          displayError={true}
                          onChange={(e) =>
                            setFieldValue("fixedCharge", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-12">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          Card Processing Fees %
                        </label>
                        <InputNumber
                          name="cardProcessingCharge"
                          value={values.cardProcessingCharge}
                          displayError={true}
                          onChange={(e) =>
                            setFieldValue(
                              "cardProcessingCharge",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
                  <CouponList
                    setopenCouponModal={setopenCouponModal}
                    openCouponDeleteModal={openCouponDeleteModal}
                    setOpenCouponDeleteModal={setOpenCouponDeleteModal}
                    setCouponData={setCouponData}
                    couponData={couponData}
                    getCouponEditData={getCouponEditData}
                  />
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
      <AddFees
        openFeesModal={openFeesModal}
        setopenFeesModal={setopenFeesModal}
        setFeesData={setFeesData}
        getFeesEditData={getFeesEditData}
        EditfeesData={EditfeesData}
        fetchAllData={fetchAllData}
        setEditfeesData={setEditfeesData}
      />
      <AddCoupon
        openCouponModal={openCouponModal}
        setCouponData={setCouponData}
        getCouponEditData={getCouponEditData}
        setopenCouponModal={setopenCouponModal}
      />
    </>
  );
};

export default Taxes;

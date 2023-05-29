import React, { useCallback, useRef, useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import Input from "components/common/formComponent/Input";
import Checkbox from "components/common/formComponent/Checkbox";
import Dropdown from "components/common/formComponent/Dropdown";
import {
  StoreBuilderShippingChargesOptions,
  StoreBuilderShippingMethodsOptions,
} from "dummy/Dummy";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import CustomFieldForm from "./CustomFieldForm";
import RadioButton from "components/common/formComponent/RadioButton";
import * as Yup from "yup";
import InputNumber from "components/common/formComponent/InputNumber";
import TierShipping from "./tier/List";
import AddTier from "./tier/AddTier";
import Messages from "components/common/alerts/messages/Index";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import { ValidationMsgs } from "global/ValidationMessages";
// import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const PaymentInfo = ({
  id,
  isAddMode,
  setFormSubmit,
  index,
  activeTab,
  setactiveTab,
  generalTabData,
  mode,
}) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const billingInfoOptions = [
    { value: 1, label: "Credit card (Student)" },
    { value: 2, label: "Purchase order (Coach)" },
    { value: 3, label: "Both" },
  ];
  const [shippingChargesOptions, setshippingChargesOptions] = useState(
    StoreBuilderShippingChargesOptions
  );

  const [shippingMethodsOptions, setshippingMethodsOptions] = useState(
    StoreBuilderShippingMethodsOptions
  );
  const [paymentAccountOption, setpaymentAccountOption] = useState([]);
  const [data, setdata] = useState([]);

  const [openTierModal, setopenTierModal] = useState(false);
  const [openTierDeleteModal, setOpenTierDeleteModal] = useState(false);
  const [tierData, setTierData] = useState([]);
  const getTierEditData = useRef(null);

  const getPaymentAccountOption = useCallback(() => {
    StoreBuilderService.getPaymentAccount({ storeid: generalTabData.parentid })
      .then((res) => {
        if (res.data.success) {
          setpaymentAccountOption(() => {
            return res.data.data.map((val, index) => {
              return { value: val.id, label: val.name };
            });
          });
        }
      })
      .catch(() => { });
  }, []);

  const getPaymentInfo = useCallback(() => {
    StoreBuilderService.getPaymentInfo({ storeid: id })
      .then((res) => {
        if (res.data.success) {
          setdata(res.data.data);
        }
      })
      .catch(() => { });
  }, []);

  const updatePaymentAccountOption = useCallback((fields) => {
    // dispatch(setAddLoading(true))

    // StoreBuilderService.updatePaymentInfo(fields)
    //   .then((response) => {
    //     if (response.data.success) {
    //       dispatch(
    //         setAlertMessage({
    //           view: true,
    //           type: "success",
    //           message: ValidationMsgs.storeBuilder.paymentInfo.updated,
    //         })
    //       );
    //       if (mode == "create") setactiveTab((prev) => prev + 1);
    //     } else {
    //       dispatch(
    //         setAlertMessage({
    //           type: "danger",
    //           message: serverError(response),
    //         })
    //       );
    //     }
    //     dispatch(setAddLoading(false))

    //   })
    //   .catch((error) => {
    //     console.log("catch ", error)

    //     dispatch(
    //       setAlertMessage({
    //         view: true,
    //         type: "danger",
    //         message: "Something went wrong",
    //       })
    //     );
    //     dispatch(setAddLoading(false))

    //   });
  }, []);

  // useEffect(() => {
  //   getPaymentAccountOption();
  //   getPaymentInfo();
  // }, []);

  // useEffect(() => {
  //   if (activeTab == index) {
  //     setFormSubmit(formRef.current);
  //   }
  // }, [formRef, setFormSubmit, activeTab]);

  const schema = Yup.object().shape({
    collectbillinginfo: Yup.string().required("Payment method is required."),
    paymentmethod: Yup.string().required("Payment account is required."),
    shippingcharges: Yup.string().required("Shipping charges is required."),
    ponumber: Yup.string().when(
      "collectbillinginfo",
      (collectbillinginfo, schema) => {
        if (["2", "3"].includes(collectbillinginfo)) {
          return schema.required("PO number is required.");
        } else {
          return schema;
        }
      }
    ),
  });

  const submitHandler = (fields) => {
    updatePaymentAccountOption(fields);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          collectbillinginfo: data?.collectbillinginfo || "",
          paymentmethod: data?.paymentmethod?.trim() || "",
          shippingcharges: data?.shippingcharges || "",
          shippingcharge: generalTabData?.shippingcharge || "",
          collectplayername: data?.collectplayername || "",
          customplayername: data?.customplayername || "",
          shippingmethod: generalTabData?.shippingmethod || "FR",
          ponumber: data?.ponumber || "",
          storeid: id || "",
        }}
        onSubmit={submitHandler}
        validationSchema={schema}
        innerRef={formRef}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <FormikForm>
              <Messages />
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-6 bg-white border border-neutral-200 mb-6 shadow-lg rounded-md">
                  <div className="w-full p-6">
                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
                      How do you want to handle payment?
                    </div>
                    <div>
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                          <div>
                            <label className="text-gray-500 inline-flex items-center mb-2">
                              <RadioButton
                                name="collectbillinginfo"
                                label="Credit card (Student)"
                                id={"Credit card (Student)"}
                                checked={values?.collectbillinginfo == "1"}
                                onChange={(e) => {
                                  setFieldValue(
                                    "collectbillinginfo",
                                    e.target.checked ? "1" : ""
                                  );
                                }}
                              />
                            </label>
                          </div>
                          <div>
                            <label className="text-gray-500 inline-flex items-center mb-2">
                              <RadioButton
                                name="collectbillinginfo"
                                label="Purchase order (Coach)"
                                id="Purchase order (Coach)"
                                checked={values?.collectbillinginfo == "2"}
                                onChange={(e) => {
                                  setFieldValue(
                                    "collectbillinginfo",
                                    e.target.checked ? "2" : ""
                                  );
                                }}
                              />
                            </label>
                          </div>
                          <div>
                            <label className="text-gray-500 inline-flex items-center mb-2">
                              <RadioButton
                                name="collectbillinginfo"
                                label="Both"
                                id="Both"
                                checked={values?.collectbillinginfo == "3"}
                                onChange={(e) => {
                                  setFieldValue(
                                    "collectbillinginfo",
                                    e.target.checked ? "3" : ""
                                  );
                                }}
                              />
                            </label>
                            <div className="text-rose-500">
                              {errors && errors?.collectbillinginfo}
                            </div>
                          </div>
                        </div>
                        {values?.collectbillinginfo &&
                          ["2", "3"].includes(values.collectbillinginfo) ? (
                          <div className="col-span-12">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                              PO No.
                            </label>
                            <Input name={"ponumber"} />
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="col-span-12">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Payment Account
                          </label>
                          <Dropdown
                            label={""}
                            name={"paymentmethod"}
                            options={paymentAccountOption}
                            defaultValue={values?.paymentmethod}
                            isSearchable={false}
                          />
                        </div>
                        <div className="col-span-12">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Shipping Charges
                          </label>
                          <Dropdown
                            label={""}
                            name={"shippingcharges"}
                            options={shippingChargesOptions}
                            defaultValue={values?.shippingcharges}
                            isSearchable={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
                      Do you want to collect custom information?
                    </div>
                    <div>
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                          <label className="text-gray-500 inline-flex items-center">
                            <Checkbox
                              name="collectplayername"
                              label="Collect Player First Name, Player Last Name and Player No."
                              id="collectplayername"
                              checked={values?.collectplayername}
                              onChange={(e) => {
                                setFieldValue(
                                  "collectplayername",
                                  e.target.checked
                                );
                              }}
                            />
                          </label>
                        </div>
                        <div className="col-span-12">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Field Name
                          </label>
                          <Input name={"customplayername"} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
                      Shipping
                    </div>
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12">
                        {/* <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          Payment Account
                        </label> */}
                        <Dropdown
                          label={""}
                          name={"shippingmethod"}
                          options={shippingMethodsOptions}
                          defaultValue={values?.shippingmethod}
                          isSearchable={false}
                        />
                      </div>

                      {values.shippingmethod === "FL" && (
                        <div className="col-span-12">
                          <InputNumber
                            name={"shippingcharge"}
                            value={values.R}
                            onChange={(e) =>
                              setFieldValue("shippingcharge", e.target.value)
                            }
                            displayError={true}
                          />
                        </div>
                      )}

                      {values.shippingmethod === "TR" && (
                        <TierShipping
                          setopenTierModal={setopenTierModal}
                          openTierDeleteModal={openTierDeleteModal}
                          setOpenTierDeleteModal={setOpenTierDeleteModal}
                          setTierData={setTierData}
                          getTierEditData={getTierEditData}
                          tierData={tierData}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
      <AddTier
        openTierModal={openTierModal}
        setopenTierModal={setopenTierModal}
        setTierData={setTierData}
        getTierEditData={getTierEditData}
      />
      <CustomFieldForm />
    </>
  );
};

export default PaymentInfo;

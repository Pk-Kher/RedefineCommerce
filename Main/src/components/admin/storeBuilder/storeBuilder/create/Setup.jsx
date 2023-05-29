import { Formik, Form as FormikForm } from "formik";
import React, { useEffect, useRef, useState } from "react";
import Dropdown from "components/common/formComponent/Dropdown";
import Input from "components/common/formComponent/Input";
import StoreService from "services/admin/store/StoreService";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";

import * as Yup from "yup";
import { ValidationMsgs } from "global/ValidationMessages";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch, useSelector } from "react-redux";
import { RecStatusValuebyName } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";

const Setup = ({
  id,
  isAddMode,
  setFormSubmit,
  index,
  activeTab,
  setactiveTab,
  generalTabData,
  user,
  mode,
}) => {
  let navigate = useNavigate();
  const formRef = useRef();
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const param = useParams();

  const submitHandler = (fields, btnType) => {
    // setactiveTab((prev) => prev + 1);
    if (isAddMode) {
      // fields.createdby =
      createStore(fields);
    } else {
      updateStore(fields);
    }
  };
  const [dropdown, setdropdown] = useState([]);
  const [paymentDeliveryOption, setpaymentDeliveryOption] = useState([]);

  const schema = Yup.object().shape({
    name: Yup.string().required(ValidationMsgs.storeBuilder.nameRequired),
    payBusinessMethodId: Yup.number().required(
      ValidationMsgs.storeBuilder.payBusinessMethodId
    ),
    parentstoreid: Yup.string().required(
      ValidationMsgs.storeBuilder.storeRequired
    ),
  });

  const initialValues = {
    id: generalTabData?.id || 0,
    parentstoreid: generalTabData?.parentstoreid || "",
    payBusinessMethodId: generalTabData?.payBusinessMethodId || "",
    storeTypeId: 3,
    name: generalTabData?.name || generalTabData?.merchStore || "",
    rowVersion: generalTabData?.rowVersion || "",
    location: generalTabData?.location || "",
    ipAddress: generalTabData?.ipAddress || "",
    macAddress: generalTabData?.macAddress || "",
    recStatus: generalTabData?.recStatus || RecStatusValuebyName.Active,
  };

  const createStore = useCallback((fields) => {
    dispatch(setAddLoading(true));
    StoreBuilderService.createStore({
      masterStoreInfoModel: {
        id: generalTabData?.id || 0,
        parentstoreid: fields.parentstoreid,
        storeTypeId: 3,
        name: fields.name,
        payBusinessMethodId: fields.payBusinessMethodId,
        recStatus: generalTabData?.recStatus || RecStatusValuebyName.Active,
        ...location,
      },
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.storeBuilder.setupCreated,
            })
          );
          setactiveTab(1);
          dispatch(setAddLoading(false));
          let storeID = res.data.data.id;
          navigate(`/admin/StoreBuilder/store/edit/${storeID}`);
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(res) })
          );
          dispatch(setAddLoading(false));
        }
      })
      .catch((err) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.storeBuilder.setupNotCreated,
          })
        );
        dispatch(setAddLoading(false));
      });
  }, []);

  const updateStore = useCallback((fields) => {
    dispatch(setAddLoading(true));

    // fields.storeId = id;
    // fields.modifiedby = user.id;
    StoreBuilderService.updateMasterStoreSetup({
      masterStoreInfoUpdateModel: fields,
    })
      .then((res) => {
        if (res.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.storeBuilder.setupUpdated,
            })
          );
          if (mode == "create") setactiveTab((prev) => prev + 1);
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(res) })
          );
          dispatch(setAddLoading(false));
        }
      })
      .catch((err) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.storeBuilder.setupNotUpdated,
          })
        );
        dispatch(setAddLoading(false));
      });
  });

  useEffect(() => {
    // const storeObj = {
    //   args: {
    //     pageIndex: 0,
    //     pageSize: 9999,
    //     pagingStrategy: 0,
    //     filteringOptions: [
    //       {
    //         field: "storeTypeId",
    //         operator: 0,
    //         value: "2",
    //       },
    //     ],
    //   },
    // };
    StoreService.getStoreListByStoreTypeId(0, 2)
      .then((res) => {
        if (res.data.success) {
          setdropdown(res.data.data);
        }
      })
      .catch((err) => {});

    StoreBuilderService.getPaymentDeliveryOptions()
      .then((res) => {
        setpaymentDeliveryOption(res.data.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={submitHandler}
      validationSchema={schema}
      innerRef={formRef}
    >
      {({ values, setFieldValue, errors }) => {
        return (
          <FormikForm>
            <Messages />
            <div className={`grid grid-cols-12 gap-6`}>
              <div className="col-span-12">
                <div className="w-full bg-white shadow-lg rounded-md p-6">
                  <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
                    setup
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-4 lg:col-span-2">
                      <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                        Domain
                      </label>
                      <Dropdown
                        label={"Domain"}
                        name={"parentstoreid"}
                        options={dropdown}
                        defaultValue={values.parentstoreid}
                        isSearchable={true}
                      />
                    </div>
                    {isAddMode && (
                      <div className="col-span-4 lg:col-span-2">
                        <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          Store Name
                        </label>
                        <Input name={"name"} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="w-full bg-white shadow-lg rounded-md p-6">
                  <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
                    pay by
                  </div>

                  <Input type="hidden" name={"payBusinessMethodId"} />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paymentDeliveryOption &&
                      paymentDeliveryOption.map((value, index) => {
                        return (
                          <div
                            className="cursor-pointer"
                            key={index}
                            onClick={() => {
                              setFieldValue("payBusinessMethodId", value.id);
                            }}
                          >
                            <div
                              className={`block bg-white shadow-lg rounded-md p-6 ${
                                values.payBusinessMethodId === value.id
                                  ? "border-green-500"
                                  : "border-neutral-200"
                              }`}
                              style={{ borderWidth: "1px" }}
                            >
                              <div className="flex items-center gap-2 mb-2 last:mb-0">
                                <div className="w-1/2"> Payment Method : </div>
                                <div className="font-semibold capitalize">
                                  {value.paymentMethod.replace("_", " ")}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-2 last:mb-0">
                                <div className="w-1/2">Delivery Options : </div>
                                <div className="font-semibold capitalize">
                                  {value?.deliveryOptions?.replace("_", " ")}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default Setup;

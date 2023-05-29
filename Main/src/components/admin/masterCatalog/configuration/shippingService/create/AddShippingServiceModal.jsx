import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form as FormikForm } from "formik";
import { useSelector, useDispatch } from "react-redux";
import Input from "components/common/formComponent/Input";
import { RecStatusValuebyName } from "global/Enum";
import ToggleButton from "components/common/formComponent/Toggle";
import * as Yup from "yup";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import ShippingService from "services/admin/shippingService/shippingService";
import DropdownService from "services/common/dropdown/DropdownService";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import Dropdown from "components/common/formComponent/Dropdown";

const AddShippingServiceModal = ({
  handleShowModal,
  getShippingService,
  idson,
}) => {
  const [data, setData] = useState([]);
  const [stores, setStores] = useState([]);
  const location = useSelector((store) => store?.location);
  const isAddMode = idson ? false : true;
  const dispatch = useDispatch();

  const GlobalLoading = useSelector(
    (store) => store?.GlobalLoaderReducer?.toLoad
  );
  const initialValues = {
    id: data?.id || 0,
    rowVersion: data?.rowVersion || "",
    // storeId: data?.storeId || "",
    name: data?.name || "",
    userName: data?.userName || "",
    password: data?.password || "",
    clientKey: data?.clientKey || "",
    secretKey: data?.secretKey || "",
    token: data?.token || "",
    url: data?.url || "",
    location: data?.location || "",
    ipAddress: location?.ipAddress || "",
    macAddress: location?.macAddress || "",
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
  };

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store").then((res) => {
      if (res.data.success) {
        setStores(() => {
          return res.data.data;
        });
      }
    });
  }, []);

  useEffect(() => {
    getStoreDropdownData();
  }, [getStoreDropdownData]);

  function createShippingService(fields, resetForm) {
    console.log("check", fields);
    dispatch(setAddLoading(true));
    ShippingService.createShippingService({
      createShippingServicesRequest: {
        name: fields.name,
        // storeId: fields.storeId,
        rowVersion: fields.rowVersion,
        recStatus: fields.recStatus,
        userName: fields.userName,
        password: fields.password,
        clientKey: fields.clientKey,
        secretKey: fields.secretKey,
        token: fields.token,
        url: fields.url,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.shippingService.shippingServiceCreated,
            })
          );
          resetForm({});
          handleShowModal((prev) => !prev);
          getShippingService();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false));
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.shippingService.shippingServiceNotCreated,
          })
        );
        dispatch(setAddLoading(false));
      });
  }

  function updateShippingService(fields, resetForm) {
    dispatch(setAddLoading(true));

    ShippingService.updateShippingService({
      updateShippingServicesRequest: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.shippingService.shippingServiceUpdated,
            })
          );
          handleShowModal((prev) => !prev);
          resetForm({});
          getShippingService();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false));
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.shippingService.shippingServiceNotUpdated,
          })
        );
        dispatch(setAddLoading(false));
      });
  }

  useEffect(() => {
    if (idson) {
      dispatch(setAddLoading(true));
      ShippingService.getShippingServiceById(idson)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setData({ ...response.data });
          }
          dispatch(setAddLoading(false));
        })
        .catch((err) => {
          dispatch(setAddLoading(false));
        });
    }
  }, [idson]);

  const onsubmit = (fields, { resetForm }) => {
    if (idson) {
      updateShippingService(fields, resetForm);
    } else {
      createShippingService(fields, resetForm);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.shippingService.nameRequired),
    url: Yup.string()
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        'Enter valid url'
      ),
  });

  return (
    <>
      <title> Add Shipping Service</title>
      <div
        id="paymentModal"
        className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 justify-center items-center h-modal md:h-full md:inset-0"
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow  max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start p-5 rounded-t border-b  sticky top-0 left-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                  {isAddMode === true
                    ? "Add Shipping service"
                    : "Edit Shipping service"}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                  data-modal-toggle="actionModal"
                  onClick={handleShowModal}
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
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={onsubmit}
                validationSchema={validationSchema}
              >
                {({ setFieldValue, errors, values }) => {
                  return (
                    <FormikForm>
                      <Messages />
                      <div className="p-6">
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >{"Name"}
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <Input type={""} name="name" maxLength={500} />
                        </div>
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >{"User Name"}
                          </label>
                          <Input type={""} name="userName" maxLength={20} />
                        </div>
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >{"Password"}
                          </label>
                          <Input type={"password"} name="password" maxLength={20} />
                        </div>
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >{"Client Key"}
                          </label>
                          <Input type={""} name="clientKey" maxLength={200} />
                        </div>
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >{"Secret Key"}
                          </label>
                          <Input type={""} name="secretKey" maxLength={200} />
                        </div>
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >{"Token"}
                          </label>
                          <Input type={""} name="token" /* maxLength={500} */ />
                        </div>
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >{"URL"}
                          </label>
                          <Input type={""} name="url" /* maxLength={500} */ />
                        </div>
                        <div className="w-full flex mb-4">
                          <div className="w-full">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                              Status
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </label>
                            <div className="col-span-full w-full sm:col-span-6 xl:col-span-8">
                              <div>
                                <ToggleButton
                                  name="recStatus"
                                  id="recStatus"
                                  size="m"
                                  on="Active"
                                  off="Inactive"
                                  onChange={(e) =>
                                    setFieldValue(
                                      "recStatus",
                                      e.target.checked
                                        ? RecStatusValuebyName.Active
                                        : RecStatusValuebyName.Inactive
                                    )
                                  }
                                  defaultValue={
                                    values.recStatus ===
                                      RecStatusValuebyName.Active
                                      ? true
                                      : false
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 ">
                        <button
                          // data-modal-toggle="actionModal"
                          type="button"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={handleShowModal}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={GlobalLoading}
                          type="Submit"
                          className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}
                        >
                          <div
                            className={`w-full flex justify-center align-middle `}
                          >
                            {GlobalLoading && (
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            Save
                          </div>
                        </button>
                      </div>
                    </FormikForm>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddShippingServiceModal;

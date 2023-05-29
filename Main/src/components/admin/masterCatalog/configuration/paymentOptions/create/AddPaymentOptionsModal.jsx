import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import { useSelector, useDispatch } from "react-redux";
import Input from "components/common/formComponent/Input";
import { RecStatusValuebyName } from "global/Enum";
import ToggleButton from "components/common/formComponent/Toggle";
import * as Yup from "yup";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import PaymentOptions from "services/admin/paymentOptions/paymentOptions";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";

const AddPaymentOptionsModal = ({
  handleShowModal,
  getPaymentOptions,
  idson,
}) => {
  const [data, setData] = useState([]);
  const location = useSelector((store) => store?.location);
  const isAddMode = idson ? false : true;
  const dispatch = useDispatch();

  const GlobalLoading = useSelector(
    (store) => store?.GlobalLoaderReducer?.toLoad
  );

  const initialValues = {
    id: data?.id || 0,
    name: data?.name || "",
    isMultipleSelect: data?.isMultipleSelect || false,
    rowVersion: data?.rowVersion || "",
    location: data?.location || "",
    ipAddress: location?.ipAddress || "",
    macAddress: location?.macAddress || "",
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
  };

  function createPaymentOptions(fields, resetForm) {
    dispatch(setAddLoading(true));
    PaymentOptions.createPaymentOptions({
      paymentoptionsModel: {
        name: fields.name,
        isMultipleSelect: fields.isMultipleSelect,
        rowVersion: fields.rowVersion,
        recStatus: fields.recStatus,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.paymentOptions.paymentOptionsCreated,
            })
          );
          resetForm({});
          handleShowModal((prev) => !prev);
          getPaymentOptions();
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
            message: ValidationMsgs.paymentOptions.paymentOptionsNotCreated,
          })
        );
        dispatch(setAddLoading(false));
      });
  }

  function updatePaymentOptions(fields, resetForm) {
    dispatch(setAddLoading(true));

    PaymentOptions.updatePaymentOptions({
      paymentoptionsModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.paymentOptions.paymentOptionsUpdated,
            })
          );
          handleShowModal((prev) => !prev);
          resetForm({});
          getPaymentOptions();
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
            message: ValidationMsgs.paymentOptions.paymentOptionsNotUpdated,
          })
        );
        dispatch(setAddLoading(false));
      });
  }

  useEffect(() => {
    if (idson) {
      dispatch(setAddLoading(true));
      PaymentOptions.getPaymentOptionsById(idson)
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
      updatePaymentOptions(fields, resetForm);
    } else {
      createPaymentOptions(fields, resetForm);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.paymentOptions.nameRequired),
  });

  return (
    <>
      <title> Add Payment Options</title>
      <div
        id="paymentModal"
        className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 justify-center items-center h-modal md:h-full md:inset-0"
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                  {isAddMode === true
                    ? "Add Payment Options"
                    : "Edit Payment Options"}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
                          >
                            {"Name"}

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
                          >
                            {"Multiple Select"}

                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <ToggleButton
                            name="isMultipleSelect"
                            id="isMultipleSelect"
                            onChange={(e) =>
                              setFieldValue(
                                "isMultipleSelect",
                                e.target.checked ? true : false
                              )
                            }
                            defaultValue={
                              values.isMultipleSelect === true ? true : false
                            }
                          />
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
                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
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
export default AddPaymentOptionsModal;

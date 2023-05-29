import React, { useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import { extensionHttpMethod } from "global/Enum";
import Dropdown from "components/common/formComponent/Dropdown";
import ModuleExtensionActionService from "services/admin/module/ModuleExtensionActionService";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const AddActionModal = ({ handleShowModal, accessRightId, getActionData }) => {
  const dispatch = useDispatch();
  const initialValues = {
    action: "",
    httpmethod: "",
    urlpattern: "",
    accessRightId: accessRightId || "",
  };
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const validationSchema = Yup.object({
    action: Yup.string().required(ValidationMsgs.action.actionRequired),
    httpmethod: Yup.string().required(ValidationMsgs.action.httpMethodRequired),
    urlpattern: Yup.string().required(ValidationMsgs.action.httpMethodRequired),
  });

  function createExtensionAction(fields, resetForm) {
    dispatch(setAddLoading(true))

    ModuleExtensionActionService.createExtensionAction({
      accessRightActionModel: {
        accessRightId: fields.accessRightId,
        action: fields.action,
        httpmethod: fields.httpmethod,
        urlpattern: fields.urlpattern,
      },
    })
      .then((response) => {
        if (response.data.success) {
          getActionData();
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: "Extension Action create successfully.",
            })
          );
          resetForm({});
          handleShowModal((prev) => !prev);
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: "Extension Action is not created.",
            })
          );
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: "Extension Action is not created.",
          })
        );
        dispatch(setAddLoading(false))

      });
  }

  const onSubmit = (fields, { resetForm }) => {
    createExtensionAction(fields, resetForm);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, errors, values }) => {
          return (
            <FormikForm>
              <div
                id="actionModal"
                className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0"
              >
                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                      <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                          Add Action
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
                      <div className="p-6">
                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            Action
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <Input type={"text"} name="action" />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            Http Method
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <Dropdown
                            label="Http Method"
                            isMulti={false}
                            name="httpmethod"
                            options={extensionHttpMethod}
                            defaultValue={values.httpmethod}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            URL Pattern
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>

                          <Input type={"text"} name="urlpattern" />
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                        <button
                          data-modal-toggle="actionModal"
                          type="button"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={handleShowModal}
                        >
                          Cancel
                        </button>
                        <button
                          data-modal-toggle="actionModal"
                          disabled={GlobalLoading}
                          type="submit"
                          className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                        // onClick={handleShowModel}
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
    </>
  );
};

export default AddActionModal;

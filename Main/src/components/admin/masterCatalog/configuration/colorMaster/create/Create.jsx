import ColorPicker from "components/common/formComponent/ColorPicker";
import Input from "components/common/formComponent/Input";
import ToggleButton from "components/common/formComponent/ToggleButton";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import React from "react";
import Transition from "utils/Transition";
import ColorService from "services/admin/color/ColorService";
import { RecStatusValuebyName } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = ({ fetchAllColors, openModal, setOpenModal, editId, editColor }) => {
  const isAddMode = !editId;
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const colorCode = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(ValidationMsgs.color.nameRequired)
      .max(60, ValidationMsgs.color.nameLength),
    hexCode: Yup.string()
      .required(ValidationMsgs.color.hexCodeRequired)
      .matches(colorCode, ValidationMsgs.color.matchesLength),
    borderColor: Yup.string()
      .required(ValidationMsgs.color.borderColorRequired)
      .matches(colorCode, ValidationMsgs.color.matchesLength),
    textColor: Yup.string()
      .required(ValidationMsgs.color.textColorRequired)
      .matches(colorCode, ValidationMsgs.color.matchesLength),
  });

  const createColor = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    ColorService.createColor({
      colorModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.color.colorCreated,
            })
          );
          fetchAllColors();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          fetchAllColors();
        }
        resetForm({})
        setOpenModal(false);
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: ValidationMsgs.color.colorNotCreated,
          })
        );
        fetchAllColors();
        resetForm({})

      });
  };

  const updateColor = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    ColorService.updateColor({
      colorModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.color.colorUpdated,
            })
          );
          fetchAllColors();

        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          fetchAllColors();
        }
        setOpenModal(false);
        resetForm({})
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: errors.response.data.Errors.Error,
          })
        );
        fetchAllColors();
        resetForm({})
      });
  };

  function onSubmit(fields, { resetForm }) {
    if (isAddMode) {
      createColor(fields, resetForm);
    } else {
      updateColor(fields, resetForm);
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: editColor?.id || 0,
          name: editColor?.name || "",
          hexCode: editColor?.hexCode || "#2d8bf1",
          borderColor: editColor?.borderColor || "#2d8bf1",
          textColor: editColor?.textColor || "#2d8bf1",
          recStatus: editColor?.recStatus || RecStatusValuebyName.Active,
          rowVersion: editColor?.rowVersion || null,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, errors, values, resetForm }) => {
          return (
            <FormikForm>
              <Transition
                className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
                show={openModal}
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
                show={openModal}
                tag="div"
                id="basic-modal"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
              >
                <div className="bg-white rounded shadow-lg overflow-auto md:overflow-visible max-w-lg w-full max-h-full">
                  <div className="px-5 py-3 border-b border-neutral-200">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-gray-800">
                        {isAddMode === true ? "Add Color" : "Edit Color"}
                      </div>
                      <button
                        className="text-gray-400 hover:text-gray-500"
                        type="button"
                        onClick={() => {
                          setOpenModal(false);
                          resetForm({});
                        }}
                      >
                        <div className="sr-only">Close</div>
                        <svg className="w-4 h-4 fill-current">
                          <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="px-5 pt-4 pb-1">
                    <div >
                      <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                        <div className="col-span-full sm:col-span-4 xl:col-span-3">
                          <label className="text-gray-500">
                            Name
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                        </div>
                        <div className="col-span-full sm:col-span-6 xl:col-span-8">
                          <Input type="text" name="name" maxLength={60} />
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                        <div className="col-span-full sm:col-span-4 xl:col-span-3">
                          <label className="text-gray-500">
                            Hexcode
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                        </div>
                        <div className="col-span-full sm:col-span-6 xl:col-span-8">
                          <div>
                            <div className="max-w-sm mx-auto">
                              <div className="mb-5">
                                <div className="flex items-center">
                                  <ColorPicker
                                    name="hexCode"
                                    maxLength={12}
                                    isDisabled={true}
                                    defaultValue={values.hexCode}
                                    value={values.hexCode}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                        <div className="col-span-full sm:col-span-4 xl:col-span-3">
                          <label className="text-gray-500">
                            BorderColor
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                        </div>
                        <div className="col-span-full sm:col-span-6 xl:col-span-8">
                          <div>
                            <div className="max-w-sm mx-auto">
                              <div className="mb-5">
                                <div className="flex items-center">
                                  <ColorPicker
                                    name="borderColor"
                                    maxLength={12}
                                    isDisabled={true}
                                    defaultValue={values.borderColor}
                                    value={values.borderColor}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                        <div className="col-span-full sm:col-span-4 xl:col-span-3">
                          <label className="text-gray-500">
                            TextColor
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                        </div>
                        <div className="col-span-full sm:col-span-6 xl:col-span-8">
                          <div>
                            <div className="max-w-sm mx-auto">
                              <div className="mb-5">
                                <div className="flex items-center">
                                  <ColorPicker
                                    name="textColor"
                                    maxLength={12}
                                    isDisabled={true}
                                    defaultValue={values.textColor}
                                    value={values.textColor}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                        <div className="col-span-full sm:col-span-4 xl:col-span-3">
                          <label className="text-gray-500">
                            Status
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                        </div>
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
                  <div className="px-5 py-4">
                    <div className="flex flex-wrap justify-end space-x-2">
                      <button
                        className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                        type="button"
                        onClick={() => {
                          setOpenModal(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        disabled={GlobalLoading}
                        className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                        type="submit"
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
              </Transition>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default Create;

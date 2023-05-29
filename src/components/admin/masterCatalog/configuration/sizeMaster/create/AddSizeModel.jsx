import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import ToggleButton from "components/common/formComponent/ToggleButton";
import Input from "components/common/formComponent/Input";
import SizeDetailsService from "services/admin/sizeDetails/SizeDetailsService";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Messages from "components/common/alerts/messages/Index";
const AddSizeModel = ({
  handleShowModel,
  setrefresh,
  sizeMasterID,
  sizeId,

  setProductSizeDataBYId,
}) => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location)
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const isAddMode = !sizeId;
  const setSizeDetailsByID = useCallback(() => {
    if (sizeId) {
      dispatch(setAddLoading(true))

      SizeDetailsService.getSizeDetailsByID(sizeId)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setData({ ...response.data });
          }
          dispatch(setAddLoading(false))

        })
        .catch((err) => {
          dispatch(setAddLoading(false))

        });
    }
  }, [sizeId]);
  useEffect(() => {
    setSizeDetailsByID();
  }, [sizeId]);

  const initialValues = {
    size: data?.size || "",
    displayOrder: data?.displayOrder || "",
    id: sizeId || 0,
    sizeMasterID: sizeMasterID || 0,
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    rowVersion: data?.rowVersion || null,
  };

  const validationSchema = Yup.object({
    size: Yup.string().required(ValidationMsgs.sizeMaster.sizeNameRequired),
    displayOrder: Yup.number()
      .typeError(ValidationMsgs.sizeMaster.displayOrderTypeError)
      .required(ValidationMsgs.sizeMaster.displayOrderRequired),
  });

  const createSizeDetails = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    SizeDetailsService.createSizeDetails({ ...fields, ...location })
      .then((response) => {
        if (response.data.success) {
          setrefresh("refresh");
          setProductSizeDataBYId();
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.sizeMaster.sizeMasterDetailsCreated,
            })
          );
          resetForm();
          handleShowModel();
          setProductSizeDataBYId();
        } else {
          dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
        }
        dispatch(setAddLoading(false))
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.sizeMaster.sizeMasterDetailsNotCreated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const updateSizeDetails = (fields, { resetForm }) => {
    dispatch(setAddLoading(true))

    SizeDetailsService.updateSizeDetails({ ...fields, ...location })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.sizeMaster.sizeMasterDetailsUpdated,
            })
          );
          handleShowModel();
          setProductSizeDataBYId();
        } else {
          dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
        }
        dispatch(setAddLoading(false))
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.sizeMaster.sizeMasterDetailsNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const [toggler, setToggler] = useState({
    inventoryAvailable: false,
  });

  const onSubmit = (fields, { resetForm }) => {
    if (sizeId) {
      updateSizeDetails(fields, resetForm);
    } else {
      createSizeDetails(fields, resetForm);
    }
  };

  const handleToggle = (field) => {
    setToggler((prevData) => ({
      ...prevData,
      [field]: !toggler[field],
    }));
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, errors, values }) => {
          return (
            <FormikForm>
              <div
                id="ManageLocationModal"
                className=" overflow-y-auto overflow-x-hidden fixed inset-0 justify-center items-center h-modal max-h-screen"
              >
                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="relative w-full max-w-2xl">
                    <div className="relative bg-white rounded-lg shadow ">
                      <div className="flex justify-between items-start p-5 rounded-t border-b  sticky top-0 left-0 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl ">
                          {isAddMode ? "Add Product Size" : "Edit Product Size"}
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                          data-modal-toggle="managestoreModal"
                          onClick={handleShowModel}
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
                        <div className="mb-2">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            Size Name :
                          </label>
                          <Input name="size"
                            maxLength={5}
                          />
                        </div>

                        <div className="mb-2">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            Display Order :
                          </label>
                          <Input
                            name="displayOrder"
                            maxLength={4}
                            onKeyPress={(event) => {
                              if (!/^\d*$/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                        </div>

                        <div className="w-full px-2 py-2">
                          <label className="text-gray-500 font-bold flex">
                            Status :
                          </label>
                          <div className="col-span-full w-full sm:col-span-6 xl:col-span-8">
                            <div >
                              <ToggleButton
                                name="recStatus"
                                id="recStatus"
                                onChange={(e) => {
                                  handleToggle(); setFieldValue(
                                    "recStatus",
                                    e.target.checked
                                      ? RecStatusValuebyName.Active
                                      : RecStatusValuebyName.Inactive
                                  )
                                }}
                                size="m"
                                on="Active"
                                off="Inactive"
                                defaultValue={values.recStatus === RecStatusValuebyName.Active
                                  ? true
                                  : false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 ">
                        <button
                          data-modal-toggle="ManageLocationModal"
                          type="button"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={handleShowModel}
                        >
                          Cancel
                        </button>
                        <button
                          data-modal-toggle="ManageLocationModal"
                          disabled={GlobalLoading}
                          type="submit"
                          className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
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

export default AddSizeModel;

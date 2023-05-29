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
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { RecStatusValuebyName } from "global/Enum";
const AddFees = ({
  openFeesModal,
  setopenFeesModal,
  setFeesData,
  getFeesEditData,
  EditfeesData,
  setEditfeesData,
  fetchAllData,
}) => {
  const { id } = useParams(); //Store ID
  const [editId, setEditId] = useState();
  const isAddMode = !editId;
  const GlobalLoading = useSelector(
    (store) => store?.GlobalLoaderReducer?.toLoad
  );
  const location = useSelector((store) => store?.location);

  const [fees, setFees] = useState([]);
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.storeBuilder.fees.name),
    type: Yup.string().required(ValidationMsgs.storeBuilder.fees.type),
    amount: Yup.number()
      .required(ValidationMsgs.storeBuilder.fees.amount)
      .min(1, ValidationMsgs.storeBuilder.fees.minamount)
      .when("type", {
        is: "1",
        then: Yup.number().max(
          100,
          ValidationMsgs.storeBuilder.commonMessages.maxpercentage
        ),
      }),
  });

  const handleSubmitHandler = (fields, { resetForm }) => {
    if (isAddMode) {
      createFees(fields, resetForm);
    } else {
      updateFees(fields, resetForm);
    }
  };

  const createFees = useCallback((fields, resetForm) => {
    dispatch(setAddLoading(true));

    StoreBuilderService.createFeesInfo({
      feesModel: fields,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.storeBuilder.fees.created,
            })
          );
          fetchAllData();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false));
        }
        setopenFeesModal(false);

        resetForm();
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: "Fees is not created.",
          })
        );
        setopenFeesModal(false);
        dispatch(setAddLoading(false));

        resetForm();
      });
  }, []);

  const updateFees = useCallback(
    (fields, resetForm) => {
      // const updateDataObj = { ...fields, id: editId };
      dispatch(setAddLoading(true));

      // fields.id = editId;
      StoreBuilderService.updateFeesInfo({
        feesModel: fields,
      })
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                view: true,
                type: "success",
                message: ValidationMsgs.storeBuilder.fees.updated,
              })
            );
            fetchAllData();
            setEditfeesData({});
          } else {
            dispatch(
              setAlertMessage({
                type: "danger",
                message: serverError(response),
              })
            );
            dispatch(setAddLoading(false));
          }
          setopenFeesModal(false);

          resetForm();
        })
        .catch((errors) => {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: "Something went wrong.",
            })
          );
          setopenFeesModal(false);
          dispatch(setAddLoading(false));

          resetForm();
        });
    },
    [editId]
  );

  useLayoutEffect(() => {
    getFeesEditData.current = fetchData;
  }, []);

  const fetchData = (feesid) => {
    if (feesid !== null) {
      setFees([]);
      // StoreBuilderService.getFeesInfo({ storeId: id, id: feesid })
      StoreBuilderService.getFeesInfo(id)
        .then((res) => {
          if (res.data.success) {
            setFees(res.data.data);
          }
        })
        .catch(() => {});
      setEditId(feesid);
    } else {
      setFees([]);
      setEditId(null);
    }
    setopenFeesModal(true);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: EditfeesData?.id || 0,
          name: EditfeesData?.name || "",
          type: EditfeesData?.type || "",
          amount: parseInt(EditfeesData?.amount) || "",
          storeId: id,
          recStatus: EditfeesData?.recStatus || RecStatusValuebyName.Active,
          rowVersion: EditfeesData?.rowVersion || null,
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
                show={openFeesModal}
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
                show={openFeesModal}
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
                    <div className="flex justify-between items-start p-5 rounded-t border-b  sticky top-0 left-0 bg-white">
                      <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                        {isAddMode === true ? "Add Fees" : "Edit Fees"}
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                        data-modal-toggle="actionModal"
                        onClick={() => setopenFeesModal(false)}
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
                          {/* <Input name={"amount"} /> */}
                          <InputNumber
                            name={"amount"}
                            id={"amount"}
                            value={values.amount}
                            onChange={(e) =>
                              setFieldValue("amount", e.target.value)
                            }
                            displayError={true}
                          />
                        </div>
                        <div className="col-span-12"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                      <span
                        className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => {
                          resetForm({});
                          setopenFeesModal(false);
                        }}
                      >
                        Cancel
                      </span>
                      <button
                        className={`btn bg-indigo-500 hover:bg-indigo-600 text-white mr-1 ${
                          GlobalLoading
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

export default AddFees;

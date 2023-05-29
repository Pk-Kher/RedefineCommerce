import React, { useState, useCallback, useLayoutEffect } from "react";
import Transition from "utils/Transition";
import { Formik, Form as FormikForm } from "formik";
import Input from "components/common/formComponent/Input";
import { ValidationMsgs } from "global/ValidationMessages";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import InputNumber from "components/common/formComponent/InputNumber";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { RecStatusValue, RecStatusValuebyName, blobFolder } from "global/Enum";

const AddTier = ({
  openTierModal,
  setopenTierModal,
  setTierData,
  getTierEditData,
}) => {
  const { id } = useParams(); //Store ID
  const [editId, setEditId] = useState();
  const isAddMode = !editId;
  const location = useSelector((store) => store?.location);

  const [tier, setTier] = useState([]);
  const dispatch = useDispatch();
  const GlobalLoading = useSelector(
    (store) => store?.GlobalLoaderReducer?.toLoad
  );

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.storeBuilder.tier.name),
    amountFrom: Yup.number().required(
      ValidationMsgs.storeBuilder.tier.amountFrom
    ),
    amountTo: Yup.number().required(ValidationMsgs.storeBuilder.tier.amountTo),
    charge: Yup.number()
      .required(ValidationMsgs.storeBuilder.tier.charge)
      .min(1, ValidationMsgs.storeBuilder.tier.minamount),
  });

  const handleSubmitHandler = (fields, { resetForm }) => {
    if (isAddMode) {
      createTier(fields, resetForm);
    } else {
      updateTier(fields, resetForm);
    }
  };

  const createTier = useCallback((fields, resetForm) => {
    dispatch(setAddLoading(true));

    StoreBuilderService.createStoreTierInfo({
      sbShippingMethodsModel: fields,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.storeBuilder.tier.created,
            })
          );
          fetchAllData();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false));
        }
        setopenTierModal(false);

        resetForm();
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
        setopenTierModal(false);
        dispatch(setAddLoading(false));

        resetForm();
      });
  }, []);

  const updateTier = useCallback(
    (fields, resetForm) => {
      const updateDataObj = { ...fields, id: editId };
      dispatch(setAddLoading(true));

      fields.id = editId;
      StoreBuilderService.createStoreTierInfo(updateDataObj)
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                view: true,
                type: "success",
                message: ValidationMsgs.storeBuilder.tier.updated,
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
            dispatch(setAddLoading(false));
          }
          setopenTierModal(false);

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
          setopenTierModal(false);
          dispatch(setAddLoading(false));

          resetForm();
        });
    },
    [editId]
  );

  const fetchAllData = () => {
    dispatch(setAddLoading(true));

    StoreBuilderService.getTierInfo(id)
      .then((res) => {
        if (res.data.success) {
          setTierData(res.data.data);
        }

        dispatch(setAddLoading(false));
      })
      .catch(() => {
        dispatch(setAddLoading(false));
      });
  };

  useLayoutEffect(() => {
    getTierEditData.current = fetchData;
  }, []);

  const fetchData = (tierid) => {
    if (tierid !== null) {
      setTier([]);
      StoreBuilderService.getTierInfo(id)
        .then((res) => {
          if (res.data.success) {
            setTier(res.data.data);
          }
        })
        .catch(() => {});
      setEditId(tierid);
    } else {
      setTier([]);
      setEditId(null);
    }

    setopenTierModal(true);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: tier?.name || "",
          amountFrom: tier?.amountFrom || "",
          amountTo: tier?.amountTo || "",
          charge: parseInt(tier?.charge) || "",
          storeId: id,
          recStatus: tier?.recStatus || RecStatusValuebyName.Active,
          rowVersion: tier?.rowVersion || null,
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
                show={openTierModal}
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
                show={openTierModal}
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
                        {isAddMode ? "Add" : "Edit"} Fees
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
                            Cart Amount{" "}
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <div className="flex items-center gap-2">
                            {/* <Input name="amountFrom" /> */}
                            <div className="w-full">
                              <InputNumber
                                name={"amountFrom"}
                                placeholder={"From"}
                                id={"amountFrom"}
                                value={values.amountFrom}
                                onChange={(e) =>
                                  setFieldValue("amountFrom", e.target.value)
                                }
                                displayError={true}
                              />
                            </div>
                            <div className="items-center">-</div>
                            {/* <Input name="amountTo" /> */}
                            <div className="w-full">
                              <InputNumber
                                name={"amountTo"}
                                placeholder={"To"}
                                id={"amountTo"}
                                value={values.amountTo}
                                onChange={(e) =>
                                  setFieldValue("amountTo", e.target.value)
                                }
                                displayError={true}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Fee{" "}
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <InputNumber
                            name={"charge"}
                            id={"charge"}
                            value={values.charge}
                            onChange={(e) =>
                              setFieldValue("charge", e.target.value)
                            }
                            displayError={true}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                      <span
                        className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => {
                          resetForm({});
                          setopenTierModal(false);
                          console.log(values, "on cancle");
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

export default AddTier;

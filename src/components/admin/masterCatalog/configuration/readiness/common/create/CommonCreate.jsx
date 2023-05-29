/*Component Name: Create
Component Functional Details: Common Create Component for SEO and Product creating and updating.
Created By: Happy
Created Date: 06/20/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { Formik, Form as FormikForm, FieldArray } from "formik";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Dropdown from "components/common/formComponent/Dropdown";
import DropdownService from "services/common/dropdown/DropdownService";
import Messages from "components/common/alerts/messages/Index";
import { RecStatusValue, RecStatusValuebyName } from "global/Enum";
import Input from "components/common/formComponent/Input";
import ReadinessDetail from "./ReadinessDetail";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import InputNumber from "components/common/formComponent/InputNumber";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = ({ title, listUrl, editURL, CreateReadinessAPI, GetReadinessAPI, UpdateReadinessAPI, CreateOrUpdateRedinessDetailsAPI, getProductFieldsByStoreId }) => {
  const permission = useSelector(store => store.permission);
  const { id } = useParams();
  const isAddMode = !id
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [stores, setStores] = useState([]);
  const [data, setData] = useState([]);
  const location = useSelector((store) => store?.location);
  const [ddfields, setddFields] = useState([]);
  const [fieldsInitialValues, setFieldsInitialValues] = useState({})
  const [TotalFieldData, setTotalFieldData] = useState([])
  const [Total, setTotal] = useState()
  const [selectedStore, setSelectedStore] = useState(0);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store"
    ).then((res) => {
      if (res.data.success) {
        setStores(() => {
          return res.data.data;
        });
      }
    });
  }, []);

  useEffect(() => {
    setTotal(TotalFieldData.reduce(function (accumulator, currentValue) {
      return accumulator + parseInt(currentValue.fieldPercentage);
    }, 0))
  }, [TotalFieldData, id])

  const getReadinessData = useCallback(() => {
    dispatch(setAddLoading(true))

    GetReadinessAPI(id)
      .then((res) => {
        var response = res.data;
        if (response.success) {
          setData({
            id: response.data.id,
            name: response.data.name,
            storeId: response.data.storeid,
            percentage: response.data.percentage,
            recStatus: response.data.recStatus,
            rowVersion: response.data.rowVersion,
          });
          setSelectedStore(response.data.storeid)
          setTotalFieldData((response.data.readinessDetail.length !== 0) ? response.data.readinessDetail : [])
          setFieldsInitialValues(response.data.readinessDetail);
        }
        dispatch(setAddLoading(false))

      })
      .catch((err) => {
        dispatch(setAddLoading(false))
      });

  }, [id]);

  const getFieldsByStoreId = useCallback(() => {
    dispatch(setAddLoading(true))

    getProductFieldsByStoreId({
      pageIndex: 0,
      pageSize: 100,
      pagingStrategy: 0,
      sortingOptions: [
        {
          field: "name",
          direction: 0,
          priority: 0,
        },
      ],
    }).then((response) => {
      if (response.data.success) {
        let newObj = [];
        response.data.data.items.map((field, index, value) => {
          newObj = [...newObj, { label: field.displayName, value: field.id }];
        });
        setddFields(newObj);
      }
      dispatch(setAddLoading(false))
    }).catch(() => {
      dispatch(setAddLoading(false))
    })
  }, [id, selectedStore, data]);

  useEffect(() => {
    getFieldsByStoreId();
    getStoreDropdownData();
  }, []);

  useEffect(() => {
    getReadinessData()
  }, [isAddMode, id]);

  function createReadiness(fields, resetForm) {
    dispatch(setAddLoading(true))

    CreateReadinessAPI({ readinessModel: { ...fields, ...location } })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.readiness.readinessCreated,
            })
          );
          resetForm({});
          navigate(
            `${editURL}/${response.data.data.id}`
          );
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false))
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.readiness.readinessNotCreatede,
          })
        );
        dispatch(setAddLoading(false))
      });
  }
  function updateReadiness(fields, resetForm) {
    dispatch(setAddLoading(true))

    UpdateReadinessAPI({ readinessModel: { ...fields, ...location } })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.readiness.readinessUpdated,
            })
          );
          getReadinessData()
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.readiness.readinessNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  }

  function createReadinessDetails(fields, resetForm) {
    dispatch(setAddLoading(true))

    CreateOrUpdateRedinessDetailsAPI({ readinessFieldModel: { ...fields, ...location } })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.readinessDetails.readinessDetailsCreated,
            })
          );
          getReadinessData();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.readinessDetails.readinessDetailsNotCreated,
          })
        );
        dispatch(setAddLoading(false))
      })
  }

  const validationSchema =
    Yup.object().shape({
      storeId: Yup.number()
        .typeError(ValidationMsgs.readiness.storeIdTypeError)
        .required(ValidationMsgs.readiness.storeIdRequired),
      name: Yup.string().required(ValidationMsgs.readiness.nameRequired),
      recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
      percentage: Yup.number().typeError(ValidationMsgs.readinessDetails.percentageTypeError)
        .required(ValidationMsgs.readiness.percentageRequired)
        .max(100, ValidationMsgs.readinessDetails.percentageMax),
    });

  const fieldsValidationSchema =
    Yup.object().shape({
      readinessDetail: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.string().required(
              ValidationMsgs.readinessDetails.fieldIdRequired
            ),
            fieldPercentage: Yup.number()
              .required(ValidationMsgs.readinessDetails.percentageRequired)
              .typeError(
                ValidationMsgs.readinessDetails.percentageTypeError
              )
              .max(100, ValidationMsgs.readinessDetails.percentageMax),
          })
        )
        .required(
          ValidationMsgs.readinessDetails.readinessDetailsArray
        ),
      total: Yup.number().typeError(ValidationMsgs.readinessDetails.percentageTypeError).max(100, ValidationMsgs.readinessDetails.percentageMax)
    });

  const onSubmit = (fields, { resetForm }) => {
    if (isAddMode) {
      createReadiness(fields, resetForm);
    }
    else {
      updateReadiness(fields, resetForm)
    }
  };

  const SubmitFields = (fields, { resetForm }) => {
    if (!isAddMode) {
      createReadinessDetails(fields, resetForm);
    }
  };
  const initialValues = {
    id: data?.id || 0,
    storeId: data?.storeId || "",
    name: data?.name || "",
    percentage: data?.percentage || "",
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    rowVersion: data?.rowVersion || null,
  };


  return (
    <>
      <title>{isAddMode ? `Add ${title} Ready` : `Edit ${title} Ready`}</title>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={true}
      >
        {({ errors, setFieldValue, values }) => {
          setSelectedStore(values.storeId)
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 pt-8 w-full">
                <div className="flex mb-8 justify-between">
                  <div className="flex items-center">
                    <NavLink
                      to={listUrl}
                      className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                    >
                      <span className="material-icons-outlined">west</span>
                    </NavLink>
                    <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                      {isAddMode ? `Add ${title} Ready` : `Edit ${title} Ready`}
                    </h1>
                  </div>
                  {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap space-x-2">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={GlobalLoading}
                      type="submit"
                      className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                      onClick={() => {
                        dispatch(setAlertMessage({ type: "danger", message: serverError({ data: { errors: errors } }) }));
                      }}
                    >
                      <div className={`w-full flex justify-center align-middle `}>
                        {GlobalLoading && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        Save
                      </div>
                    </button>
                  </div>}
                </div>
                <Messages />
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full xl:col-span-9">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="w-full last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          {"Store Name"}

                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Dropdown
                          defaultValue={values.storeId}
                          name={"storeId"}
                          options={stores}
                          onChange={(data) => {
                            setSelectedStore(data.value);
                            setFieldValue("storeId", data.value);
                          }}
                        />
                      </div>
                      <div className="w-full last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          {"Readiness percentage required to publish product"}

                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <div className="w-full relative pr-7">
                          <div className="font-bold absolute right-2 top-2.5">
                            %
                          </div>
                          <InputNumber
                            displayError={true}
                            name="percentage"
                            defaultValue={values.percentage}
                            value={values.percentage}
                            className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                            onChange={(e) => {
                              setFieldValue(e.target.name, e.target.value);
                            }}
                            maxLength={3}
                            allowNegative={false}
                          />
                        </div>
                      </div>
                      <div className="w-full last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          {"Name"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Input name={"name"}
                          maxLength={60}
                        />
                      </div>
                    </div>

                  </div>
                  <div className="flex flex-col col-span-full xl:col-span-3">
                    <div className="w-full bg-white shadow-xxl rounded-md">
                      <div className="border-b-2 border-neutral-200 p-6">
                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                          {"Readiness Status"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <Dropdown
                          isMulti={false}
                          defaultValue={values.recStatus}
                          name={"recStatus"}
                          optionStyle={{ padding: "1px" }}
                          options={RecStatusValue}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: id || 0,
          readinessDetail: fieldsInitialValues.length > 0 ? fieldsInitialValues : [
            {
              id: 0,
              fieldPercentage: 0,
              rowVersion: "",
              recStatus: RecStatusValuebyName.Active
            }
          ],
        }}
        onSubmit={SubmitFields}
        validationSchema={fieldsValidationSchema}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ values, setFieldValue }) => {
          // console.log(values);
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-10 w-full">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full xl:col-span-9">
                    <div className="w-full grid bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
                      <div>
                        {isAddMode && (
                          <div className="flex flex-wrap uppercase font-bold text-sm mt-2 mb-1 ml-8 text-rose-500">
                            <span className="text-rose-500 text-2xl mr-2 ">
                              *
                            </span>
                            First Save Readiness To Add readiness percentage field
                          </div>
                        )}
                        {(!isAddMode) && (
                          <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                            <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                              <tr>
                                <th className="px-2 first:pl-5 py-4">
                                  <div className="font-semibold text-left w-32 max-w-sm flex items-center">
                                    <span>Name</span>
                                  </div>
                                </th>
                                <th className="px-2 first:pl-5 py-4">
                                  <div >
                                    <span>Percentage</span>
                                  </div>
                                </th>
                                {(permission?.isEdit || permission.isDelete) && <th className="px-2 first:pl-5 py-4">
                                  <div className="flex justify-end">
                                    <button
                                      disabled={GlobalLoading}
                                      type="submit"
                                      onClick={() => { setFieldValue("total", parseInt(Total)); }}
                                      className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                                    >
                                      <div className={`w-full flex justify-center align-middle `}>
                                        {GlobalLoading && (
                                          <span className="spinner-border spinner-border-sm mr-2"></span>
                                        )}
                                        Save Field Percentage
                                      </div>
                                    </button>
                                  </div>
                                </th>}
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                              <FieldArray
                                name="readinessDetail"
                                render={(fieldArrayProps) => {
                                  const { form } = fieldArrayProps;
                                  return (
                                    <>
                                      {
                                        form.values.readinessDetail !== undefined && form.values.readinessDetail.map(
                                          (value, i) => {
                                            return (
                                              <tr key={i}>
                                                <ReadinessDetail
                                                  fieldArrayProps={fieldArrayProps}
                                                  key={i}
                                                  values={values}
                                                  index={i}
                                                  setTotalFieldData={setTotalFieldData}
                                                  TotalFieldData={TotalFieldData}
                                                  value={value}
                                                  ddfields={ddfields}
                                                />
                                              </tr>
                                            );
                                          }
                                        )
                                      }

                                      {
                                        form.values.readinessDetail.length === 0 && <tr>
                                          <td></td>
                                          <td></td>
                                          <td className="px-2 first:pl-5 py-3">
                                            <div className="relative gap-2 text-right">
                                              <button
                                                type="button"
                                                className={"w-6 h-6 text-indigo-500"}
                                                onClick={() => {
                                                  {
                                                    fieldArrayProps.push({
                                                      id: "",
                                                      fieldPercentage: 0,
                                                      rowVersion: '',
                                                      recStatus: RecStatusValuebyName.Active
                                                    });
                                                  }
                                                }}
                                              >
                                                <span className="material-icons-outlined">add</span>
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      }


                                    </>
                                  );
                                }}
                              />
                            </tbody>
                            <tfoot className="text-sm font-bold uppercase text-[#b3b3b3] border-t-2 border-neutral-200">
                              <tr >
                                <td className="px-2 first:pl-5 py-3">
                                  <div>Total</div>
                                </td>

                                <td className="px-2 first:pl-5 py-3">
                                  <div>{parseInt(Total)}</div>
                                  <Input type="hidden" name={"total"} className="form-control" value={Total} />
                                </td>
                                <td className="px-2 first:pl-5 py-3"></td>
                              </tr>
                            </tfoot>
                          </table>
                        )}
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

export default Create;

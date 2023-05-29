/*Component Name: Create
Component Functional Details: User can create or update Create master details from here.
Created By: Ankit
Created Date: 10/10/2022
Modified By: Ankit
Modified Date: 10/10/2022 */

import { Form as FormikForm, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";
import { Link, useParams } from "react-router-dom";
import { RecStatusValue, RecStatusValuebyName } from "global/Enum";
import SportService from "services/admin/sports/SportService";
import DropdownService from "services/common/dropdown/DropdownService";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { useCallback } from "react";

const Create = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const [stores, setStores] = useState([]);
  
  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues(
      "store"
    ).then((res) => {
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

  useEffect(() => {
    getSportDetails();
  }, [id]);

  const getSportDetails = useCallback(() => {
    SportService.getSportByID(id)
      .then((res) => {
        var response = res.data;
        if (response.success) {
          setData({
            id: response.data.id,
            name: response.data.name,
            storeid: response.data.storeid,
            recstatus: response.data.recstatus
          });
        }
      })
      .catch((err) => { });
  }, [id])

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.sport.nameRequired),
    storeid: Yup.string().required(ValidationMsgs.sport.storeIdRequired),
    recstatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
  });

  function onSubmit(fields, { resetForm }) {
    if (isAddMode) {
      createSport(fields, resetForm);
    } else {
      updateSport(fields, resetForm);
    }
  }

  function createSport(fields, resetForm) {
    SportService.createSport({ ...fields })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: "Sport created successfully",
            })
          );
          resetForm({});
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: "Sport is not created",
          })
        );
      });
  }

  function updateSport(fields) {
    SportService.updateSport({ ...fields })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: "Sport updated successfully",
            })
          );
          getSportDetails();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            values: "0",
            type: "danger",
            message: "Sport is not updated",
          })
        );
      });
  }

  if (!isAddMode && Object.keys(data).length <= 0) {
    return "";
  }

  return (
    <>
      <title>{isAddMode === true ? "Add Sport" : "Edit Sport"}</title>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: data?.id || 0,
          storeid: data?.storeid || "",
          name: data?.name || "",
          recstatus: data?.recstatus || RecStatusValuebyName.Active,
          //rowVersion: data?.rowVersion || null,
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, errors, values }) => {
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex mb-8 justify-between">
                  <div className="flex items-center">
                    <Link
                      to={"/admin/StoreBuilder/sports"}
                      className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                    >
                      <span className="material-icons-outlined">west</span>
                    </Link>
                    <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                      {isAddMode === true ? "Add Sport" : "Edit Sport"}
                    </h1>
                  </div>
                  <div className="flex flex-wrap space-x-2">
                    <Link
                      className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                      to={"/admin/StoreBuilder/sports"}
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <Messages />
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full xl:col-span-9">
                    <div className="w-full grid grid-cols-2 gap-6 bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="w-full last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          {"Sport Name"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Input type={"text"} name="name" />
                      </div>
                      <div className="w-full last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          {"Store Name"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Dropdown
                          label="Store Name"
                          isMulti={false}
                          name="storeid"
                          options={stores}
                          defaultValue={values.storeid}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col col-span-full xl:col-span-3">
                    <div className="w-full bg-white shadow-xxl rounded-md">
                      <div className="p-6">
                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                          Sport Status
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <Dropdown
                          label="Sport Status"
                          isMulti={false}
                          name="recstatus"
                          options={RecStatusValue}
                          defaultValue={values.recstatus}
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
    </>
  );
};

export default Create;

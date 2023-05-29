/*Component Name: SKUSwap
Component Functional Details: User can create or update SKUSwap master details from here.
Created By: <Your Name>
Created Date: <Creation Date>
Modified By: Shrey Patel
Modified Date: June/23/2022 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { productType } from "dummy/Dummy";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Dropdown from "components/common/formComponent/Dropdown";
import SKUSwapService from "services/admin/masterCatalog/masterCatalog/products/SKUSwapService";
import SKUSwapStoreService from "services/admin/masterCatalog/store/product/SKUSwapService";
import SingleFieldUpdateService from "services/admin/masterCatalog/masterCatalog/products/SingleFieldUpdateService";
import SingleFieldUpdateStoreService from "services/admin/masterCatalog/store/product/SingleFieldUpdateService";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const SKUSwap = ({
  requiredFields,
  checkProductStatus,
  productstatusVal,
  displayFieldElement,
  fetchFieldProperty,
  fields,
  type,
  index,
  isAddMode,
  values: OldValues,
  setFormSubmit,
  setIsError,
  activeTab,
  readOnly,
  setSaveLoading
}) => {
  const formRef = useRef();
  const { id: CurrentId } = useParams();
  const dispatch = useDispatch();
  const [checkerror, setCheckError] = useState(false);
  const [SKUData, setSKUData] = useState([]);
  const [data, setData] = useState([]);

  const API = (type == productType.MC ? SKUSwapService : SKUSwapStoreService)
  const CreateUpdateAPI = (type == productType.MC ? SingleFieldUpdateService : SingleFieldUpdateStoreService)

  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  const initialValues = useMemo(() => {
    return {
      ourSKU: OldValues?.ourSKU,
      newSKU: OldValues?.newSKU || "",
    };
  }, [OldValues]);

  const schema = Yup.object({
    [fetchFieldProperty("dbfield", "newSKU")]:
      displayFieldElement(fields, "newSKU") &&
        requiredFields.indexOf("newsku") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.skuSwap.newSKURequired)
        : null,
  });

  const HandleSKUChange = (e, value, setFieldValue) => {
    setFieldValue("newSKU", value.value)
  };

  const submitHandler = (values) => {
    const obj = [
      {
        path: `/newSKU`,
        op: "Replace",
        from: "string",
        value: `${values?.newSKU}`
      }
    ]
    if (!isAddMode) {
      dispatch(setAddLoading(true))
      CreateUpdateAPI.updateSingleField(CurrentId, obj)
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                type: "success",
                message: ValidationMsgs.masterCatalog.skuSwap.updated,
              })
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
              message: ValidationMsgs.masterCatalog.skuSwap.notUpdated,
            })
          );
          dispatch(setAddLoading(false))
        });
    }
  };

  useEffect(() => {
    setIsError(checkerror);
  }, [checkerror]);

  useEffect(() => {
    if (!isAddMode) {
      API.getOurSKUList(CurrentId)
        .then((res) => {
          const NewSKUData = res?.data;
          if (NewSKUData.success) {
            setSKUData(() => { return NewSKUData.data });
          }
        })
        .catch((err) => { });
    }
  }, [productstatusVal]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={submitHandler}
        validationSchema={schema}
        validateOnChange={true}
        validateOnBlur={false}
        innerRef={formRef}
      >
        {({ errors, setFieldValue, values }) => {
          setCheckError(Object.keys(errors).length ? true : false);
          checkProductStatus(errors);
          return (
            <FormikForm>
              <div>
                {/* <div className="overflow-x-auto max-h-screen mt-7 pl-5 pr-5">
                  <input
                    type="search"
                    name="search"
                    placeholder="search"
                    className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pr-2 py-2 rounded-md"
                  />
                </div> */}
                <div className="overflow-x-auto max-h-screen mt-7 border-t border-neutral-200 overflow-visible" style={{ overflow: 'visible' }}>
                  <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                    <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                      <tr>
                        <th className="pt-4 py-3">
                          <div className="font-semibold text-left w-screen max-w-sm flex items-center">
                            <span className="first:pl-5">Old SKU</span>
                          </div>
                        </th>
                        <th className="pt-4 py-3">
                          <div className="font-semibold text-left w-screen max-w-sm flex items-center">
                            <span className="first:pl-5">New SKU</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {!readOnly &&
                        <tr>
                          {displayFieldElement(fields, "ourSKU") && (
                            <>
                              <td className="px-4  py-4">
                                <div className="w-full rounded-md border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg">
                                  {values?.ourSKU}
                                </div>
                              </td>
                            </>
                          )}

                          {displayFieldElement(fields, "newsku") && (
                            <>
                              <td className="px-4 py-4">
                                <div className="w-full rounded-md border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg">
                                  <Dropdown
                                    name={`newSKU`}
                                    options={SKUData}
                                    defaultValue={values?.newSKU}
                                    onChange={(value, e) => HandleSKUChange(e, value, setFieldValue)}
                                  />
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      }
                      {readOnly &&
                        data.map((value, index) => {
                          return (
                            <tr key={index}>
                              <>
                                <td className="px-4  py-4">
                                  <div className="w-full rounded-md border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg">
                                    {displayFieldElement(fields, "ourSKU") && (value.ourSKU)}
                                  </div>
                                </td>
                              </>
                              <>
                                <td className="px-4  py-4">
                                  <div className="w-full rounded-md border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg">
                                    {displayFieldElement(fields, "newSKU") && (value.newSKU)}
                                  </div>
                                </td>
                              </>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default SKUSwap;
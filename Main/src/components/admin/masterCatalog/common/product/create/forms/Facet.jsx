/*Component Name: Facet
Component Functional Details: User can create or update Facet master details from here.
Created By: <Your Name>
Created Date: <Creation Date>
Modified By: Chandan
Modified Date: 26/10/2022 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Formik, Form as FormikForm, FieldArray } from "formik";
import Input from "components/common/formComponent/Input";
import * as Yup from "yup";
import { RecStatusValuebyName } from "global/Enum"
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import FacetService from "services/admin/masterCatalog/store/product/FacetService";
import FacetServiceMaster from "services/admin/masterCatalog/masterCatalog/products/FacetService";
import DropdownService from "services/common/dropdown/DropdownService";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import CustomSearchDropDown from "components/common/formComponent/CustomSearchDropDown";
import { productType } from 'dummy/Dummy';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Facet = ({
  id,
  requiredFields,
  checkProductStatus,
  productstatusVal,
  displayFieldElement,
  fetchFieldProperty,
  fields,
  index,
  values,
  isAddMode,
  setFormSubmit,
  setIsError,
  activeTab,
  type,
  readOnly,
  getProductReadinessData,
  // getValidationForAllFilledFieldsFunc,
  clearCacheForBrandCategory
}) => {
  const permission = useSelector(store => store.permission);
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const [checkError, /* setCheckError */] = useState(false);
  const [data, setData] = useState([]);
  const location = useSelector((store) => store?.location);
  const formRef = useRef();
  const [facetValue, setFacetValue] = useState([]);
  const [facetValueFromDropDown, setFacetValueFromDropDown] = useState([]);
  const [ResetSearchTerm, setResetSearchTerm] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const API = (type == productType.MC ? FacetServiceMaster : FacetService)

  const fetchFacetDropDown = useCallback(
    () => {
      DropdownService.getDropdownValues("facetmaster").then((response) => {
        setFacetValueFromDropDown(() => {
          return response.data.data.map((value) => {
            return { label: value.label, value: value.label };
          })
        })
      });
      // }
    }, []);

  useEffect(() => {
    fetchFacetDropDown()
  }, [])

  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);


  const schema = Yup.object({
    [fetchFieldProperty("dbfield", "attributename")]:
      displayFieldElement(fields, "attributename") &&
        requiredFields.indexOf("attributename") > -1
        ? Yup.string().required(ValidationMsgs.attributes.nameRequired)
        : null,
    [fetchFieldProperty("dbfield", "attributevalue")]:
      displayFieldElement(fields, "attributevalue") &&
        requiredFields.indexOf("attributevalue") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.attributes.attributeValueRequired)
        : null,
  });

  const GetFacetDataById = () => {
    dispatch(setAddLoading(true))

    API.getFacetById(productId)
      .then((res) => {
        var FacetData = res?.data;
        if (FacetData?.success) {
          setData(FacetData?.data);
        }
        dispatch(setAddLoading(false))

      })
      .catch((err) => {
        dispatch(setAddLoading(false))

      });
  }

  useEffect(() => {
    setIsError(checkError);
    GetFacetDataById()
  }, [checkError, setIsError]);

  const createFacet = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    API.createFacet({
      productFacetModel: {
        id: 0,
        productId: productId,
        ...fields,
        ...location,
        rowVersion: "",
        recStatus: RecStatusValuebyName.Active,
      }
    }).then((response) => {
      if (response.data.success) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.masterCatalog.facet.created,
          })
        );
        getProductReadinessData()
        resetForm({})
        GetFacetDataById();
        clearCacheForBrandCategory()
      } else {
        dispatch(
          setAlertMessage({ type: "danger", message: serverError(response) })
        );
        dispatch(setAddLoading(false))

      }
      // getValidationForAllFilledFieldsFunc()
    })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.masterCatalog.facet.notCreated,
          })
        );
        dispatch(setAddLoading(false))

      });
  }

  const statusChangedHandler = (fields) => {
    dispatch(setAddLoading(true))

    if (!isAddMode && fields?.id) {
      setDeleteId(fields.id);
      const { browser, ...allLocationData } = location
      API.updateFacetStatus({
        args: {
          idsRowVersion: [
            {
              item1: fields?.id,
              item2: fields?.rowVersion
            }
          ],
          status: RecStatusValuebyName.Archived,
          ...allLocationData,
        }
      }).then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.masterCatalog.facet.deleted,
            })
          );
          GetFacetDataById();
          clearCacheForBrandCategory();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))

        }
      }).catch((errors) => {
        if (errors.response.data.Errors.Error) {
          dispatch(
            setAlertMessage({
              message: errors.response.data.Errors.Error,
              type: "danger",
            })
          );
        } else {
          dispatch(
            setAlertMessage({ message: ValidationMsgs.masterCatalog.facet.notDeleted, type: "danger" })
          );
        }
      });
      dispatch(setAddLoading(false))

    }
  };

  const submitHandler = (values, { resetForm }) => {
    if (!isAddMode) {
      createFacet(values, resetForm);
      setResetSearchTerm(!ResetSearchTerm)
    }
  };
  const fetchAttributeValue = (value) => {
    if (value && value !== "") {
      FacetService.fetchFacetByName(value.trim()).then((response) => {
        setFacetValue(response.data.data);
      });
    }
  }
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          attributename: "",
          attributevalue: "",
          rowVersion: '',
          recStatus: values?.recStatus || RecStatusValuebyName.Active
        }}
        validationSchema={schema}
        onSubmit={submitHandler}
        validateOnMount={true}
      >
        {({ errors, setFieldValue, values }) => {
          checkProductStatus(errors);
          return (
            <FormikForm>
              <div className="overflow-visible max-h-screen mt-7 border-t border-neutral-200">
                <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                  <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                    <tr>
                      <th className="pt-4 py-3">
                        <div className="font-semibold text-left w-screen max-w-sm flex items-center">
                          <span className="first:pl-5">Attribute Name</span>
                        </div>
                      </th>
                      <th className="pt-4 py-3">
                        <div className="font-semibold text-left w-screen max-w-sm flex items-center">
                          <span className="first:pl-5">Attribute Value</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(permission?.isEdit || permission?.isDelete) && <tr>
                      <td className="px-2 first:pl-5 py-3">
                        <CustomSearchDropDown displayError={true} options={facetValueFromDropDown} name={`attributename`} uniqueId={"dropDownElem_attributeName_unique"} defaultValue={values.attributename} onChange={(value) => { setFieldValue('attributename', value); fetchAttributeValue(value) }} />
                      </td>
                      <td className="px-2 first:pl-5 py-3">
                        {/* <BasicSearch name={`readinessDetail[0].attributevalue`} fieldName={"attributevalue"} fetchFacetValue={fetchFacetValue} facetQuery={facetQuery} facetValueFromDropDown={facetValue} uniqueId={"dropDownElem_attributeValue_unique"} ResetSearchTerm={ResetSearchTerm} /> */}
                        <CustomSearchDropDown displayError={true} options={facetValue} name={`attributevalue`} uniqueId={"dropDownElem_attributeValue_unique"} defaultValue={values.attributevalue} onChange={(value) => { setFieldValue('attributevalue', value); }} />
                      </td>
                      <td className="px-2 first:pl-5 py-3">
                        <button
                          disabled={GlobalLoading}
                          type="submit" className={`w-6 h-6 text-indigo-500`}>
                          {GlobalLoading ?
                            <span className="spinner-border spinner-border-sm mr-2"></span> : <span className="material-icons-outlined">add</span>
                          }
                        </button>
                      </td>
                    </tr>}
                    {data.length > 0 ?
                      data.map((values, i) => {
                        return (
                          <tr key={i} >
                            <td className="px-2 first:pl-5 py-3">
                              <span className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-3 rounded-md font-normal py-3`}>{values.attributeName}</span>
                            </td>
                            <td className="px-2 first:pl-5 py-3">
                              <span className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-3 py-3 rounded-md font-normal`}>{values.attributevalue}</span>
                            </td>
                            <td className="px-2 first:pl-5 py-3">
                              <button
                                type="button"
                                className={`w-6 h-6 text-rose-500`}
                                onClick={() => {
                                  statusChangedHandler(values);
                                }}
                              >
                                {(deleteId === values.id) ?
                                  <span className="spinner-border spinner-border-sm mr-2"></span> : <span className="material-icons-outlined cursor-pointer">
                                    delete
                                  </span>
                                }
                              </button>
                            </td>
                          </tr>
                        );
                      }) : <tr> <td colSpan={2}><p className="flex justify-center items-center p-5 rounded-t border-b sticky top-0 left-0 text-red-600 bg-white">No data found as of now.</p></td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </FormikForm>
          );
        }}
      </Formik >
    </>
  );
};

export default Facet;

/*Component Name: SizeChart
Component Functional Details: User can create or update SizeChart master details from here.
Created By: Vikas Patel
Created Date: -
Modified By: Shrey Patel
Modified Date: June/21/2022 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import CKEditor from "components/common/formComponent/CKEditor";
import Dropdown from "components/common/formComponent/Dropdown";
import { Formik, Form as FormikForm, Field } from "formik";
import SizeChartTable from "components/common/others/SizeChart";
import SizeChartService from "services/admin/sizeChart/SizeChartService";
import * as Yup from "yup";
import { productType } from "dummy/Dummy";
import { useDispatch } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import SingleFieldUpdateServiceStore from "services/admin/masterCatalog/store/product/SingleFieldUpdateService";
import SingleFieldUpdateService from "services/admin/masterCatalog/masterCatalog/products/SingleFieldUpdateService";
import { useParams } from "react-router-dom";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import UnsavedFormHandler from "./UnsavedFormHandler";
import ErrorHandler from "./ErrorHandler";

const SizeChart = ({
  SizeChartDataValues,
  setIsError,
  values,
  type,
  requiredFields,
  setFormSubmit,
  activeTab,
  index,
  isAddMode,
  fields,
  displayFieldElement,
  checkProductStatus,
  productstatusVal,
  fetchFieldProperty,
  readOnly,
  getProductReadinessData,
  // getValidationForAllFilledFieldsFunc,
  setsaveUnSavedFields,
  setWishedToChangeTab,
  clearCacheForBrandCategory

}) => {
  const API = type == productType.MC ? SingleFieldUpdateService : SingleFieldUpdateServiceStore;
  const [basicInfo, setBasicInfo] = useState(values);
  useEffect(() => {
    setBasicInfo(values);
  }, [values])
  const dispatch = useDispatch();
  const [SizeChartObj, setSizeChartObj] = useState({
    distinctX: [],
    distinctY: [],
    sizeChartViewdata: [],
  });

  const formRef = useRef();
  const [ChartId, setChartId] = useState(values?.sizeChartId);
  const [data, setData] = useState([]);

  const [SizeCharView, setSizeCharView] = useState(data && data?.sizeChartView && Object.keys(data?.sizeChartView[0]).length > 0 ? data?.sizeChartView : [{}]);
  const [checkerror, setCheckError] = useState(false);
  const [sizechartList, setsizechartList] = useState([]);

  const { id: CurrentId, storeId } = useParams();
  var serviceCall = [productType.EcommerceStore, productType.CorporateStore].includes(type) ? SizeChartService.getsizechartdropdownbybrandidwithstoreid : SizeChartService.getsizechartdropdownbybrandid

  let distinctX = [];
  let distinctY = [];
  const schema = Yup.object({
    [fetchFieldProperty("dbfield", "sizeChartId")]:
      displayFieldElement(fields, "sizeChartId") &&
        requiredFields.indexOf("sizeChartId") > -1
        ? Yup.string().required(ValidationMsgs.sizeChart.valueRequired)
        : null,
    // productstatus: Yup.string().required("Product Status is required"),
  });
  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  //Dropdown for Get SizeChart Id and Values
  useEffect(() => {
    serviceCall(values.brandId, storeId).then((response) => {
      setsizechartList(() => {
        return response.data.data;
      });
    });
  }, []);

  //  UseEffect for Get SizeChart By Id
  useEffect(() => {
    if (ChartId) {
      SizeChartService.getSizeChartMasterByID(ChartId)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            response.data.sizeChartView = JSON.parse(
              response.data.sizeChartView
            );

            setData([{ ...response.data }]);
            setSizeCharView([...response.data.sizeChartView])
            let Range = response.data.sizeChartRange;
            Range = Range.split(",");

            let mesurment = response.data.measurements;
            mesurment = mesurment.split(",");

            distinctY.push(...mesurment);
            distinctX.push(...Range);
            setSizeChartObj((prev) => {
              return {
                ...prev,
                distinctY: distinctY,
                distinctX: distinctX,
                sizeChartViewdata: response.data.sizeChartView,
              };
            });
          }
        })
        .catch((err) => { });
    }
  }, [ChartId]);

  useEffect(() => {
    setIsError(checkerror);
  }, [checkerror]);

  useEffect(() => {
    //setFieldValue('productstatus', productstatusVal)
  }, [productstatusVal]);

  const submitHandler = (values) => {
    const obj = [
      {
        path: `/sizeChartId`,
        op: "Replace",
        from: "string",
        value: values.sizeChartId
      },
      {
        path: `/sizeChartDescription`,
        op: "Replace",
        from: "string",
        value: values.sizeChartDescription
      }
    ]

    if (!isAddMode) {
      dispatch(setAddLoading(true))

      API.updateSingleField(CurrentId, obj)
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                type: "success",
                message: ValidationMsgs.sizeChart.sizeChartUpdated,
              })
            );
            getProductReadinessData();
            clearCacheForBrandCategory();
          } else {
            dispatch(
              setAlertMessage({ type: "danger", message: serverError(response) })
            );
          }
          // getValidationForAllFilledFieldsFunc()
          dispatch(setAddLoading(false))

        })
        .catch((errors) => {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: ValidationMsgs.sizeChart.sizeChartNotUpdated,
            })
          );
          dispatch(setAddLoading(false))

        });
    }
  }

  useEffect(() => {
    setWishedToChangeTab(false)
  }, []);

  const InitialData = {
    sizeChartId: basicInfo?.sizeChartId || "",
    sizeChartDescription: basicInfo?.sizeChartDescription || "",
    productstatus: productstatusVal,
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={InitialData}
        validationSchema={schema}
        onSubmit={submitHandler}
        innerRef={formRef}
        validateOnMount={true}
      >
        {({ errors, setFieldValue, values }) => {
          // setCheckError(Object.keys(errors).length ? true : false);
          checkProductStatus(errors);
          return (
            <FormikForm>
              <ErrorHandler setIsError={setIsError} errors={errors} checkProductStatus={checkProductStatus} />
              <UnsavedFormHandler values={values} setsaveUnSavedFields={setsaveUnSavedFields} InitialData={InitialData} />

              <Field
                type="hidden"
                name="productstatus"
                id="productstatus"
                className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
              />
              <div className="panel-10 tab-content p-6">
                {/* SIZE CHART start */}
                <div className="w-full">
                  {displayFieldElement(fields, "sizeChartId") && (
                    <>
                      <div className="mb-6 last:mb-0">
                        <div className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                          Add Size Chart to Product
                          {requiredFields.indexOf("sizeChartId") >= 0 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                        </div>
                        <Dropdown
                          label="sizeChartId"
                          isMulti={false}
                          name={"sizeChartId"}
                          options={sizechartList}
                          isSearchable={true}
                          defaultValue={values?.sizeChartId}
                          onChange={(data) => {
                            setFieldValue('sizeChartId', data.value);
                            setChartId(data?.value)
                          }}
                          isDisabled={readOnly}
                        />
                      </div>
                    </>
                  )}

                  <div className="mb-6 last:mb-0">
                    <div className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                      Size Chart Preview
                    </div>
                    <div className="rounded-lg shadow-lg p-4 border border-neutral-200">
                      {values?.sizeChartId ? (
                        <SizeChartTable
                          readOnly={readOnly}
                          // setFieldValue={setFieldValue}
                          SizeChartDataValues={SizeChartDataValues}
                          SizeChartObj={SizeChartObj}
                          data={SizeCharView}
                          ChartId={ChartId}
                        />
                      ) : (
                        <h1 className="text-rose-500">
                          Please Select Product Size First
                        </h1>
                      )}
                    </div>
                  </div>
                  {displayFieldElement(fields, "sizeChartDescription") && (
                    <>
                      <div className="mb-6 last:mb-0">
                        <div className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                          Size Chart Template Description
                        </div>
                        <CKEditor
                          id="sizeChartDescription"
                          name="sizeChartDescription"
                          defaultValue={values.sizeChartDescription}
                          readOnly={readOnly}
                          onChange={(value) => {
                            setFieldValue("sizeChartDescription", value);
                          }}
                          loading={basicInfo?.sizeChartDescription}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default SizeChart;

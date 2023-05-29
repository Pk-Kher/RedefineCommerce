/*Component Name: Create
Component Functional Details: User can create or update Create master details from here.
Created By: Shrey Patel
Created Date: 
Modified By: Shrey Patel
Modified Date: 06/13/2022 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useNavigate, useParams } from "react-router-dom";
import SizeChartService from "services/admin/sizeChart/SizeChartService";
import Messages from "components/common/alerts/messages/Index";
import SizeChartValue from "components/admin/masterCatalog/common/product/create/forms/SizeChart";
import Input from "components/common/formComponent/Input";
import ToolTipComponent from "components/common/ToolTips";
import Dropdown from "components/common/formComponent/Dropdown";
import DropdownService from "services/common/dropdown/DropdownService";
import SizeChart from "../../../../../common/others/SizeChart";
import CKEditor from "components/common/formComponent/CKEditor";
import { RecStatusValueForForm, RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import SizeChartView from "components/admin/masterCatalog/common/product/create/views/SizeChartView";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { ToolTipsMessages } from "global/ToolTipsMessages";

const Create = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  let navigate = useNavigate();
  const location = useSelector((store) => store?.location);

  const { id } = useParams();
  const isAddMode = !id;

  const [SizeChartObj, setSizeChartObj] = useState({
    distinctX: [],
    distinctY: [],
    sizeChartViewdata: [],
  });

  const [hidden] = useState(true);
  const [hide, setHide] = useState(false);
  const [brandOptions, setBrandOptions] = useState([]);
  const CLickMsg = useRef(null);

  let distinctX = [];
  let distinctY = [];
  let tableDataArray = {};

  const initialValues = {
    name: data?.name || "",
    brandId: data?.brandId || "",
    sizeChartView: data.sizeChartView || [],
    // productType: data?.productType || "",
    sizeChartRange: data?.sizeChartRange || "",
    description: data?.description || "",
    measurements: data?.measurements || "",
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    rowVersion: data?.rowVersion || null,
    // RowVersion,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(
      ValidationMsgs.sizeChart.sizeChartTemplateNameRequired
    ),
    // productType: Yup.number().required("Product Type is required."),
    brandId: Yup.number()
      .typeError(ValidationMsgs.common.brandIdTypeError)
      .required(ValidationMsgs.common.brandIdRequired),
    sizeChartRange: Yup.string().required(
      ValidationMsgs.sizeChart.sizeChartRangeRequired
    ),
    description: Yup.string().required(
      ValidationMsgs.sizeChart.descriptionRequired
    ),
    measurements: Yup.string().required(
      ValidationMsgs.sizeChart.measurementRequired
    ),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
  });

  const DataFillMsg = () => {
    if (!id) {
      if (SizeChartObj.distinctY.length < 1) {
        return (
          <div>
            <p className="flex flex-wrap uppercase font-bold text-sm mb-4 mt-4 text-rose-500 ">
              <span className="text-rose-500 text-2xl leading-none">*</span>
              Add Size Chart Range & Mesurment First To Preview Product Size
              Chart
            </p>
          </div>
        );
      }
    }
  };


  // This handleClick is for SizeChart Table
  const handleClick = (values) => {
    if (values.sizeChartRange) {
      distinctX.push(values.sizeChartRange);
      if (values.sizeChartRange.includes(",")) {
        let dataX = values.sizeChartRange.split(",");
        let newDataXAry = [...dataX];
        distinctX = newDataXAry;
      }
      setSizeChartObj((prev) => ({
        ...prev,
        distinctX,
      }));
    }
    if (values.measurements) {
      distinctY.push(values.measurements);
      if (values.measurements.includes(",")) {
        let dataY = values.measurements.split(",");
        let newDataYAry = [...dataY];
        distinctY = newDataYAry;
      }
      setSizeChartObj((prev) => ({
        ...prev,
        distinctY,
        sizeChartViewdata: data.sizeChartView,
      }));
    }
    setHide(!hide);
  };

  const HandleOnBlurRange = (values) => {
    let distinctX = values
      .trim()
      .split(",")
      .filter((value) => value !== "");
    setSizeChartObj((prev) => {
      return { ...prev, distinctX: distinctX };
    });
    return distinctX.join(",");
  };

  const HandleOnBlurMeasurement = (values) => {
    let distinctY = values
      .trim()
      .split(",")
      .filter((value) => value !== "");
    setSizeChartObj((prev) => {
      return { ...prev, distinctY: distinctY };
    });
    return distinctY.join(",");
  };

  const createSizeMaster = (fields, { resetForm }) => {
    dispatch(setAddLoading(true))

    SizeChartService.createSizeChartMaster({ ...fields, ...location })
      .then((response) => {
        if (response.data.success && response?.data?.data?.id) {
          // setisDesabledAddProductSize(response.data.data.id);
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.sizeChart.sizeChartCreated,
            })
          );
          setHide(!hide);
          resetForm({});
          dispatch(setAddLoading(false));
          return navigate(`/admin/MasterCatalog/Configuration/sizeChart/edit/${response?.data?.data?.id}`);
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
            message: ValidationMsgs.sizeChart.sizeChartNotCreated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const updateSizeMaster = (fields) => {
    dispatch(setAddLoading(true))

    fields.id = Number(id);
    fields.RowVersion = data?.rowVersion;
    SizeChartService.updateSizeChartMaster({ ...fields, ...location })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.sizeChart.sizeChartUpdated,
            })
          );
          getSizeChartMaster()
          setHide(!hide);
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
            message: ValidationMsgs.sizeChart.sizeChartNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const SizeChartDataValues = (e, dataY, X) => {
    tableDataArray[dataY + X] = e.target.value;
  };

  const submitHandler = (fields, resetForm) => {
    if (isAddMode) {
      fields.sizeChartView = JSON.stringify([tableDataArray]) || [];
      createSizeMaster(fields, resetForm);
    } else {
      const updateTableData = { ...fields.sizeChartView[0], ...tableDataArray };
      fields.sizeChartView = JSON.stringify([updateTableData]) || [];
      updateSizeMaster(fields, resetForm);
    }
  };

  const getSizeChartMaster = useCallback(() => {
    dispatch(setAddLoading(true))

    SizeChartService.getSizeChartMasterByID(id)
      .then((res) => {
        var response = res.data;
        if (response.success) {
          response.data.sizeChartView = JSON.parse(
            response.data.sizeChartView
          );

          setData({ ...response.data });
          let mesurment = response.data.measurements;
          mesurment = mesurment.split(",");

          let Range = response.data.sizeChartRange;
          Range = Range.split(",");

          distinctX.push([...mesurment]);
          distinctY.push([...Range]);
          // distinctY.push(response.data.sizeChartRange)
          setSizeChartObj((prev) => {
            return { ...prev, distinctY: distinctY, distinctX: distinctX };
          });
        }
        dispatch(setAddLoading(false))
      })
      .catch((err) => {
        console.log("error while fetching particular Size Chart Detail", err);
        dispatch(setAddLoading(false))
      });
  }, [id])

  //  UseEffect for Get SizeChart By Id
  useEffect(() => {
    if (id) {
      getSizeChartMaster();
    }
  }, [id]);

  // Dropdown For Brand Name Listing
  useEffect(() => {
    DropdownService.getDropdownValues("brand").then((response) => {
      setBrandOptions(response.data.data);
    });

  }, []);

  return (
    <>
      <title>{isAddMode === true ? "Add Size Table" : "Edit Size Table"}</title>
      {/* Page header  */}
      <Formik
        onSubmit={submitHandler}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        validateOnMount={true}
      >
        {({ errors, setFieldValue, values, validateForm }) => {
          return (
            <Form>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">

                <CreateFileHeader url="/admin/MasterCatalog/Configuration/sizeChart" module={`${isAddMode ? 'Create' : 'Edit'} Size Table`} errors={errors} validateForm={validateForm} />
                <Messages />
                {/* Size ChartTemplate Name */}
                <div className="grid grid-cols-12 gap-6 pt-5">
                  <div className="col-span-full xl:col-span-9">
                    <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="p-0 mb-4 last:mb-0">
                        {/* Size Chart Template Name */}
                        <div className="w-full  mb-6 last:mb-0">
                          <div className="w-full px-2 py-2">
                            <label className="text-gray-500 font-bold flex">
                              Size Chart Template Name
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </label>
                          </div>
                          <div className="w-full px-2 py-2 pt-0">
                            <Input
                              className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                              type="text"
                              name="name"
                              maxLength={300}
                            />
                          </div>
                        </div>
                        {/* Dropdown list */}
                        <div className="w-full px-2 py-2 pt-0 last:mb-0">
                          <div className="text-gray-500 font-bold flex">
                            Brand Name
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </div>
                          <div >
                            <Dropdown
                              label="Select Parent"
                              isMulti={false}
                              name="brandId"
                              placeholder={"Search..."}
                              className="bg-white hover:border-neutral-300"
                              options={brandOptions}
                              defaultValue={values.brandId}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="w-full last:mb-0">
                          <div className="w-full px-2 ">
                            <label className="text-gray-500 font-bold flex">
                              Description
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </label>
                          </div>
                          <div className="w-full px-2 py-2 pt-0">
                            <CKEditor
                              name={"description"}
                              id="description"
                              defaultValue={values.description}
                              loading={initialValues?.description}
                            />
                          </div>
                        </div>
                        {/* Size Chart Range */}
                        <div className="w-full mb-4  last:mb-0">
                          <div className="flex items-center">
                            <label className="text-gray-500 text-xxl font-bold mb-2 px-2 flex">
                              <span>
                                {" "}
                                Size Chart Range{" "}
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </span>
                            </label>
                            <ToolTipComponent
                              id="TooltipsSizeChartRange"
                              message={ToolTipsMessages.SizeChartTooltips.TooltipsSizeChartRange}
                            />
                          </div>
                          <div className="w-full px-2 py-2 pt-0">
                            <Input
                              className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                              placeholder="Length, Bust, Sholder, Sleeve"
                              type="text"
                              name="sizeChartRange"
                              maxLength={4000}
                              onBlur={(e) =>
                                setFieldValue(
                                  "sizeChartRange",
                                  HandleOnBlurRange(e.target.value)
                                )
                              }
                            />
                            <label className="text-gray-500 text-sm">
                              Insert the sizes separated by comma
                            </label>
                          </div>
                        </div>
                        {/* Measurements */}
                        <div className="w-full mb-4 last:mb-0">
                          <div className="flex items-center">
                            <label className="text-gray-500 text-xxl font-bold mb-2 px-2 flex">
                              <span>
                                {" "}
                                Measurements{" "}
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>{" "}
                              </span>
                            </label>
                            <ToolTipComponent
                              id="ToolstipsMeasurements"
                              message={ToolTipsMessages.SizeChartTooltips.ToolstipsMeasurements}
                            />
                          </div>
                          <div className="w-full px-2 py-2 pt-0">
                            <Input
                              className="block w-full bg-white border6 border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                              disabled={SizeChartObj.distinctX.length < 1}
                              placeholder="XS, S, M, L"
                              type="text"
                              name="measurements"
                              maxLength={300}
                              onBlur={(e) =>
                                setFieldValue(
                                  "measurements",
                                  HandleOnBlurMeasurement(e.target.value)
                                )
                              }
                            />
                            <label className="text-gray-500 text-sm">
                              Insert the measurement names separated by comma
                            </label>
                          </div>
                        </div>
                        {/* Preview & Edit Value */}
                        <div className="w-full flex mb-4 ">
                          <div className="relative w-full px-2 py-2">
                            <span
                              ref={CLickMsg}
                            // onClick={() => {
                            //   TimeoutMsg();
                            // }}
                            >
                              <button
                                className="border-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-500"
                                type="button"
                                onClick={() => handleClick(values)}
                                disabled={SizeChartObj.distinctY.length < 1}
                              >
                                <span
                                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                  type="button"
                                >
                                  Preview & Edit Value
                                </span>
                              </button>
                            </span>
                            {/* Message to show when SizeChartRange and Mesurment data is not Given */}
                            {DataFillMsg()}
                            {/* Table for Preview & Edit */}
                            {hide && (values?.sizeChartRange.length > 0 && values?.measurements.length > 0) && (
                              <SizeChart
                                hide={hide}
                                setHide={setHide}
                                setFieldValue={setFieldValue}
                                SizeChartDataValues={SizeChartDataValues}
                                SizeChartObj={SizeChartObj}
                                data={values.sizeChartView}
                              />
                            )}
                          </div>
                        </div>
                        {!hidden && (
                          <SizeChartValue
                            setFieldValue={setFieldValue}
                            SizeChartDataValues={SizeChartDataValues}
                            SizeChartObj={SizeChartObj}
                            data={values.sizeChartView}
                          />
                        )}
                        {!hidden && (
                          <SizeChartView
                            SizeChartDataValues={SizeChartDataValues}
                            SizeChartObj={SizeChartObj}
                            data={values.sizeChartView}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col col-span-full xl:col-span-3">
                    <div className="w-full bg-white shadow-xxl rounded-md">
                      <div className="border-b-2 border-neutral-200 p-6">
                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                          Size Table Status
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <Dropdown
                          isMulti={false}
                          defaultValue={values.recStatus}
                          name={"recStatus"}
                          optionStyle={{ padding: "1px" }}
                          className="bg-white hover:border-neutral-300"
                          options={RecStatusValueForForm}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Create;

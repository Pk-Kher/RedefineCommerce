/*Component Name: SizeChartView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Shrey Patel
Modified Date: June/14/2022 */
import React, { useState, useEffect, useMemo } from "react";
import SizeChartService from "services/admin/sizeChart/SizeChartService";
import SizeChartViewTable from "components/common/others/SizeChart";
import { Formik, Form as FormikForm } from "formik";

const SizeChartView = ({
  SizeChartDataValues,
  displayFieldElement,
  fetchFieldProperty,
  disabled = true,
  productstatusVal,
  fields,
  values,
  requiredFields,
  tab,
  setActiveTab,
  index,
}) => {

  const [SizeChartObj, setSizeChartObj] = useState({
    distinctX: [],
    distinctY: [],
    sizeChartViewdata: [],
  });

  const [data, setData] = useState([]);
  let distinctX = [];
  let distinctY = [];

  const initialValues = useMemo(() => {
    return {
      sizeChartId: values?.sizeChartId,
      sizeChartDescription: values?.sizeChartDescription || "",
      measurements: data?.measurements || "",
      sizeChartRange: data?.sizeChartRange || "",
      sizeChartView: data?.sizeChartView || [],
    };
  }, [data]);

  useEffect(() => {
    SizeChartService.getSizeChartMasterByID(values.sizeChartId)
      .then((res) => {
        var response = res.data;
        if (response.success) {
          response.data.sizeChartView = JSON.parse(response.data.sizeChartView);

          setData({ ...response.data });
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
  }, [values.sizeChartId]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initialValues}>
        {({ errors, values }) => {
          return (
            <FormikForm>
              <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-4">
                <div className="flex items-center justify-between">
                  <div
                    className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"

                  >
                    {tab.label}
                  </div>
                  <div className="">
                    <span
                      className="text-indigo-500 cursor-pointer"
                      onClick={() => {
                        setActiveTab(index);
                      }}
                    >
                      Edit
                    </span>
                  </div>
                </div>


                <div className="px-6 py-4 border-b-4 border-neutral-200 last:border-b-0">
                  {displayFieldElement(fields, "sizechart") && (
                    <>
                      <div className="mb-6 last:mb-0 grid grid-cols-3 gap-2 items-center">
                        <label className="col-span-1 text-xs font-semibold text-gray-500 uppercase">
                          {fetchFieldProperty("displayname", "sizechart")}
                          {requiredFields.indexOf("sizechart") >= 0 && (
                            <>
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </>
                          )}
                          :
                        </label>
                        <div className="col-span-2">{data?.name}</div>
                      </div>
                    </>
                  )}
                  <div className="mb-6 last:mb-0 grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase">
                      Size Chart Preview &nbsp; :
                    </div>
                  </div>
                  <div className="col-span-2 rounded-lg shadow-lg p-4 border border-neutral-200 mb-5">
                    <div className="overflow-auto">
                      {values?.sizeChartId && (
                        <SizeChartViewTable
                          disabled={disabled}
                          // setFieldValue={setFieldValue}
                          SizeChartDataValues={SizeChartDataValues}
                          SizeChartObj={SizeChartObj}
                          data={data && data?.sizeChartView}
                        />
                      )}
                    </div>
                  </div>
                  {displayFieldElement(fields, "description") && (
                    <>
                      <div className="mb-6 last:mb-0 grid grid-cols-3 gap-2">
                        <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase">
                          Size Chart Template Description &nbsp; :
                        </div>
                        <div
                          className="col-span-2"
                          dangerouslySetInnerHTML={{
                            __html: data?.description,
                          }}
                        ></div>
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

export default SizeChartView;

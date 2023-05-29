/*Component Name: Size Chart Table
Component Functional Details: User can create or update Create master details from here.
Created By: Shrey Patel
Created Date: 
Modified By: Shrey Patel
Modified Date: 06/13/2022 */

import React, { useEffect, useState } from "react";
import Input from "components/common/formComponent/Input";
import { Link } from "react-router-dom";

const SizeChart = ({
  SizeChartObj,
  SizeChartDataValues,
  data,
  ChartId,
  readOnly,
}) => {
  let { distinctX, distinctY, sizeChartViewdata } = SizeChartObj;

  const [, /* DataValue */ setDataValue] = useState({});
  const [chartList, setChartList] = useState([]);

  let DataObjarray = [];

  useEffect(() => {
    let i;
    for (i = 0; i < distinctX.length; i++) {
      DataObjarray.push({
        range: distinctY[i],
        Maeasure: distinctX[i],
        value:
          sizeChartViewdata && sizeChartViewdata.length > 0
            ? sizeChartViewdata[0][distinctY[i] + distinctX[i]]
            : 0,
      });
    }

    setChartList(DataObjarray);
  }, [sizeChartViewdata]);

  useEffect(() => {
    if (chartList.length > 0) {
      let obj = {};
      let chartData = [];
      for (let row = 0; row < distinctY.length; row++) {
        for (let column = 0; column < distinctX.length; column++) {
          obj = {
            ...obj,
            [chartList[row]?.range + chartList[column]?.Maeasure]:
              chartList[column]?.value,
          };

          chartData = [
            ...chartData,
            {
              range: distinctY[row],
              Maeasure: distinctX[column],
              value:
                sizeChartViewdata && sizeChartViewdata.length > 0
                  ? sizeChartViewdata[0][distinctY[row] + distinctX[column]]
                  : 0,
            },
          ];
        }
      }
      setDataValue(chartData);
    }
  }, [chartList]);

  return (
    <>
      <div className={`bg-white flex w-full overflow-auto`}>
        <div className={`w-full py-2`}>
          <table className={`table-auto w-full border`}>
            <thead
              className={`text-xs font-semibold uppercase text-gray-500 bg-slate-50 border-t border-b border-neutral-200`}
            >
              <tr>
                <th
                  className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap`}
                >
                  <div className={`font-semibold text-left w-52`}>{`Size`}</div>
                </th>
                {distinctX.map((value, index) => {
                  return (
                    <th
                      className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap`}
                      key={index}
                    >
                      <div className={`font-semibold text-left`}>{value}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className={`text-sm divide-y divide-slate-200`}>
              {distinctY.map((dataY, index) => {
                const objectLInsideSizeArray = data.length > 0 ? Object.keys(data[0]) : []

                return (
                  <tr key={index}>
                    {(distinctX.length > 0 && dataY.length > 0) ?
                      <>
                        <td
                          className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap`}
                        >
                          <div className={`font-medium text-gray-800`}>{dataY}</div>
                        </td>

                        {distinctX.map((X, index) => (

                          <td
                            className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap`}
                            key={index}
                          >
                            <div className={`font-medium text-gray-800`}>
                              {readOnly === false ? <span>{(data && objectLInsideSizeArray?.length > 0) && data[0][dataY + X]} {data[0][dataY + X] === undefined && "0"}</span> :
                                <Input
                                  onChange={(e) => SizeChartDataValues(e, dataY, X)}
                                  name={`${dataY + X}`}
                                  placeholder={`0`}
                                  type={`text`}
                                  defaultValue={(data && objectLInsideSizeArray.length > 0) ? data[0][dataY + X] : "0"}
                                />
                              }
                            </div>
                          </td>
                        ))
                        }
                      </>
                      :
                      <td className="text-rose-500 w-full text-center px-0.5">
                        Please Add Size Chart Data  <Link to={`/admin/MasterCatalog/Configuration/sizeChart/edit/${ChartId}`}>First</Link>
                      </td>
                    }
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SizeChart;

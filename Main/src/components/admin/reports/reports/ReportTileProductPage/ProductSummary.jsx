import React, { useState, useEffect, useCallback, useMemo } from "react";
import Select from "components/common/formComponent/Select";
import DropdownService from "services/common/dropdown/DropdownService";
import ProductService from "services/admin/reports/product/productServices";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import { RandomColors } from "global/Enum";
import { NavLink } from "react-router-dom";
const ProductSummary = () => {
  const [storeData, setStoreData] = useState([]);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [circleData, setCircleData] = useState(data);
  const [store, setStore] = useState({
    label: "",
    value: "",
  });
  useEffect(() => {
    setCircleData(data);
  }, [data]);

  const [tempCircleData, settempCircleData] = useState([]);
  let newButtonObject = useMemo(() => data, [circleData]);

  const circleButtonHandle = (buttonData, e) => {
    const currentButton = e.currentTarget.name;

    if (
      tempCircleData.length === 0 ||
      !tempCircleData.includes(currentButton)
    ) {
      settempCircleData((prevData) => {
        setCircleData(
          (prevButtonObj) => {
            return prevButtonObj.filter(
              (btnObj) => btnObj.name !== currentButton
            );
          },
          [currentButton]
        );
        return [...prevData, currentButton];
      });
    } else {
      const newTempCircleData = [...tempCircleData];

      const newTemp = newTempCircleData.filter((element) => {
        return element !== currentButton;
      });

      const newTempCirc = newButtonObject.filter((element) => {
        return element.name == currentButton;
      });

      setCircleData((prevButtonObj) => {
        return [...prevButtonObj, newTempCirc[0]];
      });

      settempCircleData(() => {
        return newTemp;
      });
    }
  };

  const getProductSummaryReport = useCallback(() => {
    ProductService.productSummary(store?.value ? store?.value : 0).then((res) => {
      if (res.data.success) {
        const updatedProductSummaryArray = res.data.data.map((order, index) => {
          order["color"] = RandomColors[index];
          order["name"] = order.label;
          order["value"] = Number(order.value);
          return order;
        });
        setData(updatedProductSummaryArray);
      }
    });
  }, [store]);

  const Export = () => {
    dispatch(setAddLoading(true));
    ProductService.exportProductSummary(store?.value)
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.commonExport.success,
            })
          );
          window.location.href = response.data.data;
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
        }
        dispatch(setAddLoading(false));
      })
      .catch((error) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.commonExport.failed,
          })
        );
        dispatch(setAddLoading(false));
      });
  };

  useEffect(() => {
    getProductSummaryReport();
  }, [getProductSummaryReport, store?.value]);

  const color = {
    "Sold Product": "#86EFAC",
    "Unsold Product": "#FDA4AF",
  };

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store").then((res) => {
      if (res?.data?.success && res?.data?.data) {
        setStoreData(() => {
          return res.data.data;
        });
        if (res?.data?.data?.length > 0) {
          setStore(res?.data?.data[0]);
        }
      }
    });
  }, []);

  useEffect(() => {
    getStoreDropdownData();
  }, [getStoreDropdownData]);

  return (
    <>
      <title>Product summary</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="flex justify-between mb-8">
          <div className="flex items-center">
            <NavLink
              className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
              to={"/admin/reports"}
            >
              <span className="material-icons-outlined">west </span>
            </NavLink>
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Product summary
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="text-indigo-500" onClick={Export}>
              Export
            </button>
            <Select
              onChange={(e) => {
                if (e) {
                  setStore((prevState) => ({
                    ...prevState,
                    label: e.label,
                    value: e.value,
                  }));
                } else {
                  setStore({});
                }
              }}
              isClearable={false}
              defaultValue={store?.value}
              classNames={"w-[200px]"}
              options={storeData}
              isMulti={false}
            />
          </div>
        </div>
        <Messages />
        <div className="bg-white shadow-xxl rounded-md mb-8">
          <div className="text-center p-3">
            <div className="inline-block">
              <PieChart width={400} height={300}>
                <Pie
                  dataKey="value"
                  data={circleData}
                  cx={190}
                  cy={150}
                  innerRadius={82}
                  outerRadius={120}
                >
                  {circleData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="px-3 pt-2 pb-3">
              <ul className="flex flex-wrap justify-center">
                <li className="margin: 0.25rem">
                  {data?.map((button, index) => {
                    return (
                      <button
                        className={`btn-xs bg-white border-y-neutral-900 border-x-slate-900 shadow-neutral-900 mr-2 ${tempCircleData.some(
                          (allButton) => allButton === button.name
                        ) && "opacity-20"
                          }`}
                        key={index}
                        type="button"
                        name={button.name}
                        onClick={(e) => circleButtonHandle(button, e)}
                      >
                        <span
                          className={`block w-2 h-2 bg-gray-300 rounded-sm mr-2`}
                          style={{
                            backgroundColor: button.color,
                          }}
                        ></span>

                        <span className={`flex items-center`}>
                          {button.name}
                        </span>
                      </button>
                    );
                  })}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSummary;

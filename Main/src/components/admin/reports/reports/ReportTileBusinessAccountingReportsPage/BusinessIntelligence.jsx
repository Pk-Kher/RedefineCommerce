import React, { useState, useEffect, useCallback } from "react";
import Select from "components/common/formComponent/Select";
import DropdownService from "services/common/dropdown/DropdownService";
import BarCharts from "../Chart/BarCharts";
import LineCharts from "../Chart/LineCharts";
import CircleChart from "../Chart/CircleChart";
import ScatterCharts from "../Chart/ScatterCharts";
import BusinessIntelligenceServices from "services/admin/reports/businessAccountingReports/BusinessIntelligenceServices";
import { Bar, XAxis, YAxis, Tooltip, Line } from "recharts";
import { serverError } from "services/common/helper/Helper";
import { RandomColors } from "global/Enum";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";

const BusinessIntelligence = () => {
  const dispatch = useDispatch();
  const [storeData, setStoreData] = useState([]);
  const [allTimeRevenue, setAllTimeRevenue] = useState([]);
  const [allTimeNumberOfOrders, setAllTimeNumberOfOrders] = useState([]);
  const [allTimeCustomer, setAllTimeCustomer] = useState([]);
  const [allTimeAverageRevenue, setAllTimeAverageRevenue] = useState([]);
  const [allTimeAverageOrders, setAllTimeAverageOrders] = useState([]);
  const [allTimeAverageCustomers, setAllTimeAverageCustomers] = useState([]);
  const [top10SellingDaysByRevenueDate, setTop10SellingDaysByRevenueDate] =
    useState([]);
  const [top10SellingDaysByRevenueTime, setTop10SellingDaysByRevenueTime] =
    useState([]);
  const [top10SellingDaysByOrdersDate, setTop10SellingDaysByOrdersDate] =
    useState([]);
  const [top10SellingDaysByOrdersTime, setTop10SellingDaysByOrdersTime] =
    useState([]);
  const [top3SellingMonthByRevenue, setTop3SellingMonthByRevenue] = useState(
    []
  );
  const [top3SellingMonthByOrder, setTop3SellingMonthByOrder] = useState([]);
  const [top10CategoryByQuantity, setTop10CategoryByQuantity] = useState([]);
  const [top10BrandsByQuantity, setTop10BrandsByQuantity] = useState([]);
  const [top10ProductsByQuantity, setTop10ProductsByQuantity] = useState([]);

  const [store, setStore] = useState({
    label: "",
    value: "",
  });

  const getAllTimeRevenue = useCallback(() => {
    BusinessIntelligenceServices.getAllTimeRevenue(
      store?.value ? store?.value : 0
    ).then((res) => {
      const updatedTopAllTimeRevenueArray = res.data.data.map((revenue) => {
        revenue["name"] = revenue.label;
        revenue["value"] = Number(revenue.value);
        delete revenue["label"];
        return revenue;
      });
      setAllTimeRevenue(updatedTopAllTimeRevenueArray);
    });
  }, [store]);

  const getAllTimeNumberOfOrdersReport = useCallback(() => {
    BusinessIntelligenceServices.AllTimeNumberOfOrdersReport(
      store?.value ? store?.value : 0
    ).then((res) => {
      const updatedAllTimeNumberOfOrdersArray = res.data.data.map((orders) => {
        orders["name"] = orders.label;
        orders["value"] = Number(orders.value);
        delete orders["label"];
        return orders;
      });
      setAllTimeNumberOfOrders(updatedAllTimeNumberOfOrdersArray);
    });
  }, [store]);

  const getAllTimeCustomer = useCallback(() => {
    BusinessIntelligenceServices.AllTimeCustomer(
      store?.value ? store?.value : 0
    ).then((res) => {
      const updatedAllTimeCustomerArray = res.data.data.map((customer) => {
        customer["name"] = customer.label;
        customer["value"] = Number(customer.value);
        delete customer["label"];
        return customer;
      });
      setAllTimeCustomer(updatedAllTimeCustomerArray);
    });
  }, [store]);

  const getAllTimeAverageRevenue = useCallback(() => {
    BusinessIntelligenceServices.AllTimeAverageRevenue(
      store?.value ? store?.value : 0
    ).then((res) => {
      const updatedAllTimeAverageRevenueArray = res.data.data.map((revenue) => {
        revenue["name"] = revenue.label;
        revenue["value"] = Number(revenue.value).toFixed(2);
        delete revenue["label"];
        return revenue;
      });
      setAllTimeAverageRevenue(updatedAllTimeAverageRevenueArray);
    });
  }, [store]);

  const getAllTimeAverageOrders = useCallback(() => {
    BusinessIntelligenceServices.AllTimeAverageOrders(
      store?.value ? store?.value : 0
    ).then((res) => {
      const updatedAllTimeAverageOrdersArray = res.data.data.map((orders) => {
        orders["name"] = orders.label;
        orders["value"] = Number(orders.value).toFixed(2);
        delete orders["label"];
        return orders;
      });
      setAllTimeAverageOrders(updatedAllTimeAverageOrdersArray);
    });
  }, [store]);

  const getAllTimeAverageCustomers = useCallback(() => {
    BusinessIntelligenceServices.AllTimeAverageCustomers(
      store?.value ? store?.value : 0
    ).then((res) => {
      const updatedAllTimeAverageCustomersArray = res.data.data.map(
        (customer) => {
          customer["name"] = customer.label;
          customer["value"] = Number(customer.value).toFixed(2);
          delete customer["label"];
          return customer;
        }
      );
      setAllTimeAverageCustomers(updatedAllTimeAverageCustomersArray);
    });
  }, [store]);

  const getTop10SellingDaysByRevenueDate = useCallback(() => {
    BusinessIntelligenceServices.Top10SellingDaysByRevenueDate(
      store?.value ? store?.value : 0
    ).then((res) => {
      if (res.data.success) {
        const updatedTop10SellingDaysByRevenueDateArray = res.data.data.map(
          (revenue, index) => {
            revenue["color"] = RandomColors[index];
            revenue["name"] = revenue.label;
            revenue["value"] = Number(revenue.value);
            return revenue;
          }
        );
        setTop10SellingDaysByRevenueDate(
          updatedTop10SellingDaysByRevenueDateArray
        );
      }
    });
  }, [store]);

  const getTop10SellingDaysByRevenueTimePeriod = useCallback(() => {
    BusinessIntelligenceServices.Top10SellingDaysByRevenueTime(
      store?.value ? store?.value : 0
    ).then((res) => {
      if (res.data.success) {
        const updatedTop10SellingDaysByRevenueTimeArray = res.data.data.map(
          (revenue, index) => {
            revenue["color"] = RandomColors[index];
            revenue["name"] = revenue.label;
            revenue["value"] = Number(revenue.value);
            return revenue;
          }
        );
        setTop10SellingDaysByRevenueTime(
          updatedTop10SellingDaysByRevenueTimeArray
        );
      }
    });
  }, [store]);

  const getTop10SellingDaysByOrderDate = useCallback(() => {
    BusinessIntelligenceServices.Top10SellingDaysByOrderDate(
      store?.value ? store?.value : 0
    ).then((res) => {
      if (res.data.success) {
        const updatedTop10SellingDaysByOrderDate = res.data.data.map(
          (orders, index) => {
            orders["color"] = RandomColors[index];
            orders["name"] = orders.label;
            orders["value"] = Number(orders.value);
            return orders;
          }
        );
        setTop10SellingDaysByOrdersDate(updatedTop10SellingDaysByOrderDate);
      }
    });
  }, [store]);

  const getTop10SellingDaysByOrdersTimePeriod = useCallback(() => {
    BusinessIntelligenceServices.Top10SellingDaysByOrderTime(
      store?.value ? store?.value : 0
    ).then((res) => {
      if (res.data.success) {
        const updatedTop10SellingDaysByOrdersTimePeriod = res.data.data.map(
          (orders, index) => {
            orders["color"] = RandomColors[index];
            orders["name"] = orders.label;
            orders["value"] = Number(orders.value);
            return orders;
          }
        );
        setTop10SellingDaysByOrdersTime(
          updatedTop10SellingDaysByOrdersTimePeriod
        );
      }
    });
  }, [store]);

  const getTop3SellingMonthByRevenue = useCallback(() => {
    BusinessIntelligenceServices.Top3SellingMonthByRevenue(
      store?.value ? store?.value : 0
    ).then((res) => {
      if (res.data.success) {
        const updatedTop3SellingMonthByRevenue = res.data.data.map(
          (revenue, index) => {
            revenue["color"] = RandomColors[index];
            revenue["x"] = Number(revenue.x);
            revenue["y"] = Number(revenue.y);
            return revenue;
          }
        );
        setTop3SellingMonthByRevenue(updatedTop3SellingMonthByRevenue);
      }
    });
  }, [store]);

  const getTop3SellingMonthByOrder = useCallback(() => {
    BusinessIntelligenceServices.Top3SellingMonthByOrder(
      store?.value ? store?.value : 0
    ).then((res) => {
      if (res.data.success) {
        const updatedTop3SellingMonthByOrder = res.data.data.map(
          (revenue, index) => {
            revenue["color"] = RandomColors[index];
            revenue["x"] = Number(revenue.x);
            revenue["y"] = Number(revenue.y);
            return revenue;
          }
        );
        setTop3SellingMonthByOrder(updatedTop3SellingMonthByOrder);
      }
    });
  }, [store]);

  const getTop10CategoryByQuantity = useCallback(() => {
    BusinessIntelligenceServices.Top10CategoryByQuantity(
      store?.value ? store?.value : 0
    ).then((res) => {
      if (res.data.success) {
        const updatedTop10CategoryByQuantityArray = res.data.data.map(
          (category, index) => {
            category["color"] = RandomColors[index];
            category["name"] = category.label;
            category["value"] = Number(category.value);
            return category;
          }
        );
        setTop10CategoryByQuantity(updatedTop10CategoryByQuantityArray);
      }
    });
  }, [store]);
  const getTop10BrandsByQuantity = useCallback(() => {
    BusinessIntelligenceServices.Top10BrandsByQyantity(
      store?.value ? store?.value : 0
    ).then((res) => {
      if (res.data.success) {
        const updatedTop10BrandsByQuantityArray = res.data.data.map(
          (brands, index) => {
            brands["color"] = RandomColors[index];
            brands["name"] = brands.label;
            brands["value"] = Number(brands.value);
            return brands;
          }
        );
        setTop10BrandsByQuantity(updatedTop10BrandsByQuantityArray);
      }
    });
  }, [store]);

  const getTop10ProductsByQuantity = useCallback(() => {
    BusinessIntelligenceServices.Top10ProductsByQuantity(
      store?.value ? store?.value : 0
    ).then((res) => {
      if (res.data.success) {
        const updatedTop10BrandsByQuantityArray = res.data.data.map(
          (products, index) => {
            products["color"] = RandomColors[index];
            products["name"] = products.label;
            products["value"] = Number(products.value);
            return products;
          }
        );
        setTop10ProductsByQuantity(updatedTop10BrandsByQuantityArray);
      }
    });
  }, [store]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip min-w-[40px]">
          <p className="label bg-white rounded border border-y-stone-700">{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    getAllTimeRevenue();
    getAllTimeNumberOfOrdersReport();
    getAllTimeCustomer();
    getAllTimeAverageRevenue();
    getAllTimeAverageOrders();
    getAllTimeAverageCustomers();
    getTop10SellingDaysByRevenueDate();
    getTop10SellingDaysByRevenueTimePeriod();
    getTop10SellingDaysByOrdersTimePeriod();
    getTop3SellingMonthByRevenue();
    getTop3SellingMonthByOrder();
    getTop10BrandsByQuantity();
    getTop10ProductsByQuantity();
    getTop10CategoryByQuantity();
    getTop10SellingDaysByOrderDate();
  }, [
    getAllTimeRevenue,
    getAllTimeNumberOfOrdersReport,
    getAllTimeCustomer,
    getAllTimeAverageRevenue,
    getAllTimeAverageOrders,
    getAllTimeAverageCustomers,
    getTop10SellingDaysByRevenueDate,
    getTop10SellingDaysByRevenueTimePeriod,
    getTop10SellingDaysByOrdersTimePeriod,
    getTop3SellingMonthByRevenue,
    getTop3SellingMonthByOrder,
    getTop10BrandsByQuantity,
    getTop10ProductsByQuantity,
    getTop10CategoryByQuantity,
    getTop10SellingDaysByOrderDate,
    store?.value,
  ]);

  const Export = () => {
    dispatch(setAddLoading(true));
    BusinessIntelligenceServices.ExportBusinessIntelligence(
      store?.value ? store?.value : 0
    )
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

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues("store").then((res) => {
      if (res?.data?.success && res?.data?.data) {
        setStoreData(() => {
          return res.data.data;
          // return Object.keys(res.data.data).map((value, key) => {
          //   return { label: res.data.data[value], value: value }
          // })
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

  const Top3SellingMonthByRevenueCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white border rounded">
          <p className="label">{`${payload[0].payload.date} : Total Revenue: ${payload[0].value} / Total Order : ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <title>Business Intelligence</title>
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
              Business Intelligence
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="text-indigo-500" onClick={Export}>
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
        <div className="flex flex-wrap -mx-3 -mt-6">
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <BarCharts title={"All Time Revenue"} data={allTimeRevenue}>
              <Bar dataKey="value" fill="#86EFAC" barSize={40} />
              <YAxis
                label={{
                  value: "Order Revenue",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />
            </BarCharts>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <BarCharts
              title={"All Time Number of Orders"}
              data={allTimeNumberOfOrders}
            >
              <Bar dataKey="value" fill="#86EFAC" barSize={40} />
              <YAxis
                label={{
                  value: "Total Order",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />
            </BarCharts>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <BarCharts title={"All Time Customers"} data={allTimeCustomer}>
              <Bar dataKey="value" fill="#86EFAC" barSize={40} />
              <YAxis
                label={{
                  value: "Total Customer",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />
            </BarCharts>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <LineCharts
              title={"All Time Average Revenue"}
              data={allTimeAverageRevenue}
            >
              <YAxis
                label={{
                  value: "Total Customer",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Line
                connectNulls
                type="monotone"
                dataKey="value"
                stroke="#E5E5E5"
                fill="#86EFAC"
                activeDot={{ r: 8 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </LineCharts>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <LineCharts
              title={"All Time Average Orders"}
              data={allTimeAverageOrders}
            >
              <YAxis
                label={{
                  value: "Total Order",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Line
                connectNulls
                type="monotone"
                dataKey="value"
                stroke="#E5E5E5"
                fill="#86EFAC"
                activeDot={{ r: 8 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </LineCharts>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <LineCharts
              title={"All Time Average Customers"}
              data={allTimeAverageCustomers}
            >
              <YAxis
                label={{
                  value: "Total Order",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Line
                connectNulls
                type="monotone"
                dataKey="value"
                stroke="#E5E5E5"
                fill="#86EFAC"
                activeDot={{ r: 8 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </LineCharts>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <CircleChart
              title={"Top 10 Category by Quantity"}
              data={top10CategoryByQuantity}
            />
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <CircleChart
              title={"Top 10 Brands by Quantity"}
              data={top10BrandsByQuantity}
            />
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <CircleChart
              title={"Top 10 Products by Quantity"}
              data={top10ProductsByQuantity}
            />
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <ScatterCharts
              title={"Top 3 Selling Month by Revenue"}
              data={top3SellingMonthByRevenue}
            >
              <Tooltip content={<Top3SellingMonthByRevenueCustomTooltip />} />
              <XAxis
                type="number"
                dataKey="x"
                name="Total Revenue"
                label={{
                  value: "Total Revenue",
                  angle: 0,
                  position: "bottom",
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Total Order"
                label={{
                  value: "Total Order",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
            </ScatterCharts>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <CircleChart
              title={"Top 10 Selling Days by Revenue"}
              data={top10SellingDaysByRevenueDate}
            />
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <CircleChart
              title={"Top 10 Selling Days by Revenue"}
              data={top10SellingDaysByRevenueTime}
            />
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <ScatterCharts
              title={"Top 3 Selling Month by Order"}
              data={top3SellingMonthByOrder}
            >
              <Tooltip content={<Top3SellingMonthByRevenueCustomTooltip />} />
              <XAxis
                type="number"
                dataKey="x"
                name="Total Revenue"
                label={{
                  value: "Total Revenue",
                  angle: 0,
                  position: "bottom",
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Total Order"
                label={{
                  value: "Total Order",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
            </ScatterCharts>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <CircleChart
              title={"Top 10 Selling Days by Order"}
              data={top10SellingDaysByOrdersDate}
            />
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 px-3 pt-6 flex">
            <CircleChart
              title={"Top 10 Selling Days by Order"}
              data={top10SellingDaysByOrdersTime}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessIntelligence;

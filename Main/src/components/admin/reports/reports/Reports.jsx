import React, { useState, useEffect, useCallback } from "react";
import Select from "components/common/formComponent/Select";
import DropdownService from "services/common/dropdown/DropdownService";
import CircleChart from "./Chart/CircleChart";
import BarCharts from "./Chart/BarCharts";
import ReportTiles from "./ReportTiles";
import { Bar, Cell, Tooltip, YAxis } from "recharts";
import { RandomColors } from "global/Enum";
import Dashboard from "services/admin/reports/dashboard/dashboardService";

const Reports = () => {
  const [storeData, setStoreData] = useState([]);
  const [orderReport, setOrderReport] = useState([]);
  const [customerOrderReport, setCustomerOrderReport] = useState([]);
  const [productStatusReport, setProductStatusReport] = useState([]);
  const [productNavSyncStatusReport, setProductNavSyncStatusReport] = useState(
    []
  );
  const [topTenBrand, setTopTenBrand] = useState([]);
  const [productReadyScore, setProductReadyScore] = useState([]);
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());

  const [store, setStore] = useState({
    label: "",
    value: "",
  });
  const getOrderReport = useCallback(() => {
    Dashboard.getOrderReport(store?.value ? store?.value : 0).then((res) => {
      if (res.data.success) {
        const updatedOrderArray = res.data.data.map((order, index) => {
          order["color"] = RandomColors[index];
          order["name"] = order.label;
          order["value"] = Number(order.value);
          return order;
        });
        setOrderReport(updatedOrderArray);
      }
    });
  }, [store]);

  const getCustomerOrderReport = useCallback(() => {
    Dashboard.getCustomerOrderReport(store?.value ? store?.value : 0).then(
      (res) => {
        if (res.data.success) {
          const updatedCustomerOrderArray = res.data.data.map(
            (order, index) => {
              order["color"] = color[order.label];
              order["name"] = order.label;
              order["value"] = Number(order.value);
              return order;
            }
          );
          setCustomerOrderReport(updatedCustomerOrderArray);
        }
      }
    );
  }, [store]);

  const getProductStatusReport = useCallback(() => {
    Dashboard.getProductStatusReport(store?.value ? store?.value : 0).then(
      (res) => {
        if (res.data.success) {
          const updatedProductStatusArray = res.data.data.map(
            (order, index) => {
              order["color"] = RandomColors[index];
              order["name"] = order.label;
              order["value"] = Number(order.value);
              return order;
            }
          );
          setProductStatusReport(updatedProductStatusArray);
        }
      }
    );
  }, [store]);

  const getProductNavSyncStatusReport = useCallback(() => {
    Dashboard.getProductNavSyncStatusReport(store?.value ? store?.value : 0).then(
      (res) => {
        if (res.data.success) {
          const updatedProductStatusArray = res.data.data.map(
            (order, index) => {
              order["color"] = color[order.label];
              order["name"] = order.label;
              order["value"] = Number(order.value);
              return order;
            }
          );
          setProductNavSyncStatusReport(updatedProductStatusArray);
        }
      }
    );
  }, [store]);

  const getTopTenBrand = useCallback(() => {
    Dashboard.getTopTenBrand({
      storeId: store?.value ? store?.value : 0,
      startDate: startDate,
      endDate: endDate,
    }).then((res) => {
      const updatedTopTenBrandStatusArray = res.data.data.map((brand) => {
        brand["name"] = brand.label;
        brand["value"] = Number(brand.value);
        delete brand["label"];
        return brand;
      });
      setTopTenBrand(updatedTopTenBrandStatusArray);
    });
  }, [store, endDate, startDate]);

  const TopTenBrandTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip min-w-[40px]">
          <p className="label bg-white rounded border border-y-stone-700">{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const getProductReadyScore = useCallback(() => {
    Dashboard.getProductReadyScoreReport(store?.value ? store?.value : 0).then(
      (res) => {
        const updatedProductReadyScoreArray = res.data.data.map((score) => {
          score["name"] = score.label;
          score["value"] = Number(score.value);
          delete score["label"];
          return score;
        });
        setProductReadyScore(updatedProductReadyScoreArray);
      }
    );
  }, [store]);

  useEffect(() => {
    if (startDate && endDate) {
      getTopTenBrand();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    getOrderReport();
    getCustomerOrderReport();
    getProductStatusReport();
    getProductNavSyncStatusReport();
    getProductReadyScore();
  }, [
    getOrderReport,
    getCustomerOrderReport,
    getProductStatusReport,
    getProductNavSyncStatusReport,
    getProductReadyScore,
    store?.value,
  ]);

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

  const data = [
    {
      name: "Nike",
      score: 2400,
    },
    {
      name: "Adidas",
      score: 1398,
    },
    {
      name: "Puma",
      score: 6500,
    },
  ];

  const color = {
    Orders: "#86EFAC",
    Revenue: "#FFDB25",
    "Registered User Order": "#86EFAC",
    "Guest User Order": "#FFDB25",
    Active: "#86EFAC",
    Draft: "#B5BECC",
    Archived: "#93C5FD",
    Discontinue: "#FDA4AF",
    "Out of Stock": "#FDE047",
    "Back Order": "#7DD3FC",
    Async: "#86EFAC",
    Resync: "#FFDB25",
    Pending: "#FDA4AF",
  };

  return (
    <>
      <title>Product Report</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Page Title */}
          <div className="col-span-full w-full flex flex-wrap justify-between items-center">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Product Report
            </h1>
            <div className="flex flex-wrap space-x-2 items-center"></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
        {/* Circle Chart AND Bar Chart */}
        <div className="grid grid-cols-10 gap-6 mb-6">
          <div className="col-span-full lg:col-span-5 xl:col-span-3 flex">
            <CircleChart
              title={"Product Status Report"}
              data={productStatusReport}
            />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-3 flex">
            <CircleChart
              title={"Product NAV Sync Status Report"}
              data={productNavSyncStatusReport}
            />
          </div>
          <BarCharts title={"Product Ready Score"} data={productReadyScore}>
            <Bar dataKey="value" fill="#86EFAC" barSize={40} />
            <YAxis
              label={{
                value: "# of Products",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
          </BarCharts>
          <div className="col-span-full lg:col-span-5 xl:col-span-3 flex">
            <CircleChart title={"Order Report"} data={orderReport} />
          </div>
          <div className="col-span-full lg:col-span-5 xl:col-span-3 flex">
            <CircleChart
              title={"Customer Order Report"}
              data={customerOrderReport}
            />
          </div>
          <BarCharts
            title={"Top 10 Brands"}
            dateFilter={true}
            data={topTenBrand}
            width={700}
            height={300}
            startDate={startDate}
            setstartDate={setstartDate}
            endDate={endDate}
            setendDate={setendDate}
          >
            <Bar dataKey="value" fill="#86EFAC" barSize={40} />
            <YAxis
              label={{
                value: "# of Products",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={<TopTenBrandTooltip />}
            />
          </BarCharts>
        </div>

        {/* Tiles */}
        <div className="grid grid-cols-12 gap-6">
          <ReportTiles />
        </div>
      </div>
    </>
  );
};

export default Reports;

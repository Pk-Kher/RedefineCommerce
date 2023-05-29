import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import OrderService from "services/admin/order/OrderService";

const OrderByState = () => {
  const [StateData, setStateData] = useState([
    ["State", "", { role: "tooltip", type: "string", p: { html: true } }],
  ]);
  const getOrderByState = () => {
    OrderService.getOrderByStateList({}).then((res) => {
      if (res.data.success) {
        getStorename(res.data.data);
      }
    });
  };

  const getStorename = (data) => {
    if (data) {
      data.map((stateDataFromAPI) => {
        const stateNameFromApi = stateDataFromAPI.stateName || "";
        let orderTotalFromApi =
          stateDataFromAPI?.orderdetails[0]?.orderTotal || 0;
        let orderTotalForTooltip = ``;

        stateDataFromAPI?.orderdetails.map((storeOrder) => {
          orderTotalForTooltip = `${orderTotalForTooltip} ${storeOrder.storeName} : ${storeOrder.orderCount}  Orders / $${storeOrder.orderTotal} ;`;
        });

        return setStateData((prevState) => {
          return [
            ...prevState,
            [stateNameFromApi, orderTotalFromApi, orderTotalForTooltip],
          ];
        });
      });
    }
  };

  useEffect(() => {
    getOrderByState();
  }, []);

  const options = {
    width: "auto",
    region: "US",
    resolution: "provinces",
    colorAxis: { colors: ["#AFD3FF", "#9AC6FD"] },
  };

  return (
    <>
      <title>OrderByState</title>
      {/* <!-- Order By State --> */}
      <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-md">
        <header className="px-5 py-4 border-b-2 border-neutral-200">
          <h2 className="font-semibold text-base lg:text-xl text-gray-700">
            Order By State
          </h2>
        </header>
        <div className="p-3 w-full">
          <Chart
            chartType="GeoChart"
            width="100%"
            height="550px"
            data={StateData}
            options={options}
            loader={<div>Loading Chart</div>}
          />
        </div>
      </div>
    </>
  );
};
export default OrderByState;

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LineCharts = ({ title, data, ...rest }) => {
  return (
    <>
      <div className="col-span-full lg:col-span-full xl:col-span-4 w-full">
        <div className="w-full bg-white shadow-lg rounded-md">
          <div className="font-semibold text-base lg:text-xl text-gray-700 px-5 py-4 border-b-2 border-neutral-200">
            <div className="grow font-semibold text-base lg:text-xl text-gray-700">
              {title}
            </div>
          </div>
          <div className="text-center p-3">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                width={700}
                height={300}
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeLinecap="3 3" />
                <XAxis dataKey="name" />
                {/* <Tooltip /> */}
                {rest.children}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default LineCharts;

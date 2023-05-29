import React, { useState, useMemo, useEffect } from "react";
import { Fragment } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const CircleChart = ({ data, title }) => {
  const [circleData, setCircleData] = useState(data);

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

  return (
    <>
      <div className="w-full bg-white shadow-lg rounded-md">
        <div className="font-semibold text-base lg:text-xl text-gray-700 px-5 py-4 border-b-2 border-neutral-200">
          {title}
        </div>
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
        </div>
        <div className="px-3 pt-2 pb-3">
          <ul className="flex flex-wrap justify-center">
            {data?.map((button, index) => {
              return (
                <Fragment key={index}>
                  <li className="margin: 0.25rem">
                    <button
                      className={`btn-xs bg-white border-y-neutral-900 border-x-slate-900 shadow-neutral-900 mr-2 ${
                        tempCircleData.some(
                          (allButton) => allButton === button.name
                        ) && "opacity-20"
                      }`}
                      // key={index}
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

                      <span className={`flex items-center`}>{button.name}</span>
                    </button>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CircleChart;

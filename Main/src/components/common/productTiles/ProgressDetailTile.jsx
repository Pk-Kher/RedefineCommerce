/*Component Name: ProgressDetailTile
Component Functional Details: User can see Product Detail with a Progress bar Detail Tile from here.
Created By: chandan
Created Date: 13-07-2022
Modified By: chandan
Modified Date: 13-07-2022 */

import React, { useState, useEffect } from "react";
import DoughNutChart from "components/common/charts/DoughNutChart";

const ProgressDetailTile = ({ name, ProgressValue, dataFor }) => {
  const [ProgressBarValue, setProgressBarValue] = useState(0);

  useEffect(() => {
    if (ProgressValue !== undefined) {
      setProgressBarValue(Number(ProgressValue));
    }
  }, [ProgressValue]);

  const data = [
    { name: "pending", value: 100 - ProgressBarValue },
    { name: "remaining", value: 0 + ProgressBarValue },
  ];
  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <>
      {/* <div className="w-full relative bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-1"> */}
      <div className="relative w-full">
        <div className="flex flex-wrap items-center">
          <div className="flex flex-col justify-start">
            <div className="flex justify-start items-center">
              <div
                className="w-28 mr-4 box-border relative"
                style={{
                  width: "100px ",
                  height: "100px",
                  transform: "rotate(-90deg)",
                }}
              >
                <DoughNutChart value={ProgressBarValue} />
              </div>
            </div>
          </div>
          <div className="grow">
            <div className="text-2xl font-semibold mb-2">
              {ProgressBarValue}%
            </div>
            <div className="font-semibold">{name}</div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default ProgressDetailTile;

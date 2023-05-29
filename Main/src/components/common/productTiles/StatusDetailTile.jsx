/*Component Name: StatusDetailTile
Component Functional Details: User can see Product Status Detail using this Tile from here.
Created By: chandan
Created Date: 13-07-2022
Modified By: chandan
Modified Date: 13-07-2022 */

import React from "react";

const StatusDetailTile = ({ data }) => {
  return (
    <>
      <div className="p-6 border-b-2 border-neutral-200">
        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
          {data?.title}
        </div>
        <div className="text-gray-500">{data?.subTitle}</div>
        <div className="text-gray-500">{data?.subTitle2} </div>
        <div className="mt-2 text-right">
          {/* <button className="text-indigo-500">
            View Log
          </button> */}
        </div>
      </div>
    </>
  );
};

export default StatusDetailTile;

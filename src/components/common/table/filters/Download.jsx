/*Component Name: Download
Component Functional Details:  Download .
Created By: PK Kher
Created Date: 6-20-2022
Modified By: PK Kher
Modified Date: 6-20-2022 */

import React from "react";

const Download = ({onClick}) => {
  return (
    <>
      <div className="relative inline-flex">
        <button className="flex flex-wrap rounded-md items-center text-sm px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 text-gray-500 hover:text-gray-600" onClick={onClick}>
          <span className="material-icons-outlined">download</span>
          <span className="ml-1">Download</span>
        </button>
      </div>
    </>
  );
};

export default Download;

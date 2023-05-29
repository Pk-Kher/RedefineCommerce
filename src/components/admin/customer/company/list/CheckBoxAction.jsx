/*Component Name: Routes
Component Functional Details: User can create or update Routes Company details from here.
Created By: chandan
Created Date: 06/06/22
Modified By: chandan
Modified Date: 06/06/22 */

import React from "react";

function CheckBoxAction({ selectedFlatRows }) {
  return (
    <>
      <div className="flex">
        {/* <button className="text-xs btn-xs mx-1 bg-white border-indigo-300 hover:border-indigo-400 text-indigo-500 flex items-center">Active</button>
            <button className="text-xs btn-xs mx-1 bg-white border-indigo-300 hover:border-indigo-400 text-indigo-500 flex items-center">Inactive</button> */}
        <button className="text-xs btn-xs mx-1 bg-white border-rose-300 hover:border-rose-400 text-rose-500 flex items-center">
          Delete
        </button>
      </div>
    </>
  );
}

export default CheckBoxAction;

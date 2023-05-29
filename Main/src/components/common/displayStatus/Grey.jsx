import { RecStatusValueName } from "global/Enum";
import React from "react";

const Draft = ({ type, ...rest }) => {
  return (
    <>
      <div className="text-xs inline-block font-medium border border-slate-300 bg-slate-100 text-slate-600 rounded-md text-center px-2.5 py-1 w-28">
        {type === RecStatusValueName.Paid ? RecStatusValueName.Paid : RecStatusValueName.Draft}
      </div>
    </>
  );
};

export default Draft;

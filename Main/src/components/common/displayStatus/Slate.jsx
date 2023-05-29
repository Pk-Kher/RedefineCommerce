import { RecStatusValueName } from "global/Enum";
import React from "react";

const Archive = () => {
  return (
    <>
      <div className="text-xs inline-block font-medium border border-slate-300 bg-slate-700 text-gray-100 rounded-md text-center px-2.5 py-1 w-28">
        {RecStatusValueName.Archived}
      </div>
    </>
  );
};

export default Archive;

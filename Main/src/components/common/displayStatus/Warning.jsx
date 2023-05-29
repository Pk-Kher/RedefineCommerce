import { ProductStatusValuebyName, ProductStatusValueName, RecStatusValuebyName, RecStatusValueName } from "global/Enum";
import React from "react";

const Warning = ({ type, ...rest }) => {
  return (
    <>
      <div className="text-xs inline-block font-medium border border-yellow-300 bg-yellow-100 text-yellow-600 rounded-md text-center px-2.5 py-1 w-28">
        {(() => {
          if (type === RecStatusValuebyName.Pending) {
            return RecStatusValueName.Pending
          } else if (type === RecStatusValuebyName.Scheduled) {
            return RecStatusValueName.Scheduled;
          } else if (type === RecStatusValuebyName.Unfulfilled) {
            return RecStatusValueName.Unfulfilled
          } else if (type === ProductStatusValuebyName.Pending) {
            return ProductStatusValueName.Pending
          } else if (type === RecStatusValueName.Pending) {
            return RecStatusValueName.Pending
          } else {
            return type;
          }
        })()}
      </div>
    </>
  );
};

export default Warning;

import { ProductNavStatusValuebyName, ProductNavStatusValueName, RecStatusValuebyName, RecStatusValueName } from "global/Enum";
import React from "react";

const Success = ({ type, navSync, ...rest }) => {
  return (
    <>
      <div className="text-xs inline-block font-medium border border-green-300 bg-green-100 text-green-600 rounded-md text-center px-2.5 py-1 w-28">
        {(() => {
          if (type === RecStatusValuebyName.FulFilled) {
            return RecStatusValueName.FulFilled
          } else if (type === RecStatusValuebyName.Active) {
            return RecStatusValueName.Active
          } else if (type === ProductNavStatusValuebyName.Sync && navSync === true) {
            return ProductNavStatusValueName.Sync
          } else if (type === RecStatusValueName.Approved) {
            return RecStatusValueName.Approved
          } else {
            return type;
          }

        })()}

      </div>
    </>
  );
};

export default Success;

import { ProductNavStatusValuebyName, ProductNavStatusValueName, RecStatusValuebyName, RecStatusValueName } from "global/Enum";
import React, { useEffect } from "react";

const Danger = ({ type, navSync, ...rest }) => {

  return (
    <>
      <div className="text-xs inline-block font-medium border border-red-300 bg-red-100 text-red-600 rounded-md text-center px-2.5 py-1 w-28">
        {(() => {
          if (type === RecStatusValuebyName.Inactive) {
            return RecStatusValueName.Inactive
          } else if (type === ProductNavStatusValuebyName.Resync && navSync === true) {
            return ProductNavStatusValueName.Resync
          } else if (type === RecStatusValueName.Disapproved) {
            return RecStatusValueName.Disapproved
          } else {
            return type;
          }

        })()}
      </div>
    </>
  );
};

export default Danger;

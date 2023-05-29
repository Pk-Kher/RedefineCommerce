import { ProductStatusValuebyName, RecStatusValuebyName, RecStatusValueName } from "global/Enum";
import React from "react";

const Expired = ({ type, navSync, ...rest }) => {
    return (
        <>
            <div className="text-xs inline-block font-medium border border-sky-300 bg-sky-100 text-sky-600 rounded-md text-center px-2.5 py-1 w-28">
                {(() => {
                    if (type === RecStatusValuebyName.Expired) {
                        return RecStatusValueName.Expired
                    } else if (type === ProductStatusValuebyName.Discontinued) {
                        return RecStatusValueName.Archived
                    } else {
                        return type;
                    }

                })()}
            </div>
        </>
    );
};

export default Expired;

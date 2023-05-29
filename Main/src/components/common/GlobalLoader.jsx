import React, { Fragment } from "react";

export default function TableLoading({ className, ...rest }) {
  return (
    <Fragment>
      <div className="absolute w-full h-full bg-[#f1f5f9] opacity-75 z-50 overflow-hidden flex justify-center align-middle">
        <div className={`text-center z-60 w-full items-center flex justify-center align-middle ${className}`}>
          {/* <img
            className="text-white font-bold italic text-4xl"
            src={loadingImg}
            alt="img"
          /> */}
          <div className="loadingio-spinner-spinner-xe2hhkdtzbj">
            <div className="ldio-yoj2w479tp">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </Fragment >
  );
}

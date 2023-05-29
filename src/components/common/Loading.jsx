import React, { Fragment } from "react";
import loadingImg from "../../assets/images/svgImages/loading.svg";

export default function Loading(props) {

  return (
    <Fragment>
      <div
        className="text-center fixed z-60 h-full w-full items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.84)" }}
      >
        <span
          className="text-white font-bold italic text-4xl absolute -translate-x-2/4 -translate-y-2/4 top-2/4 left-2/4"
          src={loadingImg}
        >
          Loading...
        </span>
      </div>
    </Fragment>
  );
}

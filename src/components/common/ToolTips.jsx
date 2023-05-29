import React from "react";
import ReactTooltip from "react-tooltip";

const ToolTips = ({ message, id, className }) => {
  return (
    <div className={`relative ml-2 ${className}`}>
      <button
        className={`block`}
        aria-haspopup="true"
        data-tip=""
        data-for={id}
        type="button"
      >
        <svg
          className={`w-4 h-4 fill-current text-slate-400 `}
          viewBox="0 0 16 16"
        >
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
        </svg>
      </button>

      <ReactTooltip
        id={id}
        backgroundColor="bg-slate-800"
        className={`custom-color-no-arrow flex flex-wrap uppercase tracking-wide text-gray-500 text-xs font-bold mb-2`}
      >
        <div className="min-w-56 w-52 bg-slate-800 p-2 rounded overflow-hidden mb-2">
          <div className="text-xs text-slate-200">{message}</div>
        </div>
      </ReactTooltip>
    </div>
  );
};

export default ToolTips;

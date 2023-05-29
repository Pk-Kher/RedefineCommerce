import React, { useState, useCallback, useEffect, useMemo } from "react";
import SystemLogTable from "../systemLog/list/Table";

const Activity = ({ setFormSubmit }) => {
  useEffect(() => {
    setFormSubmit(null);
  }, [setFormSubmit]);

  return (
    <>
      <div className="p-6 space-y-6 w-full">
        <h2 className="text-2xl text-gray-800 font-bold mb-3">System Log</h2>
      </div>
      <SystemLogTable />
    </>
  );
};

export default Activity;

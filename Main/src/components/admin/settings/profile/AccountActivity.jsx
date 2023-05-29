import React, { /* useState, useCallback, */ useEffect } from "react";
// import axios from "axios";
// import { format } from "date-fns";
// import ReactTable from "../../../common/table/ReactTableServerSide";
// import { NavLink } from "react-router-dom";
// import CheckBoxAction from "../user/list/CheckBoxAction";
import AccountActivityTable from "../accountActivity/list/Table";

const Activity = ({ setFormSubmit }) => {
    useEffect(() => {
        setFormSubmit(null);
    }, [setFormSubmit]);

    return (
        <>
            <div className="p-6 space-y-6 w-full">
                <h2 className="text-2xl text-gray-800 font-bold mb-3">Account Activity</h2>
            </div>
            <AccountActivityTable />
        </>
    );
};

export default Activity;

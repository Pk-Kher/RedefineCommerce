/*Component Name: Routes
Component Functional Details:  Routes .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */
import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import StatusService from "services/admin/status/StatusService";
import Edit from "./edit/Edit";
import InvoicePrintTemplate from "./edit/invoice/InvoicePrintTemplate";
import List from "./list/List";
import PhoneOrderList from "./phoneOrder/list"
const InternalRouting = () => {
  const [statusList, setStatusList] = useState({});
  useEffect(() => {
    StatusService.getAllStatus({
      pageIndex: 0,
      pageSize: 999999999,
      pagingStrategy: 0,
      sortingOptions: [],
      filteringOptions: []
    }).then((response) => {
      if (response?.data?.success && response.data?.data?.items) {
        setStatusList(() => {
          let status = {};
          response.data?.data?.items.map(value => {
            status = {
              ...status, [value?.type?.toLowerCase()]: {
                ...status[value?.type?.toLowerCase()], [value?.name?.toLowerCase()]: value
              }
            }
          });
          return status;
        });
      }
    }).catch(() => {

    });
  }, []);
  return (
    <>
      <Routes>
        <Route path="/orders" element={<List statusList={statusList} />} />
        <Route exact path="/phone" element={<PhoneOrderList />} />
        <Route exact path="/orders/edit/:id" element={<Edit statusList={statusList} />} />
        <Route path="/orders/receipt/:id" element={<InvoicePrintTemplate />} />
      </Routes>
    </>
  );
};

export default InternalRouting;
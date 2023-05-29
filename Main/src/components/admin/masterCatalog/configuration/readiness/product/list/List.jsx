/*Component Name: List
Component Functional Details: User can show List of Product Readiness and he/she can edit, delete and update status of list from here.
Created By: Happy
Created Date: 31/5/22
Modified By: Happy
Modified Date: 06/20/2022 */

import React from "react";
import ProductReadinessService from "services/admin/readiness/ProductReadinessService";
import CommonList from "../../common/list/CommonList";


const List = () => {
  return (
    <>
      <CommonList
        title={"Product"} editURL="/admin/MasterCatalog/Configuration/productReady/edit" getReadinessAPI={ProductReadinessService.getProductReadiness} statusChangeAPI={ProductReadinessService.updateStatus} multiplestatusChangeAPI={ProductReadinessService.updateMultipleStatus} />
    </>
  );
};

export default List;

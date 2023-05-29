/*Component Name: List
Component Functional Details: User can show List of SEO Readiness and he/she can edit, delete and update status of list from here.
Created By: Happy
Created Date: 31/5/22
Modified By: Happy
Modified Date: 06/20/2022 */

import React from "react";
import SEOReadinessService from "services/admin/readiness/SEOReadinessService";
import CommonList from "../../common/list/CommonList";

const List = () => {
  return (
    <>

      <CommonList
        title={"SEO"} editURL="/admin/MasterCatalog/Configuration/SEOReady/edit" getReadinessAPI={SEOReadinessService.getSEOReadiness} statusChangeAPI={SEOReadinessService.updateStatus} multiplestatusChangeAPI={SEOReadinessService.updateMultipleStatus} />
    </>
  );
};

export default List;

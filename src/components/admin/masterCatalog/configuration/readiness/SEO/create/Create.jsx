/*Component Name: Create
Component Functional Details: User can create or update Create master details from here.
Created By: Happy
Created Date: 06/20/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from "react";
import CommonCreate from "../../common/create/CommonCreate";
import SEOReadinessService from "services/admin/readiness/SEOReadinessService";
import SEOFieldService from "services/admin/seoField/SEOFieldService";

const Create = () => {

  return (
    <>
      <CommonCreate title={"SEO"} listUrl="/admin/MasterCatalog/Configuration/SEOReady" editURL="/admin/MasterCatalog/Configuration/SEOReady/edit" CreateReadinessAPI={SEOReadinessService.createSEOReady} UpdateReadinessAPI={SEOReadinessService.updateSEOReady} GetReadinessAPI={SEOReadinessService.getSEOReadyById} CreateOrUpdateRedinessDetailsAPI={SEOReadinessService.createOrUpdateSEOReadyDetails} getProductFieldsByStoreId={SEOFieldService.getProductFieldsByStoreId} />
    </>
  );
};

export default Create;

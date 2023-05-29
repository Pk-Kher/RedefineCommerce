/*Component Name: Create
Component Functional Details: User can create or update Create master details from here.
Created By: Happy
Created Date: 06/20/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */


import React from "react";
import CommonCreate from "../../common/create/CommonCreate";
import ProductReadinessService from "services/admin/readiness/ProductReadinessService";
import ProductFieldService from "services/admin/productField/ProductFieldService";

const Create = () => {

  return (
    <>
      <CommonCreate title={"Product"} listUrl="/admin/MasterCatalog/Configuration/productReady" editURL="/admin/MasterCatalog/Configuration/productReady/edit" CreateReadinessAPI={ProductReadinessService.createProductReady} UpdateReadinessAPI={ProductReadinessService.updateProductReady} GetReadinessAPI={ProductReadinessService.getProductReadyById} CreateOrUpdateRedinessDetailsAPI={ProductReadinessService.createOrUpdateProductReadyDetails} getProductFieldsByStoreId={ProductFieldService.getProductFieldsByStoreId} />
    </>
  );
};

export default Create;

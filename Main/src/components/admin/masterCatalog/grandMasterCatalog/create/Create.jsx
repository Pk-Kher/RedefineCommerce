/*Component Name: Create
Component Functional Details:  Create .
Created By: Chandan
Created Date: 29-08-2022
Modified By: Chandan
Modified Date: 29-08-2022 */

import React from 'react';
import ProductCreate from "../../common/product/create/Create";
import { EditGrandMasterTabs } from "global/Enum";
import { GrandMasterCatalogData, productType } from "dummy/Dummy";
import ProductService from 'services/admin/masterCatalog/grandMaster/products/ProductService';
import { useParams } from 'react-router-dom';
import ValidateService from "services/admin/validate/ValidateServices";

const Create = () => {
  const { id } = useParams();
  return (
    <>
      <title>{!id ? "Create" : "Edit"} Product</title>
      <ProductCreate
        masterTabs={EditGrandMasterTabs}
        masterCatalogFields={GrandMasterCatalogData?.fields}
        listUrl={'/admin/MasterCatalog/GrandMasterCatalog'}
        title={'Grand Master Catalog Product Template'}
        getProductById={ProductService.getGrandMasterProductById}
        getValidationForAllFilledFields={ValidateService.getGMasterCatalogValidateProductStatus}
        type={productType.GMC}
        moduleName={`grandMaster`}
      />
    </>
  );
};

export default Create;

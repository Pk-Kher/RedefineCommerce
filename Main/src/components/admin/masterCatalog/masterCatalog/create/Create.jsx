/*Component Name: Create
Component Functional Details:  Create .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import ProductCreate from "../../common/product/create/Create";
import { EditMasterTabs } from "global/Enum";
import { masterCatalogData, productType } from "dummy/Dummy";
import ProductService from 'services/admin/masterCatalog/masterCatalog/products/ProductService';
import SingleFieldUpdateService from 'services/admin/masterCatalog/masterCatalog/products/SingleFieldUpdateService';
import { useParams } from 'react-router-dom';
import ValidateService from "services/admin/validate/ValidateServices";

const Create = () => {
  const { id } = useParams();
  return (
    <>
      <title>{!id ? "Create" : "Edit"} Product</title>
      <ProductCreate
        masterTabs={EditMasterTabs}
        masterCatalogFields={masterCatalogData?.fields}
        listUrl={'/admin/MasterCatalog/MasterCatalog/'}
        title={'Master Catalog Product Template'}
        type={productType.MC}
        getProductById={ProductService.getMasterProductById}
        getValidationForAllFilledFields={ValidateService.getMasterCatalogValidateProductStatus}
        updateProductStatus={SingleFieldUpdateService.updateSingleField}
        moduleName={`product`}
      />
    </>
  );
};

export default Create;

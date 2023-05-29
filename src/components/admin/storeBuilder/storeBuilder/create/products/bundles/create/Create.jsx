/*Component Name: Store Builder Products Bundle
Component Functional Details: User can create Store Builder Products Bundle.
Created By: Ankit Sharma
Created Date: 11-15-2022
Modified By: Ankit Sharma
Modified Date: 11-15-2022 */

import React from 'react';
import ProductCreate from "../../common/product/create/Create";
import { EditStoreBuilderBundleTabs } from "global/Enum";
import BundleProductService from "services/admin/masterCatalog/store/bundle/ProductService";
import { bundleFields, productType } from "dummy/Dummy";
import SingleFieldUpdateService from 'services/admin/masterCatalog/store/product/SingleFieldUpdateService';
import { useParams } from 'react-router-dom';

const Create = () => {
  const { storeId } = useParams();
  return (
    <>
      <ProductCreate
        masterTabs={EditStoreBuilderBundleTabs}
        masterCatalogFields={bundleFields?.fields}
        listUrl={`/admin/StoreBuilder/store/edit/${storeId}`}
        title={'Bundle'}
        getProductById={BundleProductService.getBundleProductById}
        type={productType.Bundle}
        updateProductStatus={SingleFieldUpdateService.updateSingleField}
        moduleName={`bundle`}
      />
    </>
  );
};

export default Create;
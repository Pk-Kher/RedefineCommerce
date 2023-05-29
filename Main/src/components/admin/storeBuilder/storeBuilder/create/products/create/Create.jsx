/*Component Name: Store Builder Products Bundle
Component Functional Details: User can create Store Builder Products Bundle.
Created By: Ankit Sharma
Created Date: 11-15-2022
Modified By: Ankit Sharma
Modified Date: 11-15-2022 */

import React from 'react';
import ProductCreate from "../common/product/create/Create";
import { EditStoreBuilderProductTabs } from "global/Enum";
import { ProductCatalogData, productType } from "dummy/Dummy";
import ProductService from 'services/admin/masterCatalog/store/product/ProductService';
import SingleFieldUpdateService from 'services/admin/masterCatalog/store/product/SingleFieldUpdateService';
import { useParams } from 'react-router-dom';

const Create = (props) => {
  console.log(props);
  const { storeId } = useParams();
  return (
    <>
      <ProductCreate
        masterTabs={EditStoreBuilderProductTabs}
        masterCatalogFields={ProductCatalogData?.fields}
        listUrl={`/admin/StoreBuilder/edit/${storeId}`}
        title={'Product'}
        getProductById={ProductService.getStoreProductById}
        type={productType.StoreBuilder}
        updateProductStatus={SingleFieldUpdateService.updateSingleField}
        moduleName={`product`}
      />
    </>
  );
};

export default Create;
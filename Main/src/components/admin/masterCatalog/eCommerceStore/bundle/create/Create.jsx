/*Component Name: Bundle Master
Component Functional Details: User can create Bundle Master.
Created By: 
Created Date: 
Modified By: Shrey Patel
Modified Date: 04-07-2022 */

import React from 'react';
import ProductCreate from "../../../common/product/create/Create";
import { EditBundleTabs } from "global/Enum";
import BundleProductService from "services/admin/masterCatalog/store/bundle/ProductService";
import { bundleFields, productType } from "dummy/Dummy";
import SingleFieldUpdateService from 'services/admin/masterCatalog/store/product/SingleFieldUpdateService';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import StoreService from 'services/admin/store/StoreService';
import { useEffect } from 'react';
import { useState } from 'react';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';

const Create = () => {
  const { storeName, storeType, storeId, id } = useParams();
  const [store, setStore] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAddLoading(true));
    StoreService.getStoreById(storeId).then((response) => {
      dispatch(setAddLoading(false));
      if (response.data.data) {
        let storeData = response.data.data;
        if (storeData.name.replace(' ', '').toLowerCase() === storeName.toLowerCase() && storeType.toLowerCase() === storeData.storeType.name.replace(' ', '').toLowerCase()) {
          setStore(storeData);
        } else {
          navigate('404');
        }
      }
    }).catch((error) => {
      dispatch(setAddLoading(false));
      navigate('404');
    });
  }, [storeId]);
  return (
    <>
      <title>{!id ? "Create" : "Edit"} Bundle</title>
      <ProductCreate
        masterTabs={EditBundleTabs}
        masterCatalogFields={bundleFields?.fields}
        listUrl={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products`}
        title={'Bundle'}
        getProductById={BundleProductService.getBundleProductById}
        type={productType.Bundle}
        updateProductStatus={SingleFieldUpdateService.updateSingleField}
        moduleName={`bundle`}
        store={store}
      />
    </>
  );
};

export default Create;
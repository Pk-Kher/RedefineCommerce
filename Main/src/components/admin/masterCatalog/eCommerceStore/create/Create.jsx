/*Component Name: Create
Component Functional Details:  Create .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useEffect } from 'react';
import ProductCreate from "../../common/product/create/Create";
import { EditStoreProductTabs } from "global/Enum";
import { ProductCatalogData } from "dummy/Dummy";
import ProductService from 'services/admin/masterCatalog/store/product/ProductService';
import SingleFieldUpdateService from 'services/admin/masterCatalog/store/product/SingleFieldUpdateService';
import { useNavigate, useParams } from 'react-router-dom';
import StoreService from 'services/admin/store/StoreService';
import { useDispatch } from 'react-redux';
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
      <title>{store?.name ? store?.name + '|' : ''}  {!id ? "Create" : "Edit"} Product</title>
      <ProductCreate masterTabs={EditStoreProductTabs}
        masterCatalogFields={ProductCatalogData?.fields}
        listUrl={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/products`}
        title={`${store.name ? store.name : ''} Product`}
        type={store?.storeTypeId}
        getProductById={ProductService.getStoreProductById}
        updateProductStatus={SingleFieldUpdateService.updateSingleField}
        moduleName={`store`}
        store={store}
      />
    </>
  );
};

export default Create;

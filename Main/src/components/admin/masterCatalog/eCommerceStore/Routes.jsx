import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import ProductCreate from "./create/Create";
import CategoryCreate from "./categoryMaster/create/Create";
import Bundle from "./bundle/create/Create";
import Export from "./export/Export";
import Import from "./import/Import";
import VendorSKUExport from "../common/product/create/forms/vendorSKU/export/Export"
import VendorSKUImport from "../common/product/create/forms/vendorSKU/import/Import";
import ProductList from "./product/list/List"
import BrandList from "./brandMaster/list/List";
import BrandCreate from "./brandMaster/create/Create";
import CategoryList from "./categoryMaster/list/List"
import GiftCardLift from "./giftCard/list/List"
import ProductOrder from "./productOrder/ProductOrder";
const InternalRouting = () => {
  return (
    <>
      {/* <Routes>

        <Route path="corporateGear/*" element={<CorporateGear />} />
      </Routes> */}
      <Routes>

        {/* <Route path="corporateGear/products" element={<ProductList />} /> */}
        <Route path=":storeName/:storeId/products" element={<ProductList />} />
        <Route path=":storeName/:storeId/brands" element={<BrandList />} />
        <Route path=":storeName/:storeID/giftcard" element={<GiftCardLift/>}/>
        {/* <Route path=":storeName/products" element={<ProductList />} /> */}
        <Route path=":storeName/:storeId/products/create" element={<ProductCreate />} />
        <Route path=":storeName/:storeId/products/edit/:id" element={<ProductCreate />} />
        <Route path=":storeName/:storeId/brands/edit/:id" element={<BrandCreate />} />
        <Route path=":storeName/:storeId/category" element={<CategoryList />} />
        {/* <Route path=":storeName/products" element={<ProductList />} /> */}
        <Route path=":storeName/:storeId/products/create" element={<ProductCreate />} />
        <Route path=":storeName/:storeId/products/edit/:id" element={<ProductCreate />} />
        <Route path=":storeName/:storeId/category/edit/:id" element={<CategoryCreate />} />
        <Route path=":storeName/:storeId/products/bundle/create" element={<Bundle />} />
        <Route path=":storeName/:storeId/products/bundle/edit/:id" element={<Bundle />} />
        < Route path=":storeName/:storeId/products/export" element={<Export />} />
        <Route path=":storeName/:storeId/products/import" element={<Import />} />
        <Route path=":storeName/:storeId/productOrder" element={<ProductOrder />} />

        <Route path=":storeName/:storeId/vendorSKU/export/:id" element={<VendorSKUExport />} />
        <Route path=":storeName/:storeId/vendorSKU/import/:id" element={<VendorSKUImport />} />

      </Routes>
    </>
  );
};

export default InternalRouting;

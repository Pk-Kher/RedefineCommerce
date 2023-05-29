/*Component Name: AllInfo
Component Functional Details: User can create or update AllInfo master details from here.
Created By: Vikas Patel
Created Date: 27th May 2022
Modified By: Shrey Patel
Modified Date: June/27/2022 */
import React, { useMemo } from "react";
import BasicInformationView from "./BasicInformationView";
import PricingView from "./PricingView";
import MediaView from "./MediaView";
import AttributesView from "./AttributesView";
import InventoryView from "./InventoryView";
import SizeChartView from "./SizeChartView";
import PersonalizationView from "./PersonalizationView";
import FacetView from "./FacetView";
import VendorSKUMappingView from "./VendorSKUMappingView";
import SKUSwapView from "./SKUSwapView";
import BundleView from "./BundleView";
import SEOView from "./SEOView";
import OrderHistoryView from "./OrderHistoryView";
import CustomerReviewsView from "./CustomerReviewsView";
import CustomerFAQView from "./CustomerFAQView";
import LifeCycleView from "./LifeCycleView";
import ProductView from "./ProductView";
import ProductAndStoreMappingView from "./ProductAndStoreMappingView";

const AllInfo = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  productId,
  type,
  requiredFields,
  setActiveTab,
  masterTabs,
  moduleName,
  setAttributeCombinations,
  index,
  isAddMode,
  ...prop
}) => {

  const componentsView = {
    basic: BasicInformationView,
    pricing: PricingView,
    media: MediaView,
    product: ProductView,
    attributes: AttributesView,
    inventory: InventoryView,
    sizechart: SizeChartView,
    personalization: PersonalizationView,
    facet: FacetView,
    vendorskumapping: VendorSKUMappingView,
    skuswap: SKUSwapView,
    bundle: BundleView,
    seo: SEOView,
    orderhistory: OrderHistoryView,
    customerreviews: CustomerReviewsView,
    customerfaq: CustomerFAQView,
    lifecycle: LifeCycleView,
    productAndStoreMapping: ProductAndStoreMappingView,
  };

  const displayTabs = useMemo(() => {
    return (!isAddMode
      ? masterTabs.filter((element) => element.componentname != "all")
      : masterTabs).filter((element) => ((element.componentname === 'seo' && prop?.store?.isSeoReadinessAllow) || element.componentname !== 'seo'))
  }, [masterTabs, isAddMode, prop?.store]);

  return (
    <>
      {displayTabs.map((tab, key) => {
        const Component = componentsView[tab.componentname];
        return (
          <Component
            displayFieldElement={displayFieldElement}
            fetchFieldProperty={fetchFieldProperty}
            fields={fields}
            values={values}
            productId={productId}
            tab={tab}
            readOnly={true}
            type={type}
            requiredFields={requiredFields}
            setActiveTab={setActiveTab}
            key={key}
            index={key + 1}
            moduleName={moduleName}
            setAttributeCombinations={setAttributeCombinations}
            {...prop}

          />
        );
      })}
    </>
  );
};

export default AllInfo;

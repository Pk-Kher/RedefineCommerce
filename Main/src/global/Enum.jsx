export const defaultImage = (process.env.REACT_APP_API_BLOB ?? "https://redefinecommerce.blob.core.windows.net/") + "/images/common/default.png";
// "https://redefinecommerce.blob.core.windows.net/images/common/default.png";

export const fontSizeClassOption = [
  { class: "text-xs", value: "Extral Small" },
  { class: "text-sm", value: "Small" },
  { class: "text-base", value: "Normal" },
  { class: "text-lg", value: "Large" },
  { class: "text-xl", value: "Extra Large" },
  { class: "text-2xl", value: "2 XL" },
  { class: "text-3xl", value: "3 XL" },
];

export const FilteringOperator = {
  Empty: 0,
  Contains: 1,
  Not_Contains: 2,
  LT: 3,
  LE: 4,
  GT: 5,
  GE: 6,
  NE: 7,
  EQ: 8,
  StartsWith: 9,
  EndsWith: 10,
  RangeInclusive: 11,
  RangeExclusive: 12,
  IN: 13,
  NOT_IN: 14,
  IN_CONTAINS: 15,
  NOT_IN_CONTAINS: 16,
};

export const FilteringOptions = [
  { value: 0, label: "Equal" },
  { value: 1, label: "Not Equal" },
  { value: 2, label: "Less Than" },
  { value: 3, label: "Less Than Or Equal" },
  { value: 4, label: "Greater Than" },
  { value: 5, label: "Greater Than Or Equal" },
  { value: 6, label: "Contains" },
  { value: 7, label: "Not Contains" },
  { value: 8, label: "Starts With" },
  { value: 9, label: "Not Starts With" },
  { value: 10, label: "Ends With" },
  { value: 11, label: "Not Ends With" },
  { value: 12, label: "NUll" },
  { value: 13, label: "Not NUll" },
  { value: 14, label: "Empty" },
  { value: 15, label: "Not Empty" },
  { value: 16, label: "Between" },
  { value: 17, label: "Not Between" },
  { value: 18, label: "In List" },
  { value: 19, label: "Not In List" },
];

export const RecStatusValue = [
  {
    label: "Active",
    value: "A",
  },
  {
    label: "Inactive",
    value: "I",
  },
];
export const AssetLibraryStatusValue = [
  { value: "A", label: "Active files" },
  { value: "R", label: "Archived files" },
];
export const AssetLibraryTypesValue = [
  { value: "all", label: "All Type" },
  { value: "doc", label: "Documents" },
  { value: "img", label: "Images" },
  { value: "vid", label: "Video" },
];

export const RecStatusValueForUserList = {
  A: "Active",
  I: "Inactive",
  D: "Draft",
  P: "Pending",
};

export const RecStatusValueForForm = [
  {
    label: "Active",
    value: "A",
  },
  {
    label: "Inactive",
    value: "I",
  },
  // {
  //   label: 'Delete',
  //   value: 'R',
  // }
];

export const RecStatusValueForMorFilter = [
  {
    label: "Active",
    value: "A",
  },
  {
    label: "Inactive",
    value: "I",
  },
  {
    label: 'Pending',
    value: 'P',
  }
];

export const RecStatusValueForPromotionFilter = [
  {
    label: "Active",
    value: "A",
  },
  {
    label: "Inactive",
    value: "I",
  },
  {
    label: 'Scheduled',
    value: 'S',
  },
  {
    label: 'Expired',
    value: 'E',
  }
];


export const RecStatusValueName = {
  Active: "Active",
  Inactive: "Inactive",
  Draft: "Draft",
  Pending: "Pending",
  Archived: "Archived",
  Scheduled: "Scheduled",
  Expired: "Expired",
  Paid: "Paid",
  Unfulfilled: "Unfulfilled",
  FulFilled: "FulFilled",
  Approved: "Approved",
  Disapproved: "Disapproved",
};

export const RecStatusValuebyName = {
  Active: "A",
  Inactive: "I",
  Draft: "D",
  Pending: "P",
  Archived: "R",
  Scheduled: "S",
  Expired: "E",
  NavSync: "S",
  Disapproved: "X",
  Cancelled: 'Cancelled',
  Fraud: 'Fraud'
};

export const ProductStatusValueName = {
  Active: "Active",
  Discontinued: "Archived",
  Draft: "Draft",
  Pending: "Pending",
  Archived: "Archived",
  Scheduled: "Scheduled",
  OutofStock: "Out of Stock",
  Paid: "Paid",
  Unfulfilled: "Unfulfilled",
  FulFilled: "FulFilled",
};

export const ProductStatusValuebyName = {
  Active: "A",
  Inactive: "I",
  Discontinued: "X",
  Draft: "D",
  Pending: "P",
  // Archived: "R",
  Scheduled: "S",
  OutofStock: "O",
};

export const ViewHistoryStatus = {
  Active: "A",
  Inactive: "I",
  Draft: "D",
  Pending: "P",
  Archived: "R",
  Scheduled: "S",
  Expired: "E",
  NavSync: "S",
  Cancelled: 'Cancelled',
  Fraud: 'Fraud',
  OutofStock: "O",
};

export const ProductNavStatusValueName = {
  Pending: "Pending",
  Resync: "Resync",
  Sync: "Sync",
};

export const ProductNavStatusValuebyName = {
  Resync: "R",
  Pending: "P",
  Sync: "S",
};

export const ProductNavStatusValueNameForMoreFilter = [
  { value: "P", label: "Pending" },
  { value: "R", label: "Resync" },
  { value: "S", label: "Sync" },
];

export const menuConfigCategoryType = [
  { value: "topic", label: "Topic" },
  { value: "category", label: "Category" },
];

export const BundleProductStatusFormOption = [
  { value: "A", label: "Active" },
  { value: "I", label: "Inactive" },
  { value: "X", label: "Discontinued" },
  { value: "D", label: "Draft" },
  { value: "O", label: "Out of Stock" },
  { value: "B", label: "Back Order" },
];

export const ProductStatusFormOption = [
  { value: "A", label: "Active", isDisabled: false },
  { value: "I", label: "Inactive" },
  { value: "X", label: "Discontinued", isDisabled: true },
  { value: "D", label: "Draft" },
  { value: "O", label: "Out of Stock", isDisabled: true },
  { value: "B", label: "Back Order", isDisabled: true },
];

export const GMCProductStatusFormOption = [
  { value: "A", label: "Active", isDisabled: false },
  { value: "I", label: "Inactive" },
  { value: "D", label: "Draft" },
  // { value: "R", label: "Archived" },
];

export const ProductStatusMoreFilterOption = [
  { value: "A", label: "Active" },
  { value: "I", label: "Inactive" },
  // { value: "X", label: "Discontinued" },
  { value: "D", label: "Draft" },
  // { value: 'R', label: 'Archived' },
];

export const ProductIsDiscontinueMoreFilterOption = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
];

export const orderStatus = [
  { value: "New", label: "New" },
  { value: "Pending", label: "Pending" },
  { value: "Shipped", label: "Shipped" },
  { value: "Hold", label: "Hold" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Partially Shipped", label: "Partially Shipped" },
  { value: "EExpired", label: "Expired" },
];



export const SortingDirection = { ASC: 0, DESC: 1 };

export const extensionHttpMethod = [
  { value: "Get", label: "GET" },
  { value: "Post", label: "POST" },
  { value: "Put", label: "PUT" },
  { value: "Delete", label: "DELETE" },
  { value: "Patch", label: "PATCH" },
];

export const exportType = [
  { value: 0, label: "All" },
  { value: 1, label: "Product" },
  { value: 2, label: "Inventory" },
  { value: 3, label: "Companion" },
  { value: 4, label: "Category" },
  { value: 5, label: "FacetColor" },
  { value: 6, label: "FlyDate" },
  { value: 7, label: "Prices" },
  { value: 8, label: "UPC" },
  { value: 9, label: "AlterImage" },
  { value: 10, label: "Option Product" },
];

export const importType = [
  { value: 1, label: "Product" },
  { value: 2, label: "Inventory" },
  { value: 3, label: "Companion" },
  { value: 4, label: "Category" },
  { value: 5, label: "FacetColor" },
  { value: 6, label: "FlyDate" },
  { value: 7, label: "Prices" },
  { value: 8, label: "UPC" },
  { value: 9, label: "AlterImage" },
];

export const GMCExportType = [
  { value: 0, label: "All" },
  { value: 1, label: "Product" },
  { value: 3, label: "Companion" },
  { value: 4, label: "Category" },
  { value: 5, label: "FacetColor" },
  { value: 7, label: "Prices" },
  { value: 8, label: "UPC" },
  { value: 9, label: "AlterImage" },
  { value: 10, label: "Option Product" },
];

export const GMCImportType = [
  { value: 1, label: "Product" },
  { value: 3, label: "Companion" },
  { value: 4, label: "Category" },
  { value: 5, label: "FacetColor" },
  { value: 7, label: "Prices" },
  { value: 8, label: "UPC" },
  { value: 9, label: "AlterImage" },
];


export const storeExportType = [
  { value: 0, label: "All" },
  { value: 1, label: "Product" },
  { value: 2, label: "Logo Location" },
  { value: 3, label: "Companion" },
  { value: 4, label: "Minimum Quantity" }
];


export const storeImportType = [
  { value: 1, label: "Companion" },
  { value: 2, label: "Minimum Quantity" }
];


export const paginationOptions = [
  {
    id: 0,
    value: 25,
    period: "25 Per Page",
  },
  {
    id: 1,
    value: 50,
    period: "50 Per Page",
  },
  {
    id: 2,
    value: 100,
    period: "100 Per Page",
  },
];

export const EditStoreProductTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "all",
  },
  {
    id: 1,
    label: "Basic Information",
    value: "basicInformationForm",
    componentname: "basic",
  },
  {
    id: 2,
    label: "Pricing",
    value: "pricingForm",
    componentname: "pricing",
  },
  {
    id: 3,
    label: "Attributes",
    value: "AttributeForm",
    componentname: "attributes",
    // readOnly: true
  },
  {
    id: 4,
    label: "Vendor SKU Mapping",
    value: "VendorSKUMapping",
    componentname: "vendorskumapping",
  },
  {
    id: 5,
    label: "Inventory",
    value: "inventory",
    componentname: "inventory",
    readOnly: true
  },
  {
    id: 6,
    label: "Size Chart",
    value: "SizeChartForm",
    componentname: "sizechart",
  },
  {
    id: 7,
    label: "Personalization",
    value: "Personalization form",
    componentname: "personalization",
  },
  {
    id: 8,
    label: "Facet",
    value: "FacetForm",
    componentname: "facet",
  },

  {
    id: 9,
    label: "SKU Swap",
    value: "SKUSwapForm",
    componentname: "skuswap",
  },
  {
    id: 10,
    label: "Bundle",
    value: "BundleForm",
    componentname: "bundle",
    readOnly: true,
  },
  {
    id: 11,
    label: "SEO",
    value: "SEO form",
    componentname: "seo",
  },
  {
    id: 12,
    label: "Order History",
    value: "OrderHistoryForm",
    componentname: "orderhistory",
  },
  {
    id: 13,
    label: "Customer Reviews",
    value: "CustomerReviewsForm",
    componentname: "customerreviews",
  },
  {
    id: 14,
    label: "Customer FAQ",
    value: "CustomerFAQForm",
    componentname: "customerfaq",
  },
  {
    id: 15,
    label: "Life Cycle",
    value: "LifeCycle",
    componentname: "lifecycle",
  },
];

export const EditStoreBuilderProductTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "all",
  },
  {
    id: 1,
    label: "Basic Information",
    value: "basicInformationForm",
    componentname: "basic",
  },
  {
    id: 2,
    label: "Pricing",
    value: "pricingForm",
    componentname: "pricing",
  },
  {
    id: 3,
    label: "Attributes",
    value: "AttributeForm",
    componentname: "attributes",
    readOnly: true
  },
  {
    id: 4,
    label: "Inventory",
    value: "Inventory Form",
    componentname: "inventory",
    readOnly: true
  },
  {
    id: 5,
    label: "Personalization",
    value: "Personalization form",
    componentname: "personalization",
  },
  {
    id: 6,
    label: "Facet",
    value: "FacetForm",
    componentname: "facet",
  },
  {
    id: 7,
    label: "Order History",
    value: "OrderHistoryForm",
    componentname: "orderhistory",
  }
];

export const EditMasterTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "all",
  },
  {
    id: 1,
    label: "Basic Information",
    value: "basicInformationForm",
    componentname: "basic",
  },
  {
    id: 2,
    label: "Pricing",
    value: "pricingForm",
    componentname: "pricing",
  },
  {
    id: 4,
    label: "Attributes",
    value: "AttributeForm",
    componentname: "attributes",
  },
  {
    id: 5,
    label: "Vendor SKU Mapping",
    value: "VendorSKUMapping",
    componentname: "vendorskumapping",
  },
  {
    id: 6,
    label: "Inventory",
    value: "inventory",
    componentname: "inventory",
  },
  {
    id: 7,
    label: "Size Chart",
    value: "SizeChartForm",
    componentname: "sizechart",
  },
  {
    id: 8,
    label: "Personalization",
    value: "Personalization form",
    componentname: "personalization",
  },
  {
    id: 9,
    label: "Facet",
    value: "FacetForm",
    componentname: "facet",
  },
  {
    id: 11,
    label: "SKU Swap",
    value: "SKUSwapForm",
    componentname: "skuswap",
  },
  {
    id: 19,
    label: "Product And Store Mapping",
    value: "Product And Store Mapping",
    componentname: "productAndStoreMapping",
  },
  {
    id: 12,
    label: "Bundle",
    value: "BundleForm",
    componentname: "bundle",
  },
  {
    id: 18,
    label: "Life Cycle",
    value: "LifeCycle",
    componentname: "lifecycle",
  }
];

export const EditGrandMasterTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "all",
  },
  {
    id: 1,
    label: "Basic Information",
    value: "Basic Information",
    componentname: "basic",
  },
  {
    id: 2,
    label: "Pricing",
    value: "Pricing",
    componentname: "pricing",
  },
  // {
  //   id: 3,
  //   label: "Media",
  //   value: "Media form",
  //   componentname: "media",
  //   // readOnly: true,

  // },
  {
    id: 4,
    label: "Attributes",
    value: "AttributeForm",
    componentname: "attributes",
  },
  {
    id: 5,
    label: "Vendor SKU Mapping",
    value: "VendorSKUMapping",
    componentname: "vendorskumapping",
  },
];

export const EditBundleTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "all",
  },
  {
    id: 1,
    label: "Basic Information",
    value: "basicInformationForm",
    componentname: "basic",
    // readOnly: true,
  },
  {
    id: 2,
    label: "Pricing",
    value: "pricingForm",
    componentname: "pricing",
    // readOnly: true,
  },
  {
    id: 3,
    label: "Images",
    value: "Media form",
    componentname: "attributes",
    readOnly: true,
  },
  {
    id: 4,
    label: "Product",
    value: "Product form",
    componentname: "product",
    // readOnly: true,
  },
  {
    id: 5,
    label: "SEO",
    value: "SEO form",
    componentname: "seo",
    // readOnly: true,
  },

  {
    id: 6,
    label: "Order History",
    value: "OrderHistoryForm",
    componentname: "orderhistory",
  },
  {
    id: 7,
    label: "Customer Reviews",
    value: "CustomerReviewsForm",
    componentname: "customerreviews",
    // readOnly: true,
  },
  {
    id: 8,
    label: "Customer FAQ",
    value: "CustomerFAQForm",
    componentname: "customerfaq",
    // readOnly: true,
  },
  {
    id: 9,
    label: "Life Cycle",
    value: "LifeCycle",
    componentname: "lifecycle",
  },
];

export const displayTabs = [
  {
    id: 0,
    label: "General",
    value: "General",
    componentname: "General",
  },
  {
    id: 1,
    label: "Social",
    value: "Social",
    componentname: "Social",
  },
  {
    id: 2,
    label: "Integration",
    value: "Integration",
    componentname: "Integration",
  }
]

export const customerEditTabs = [
  {
    id: 0,
    label: "Personal Details",
    value: "Personal Details",
    componentname: "PersonalDetails",
    icon: "sensor_occupied",
  },
  {
    id: 1,
    label: "Actions",
    value: "Actions",
    componentname: "Actions",
    icon: "library_books",
  },
  {
    id: 2,
    label: "Emails",
    value: "Emails",
    componentname: "Emails",
    icon: "email",
  },
  {
    id: 3,
    label: "Payment Option",
    value: "Payment Option",
    componentname: "PaymentOption",
    icon: "payment",
  },
  {
    id: 4,
    label: "Orders",
    value: "Orders",
    componentname: "Orders",
    icon: "add_shopping_cart",
  },
  {
    id: 5,
    label: "Products",
    value: "Products",
    componentname: "Products",
    icon: "inventory_2",
  },
  {
    id: 6,
    label: "Notes",
    value: "Notes",
    componentname: "Notes",
    icon: "description",
  },
  {
    id: 7,
    label: "Custom Logo",
    value: "Custom Logo",
    componentname: "CustomLogo",
    icon: "store",
  },
  {
    id: 8,
    label: "Credit Info",
    value: "Credit Info",
    componentname: "CreditInfo",
    icon: "store",
  },
  {
    id: 9,
    label: "Tier Management",
    value: "Tier Management",
    componentname: "TierManagement",
    icon: "store",
  },
  {
    id: 10,
    label: "Life Cycle",
    value: "LifeCycle",
    componentname: "LifeCycle",
    icon: "store",
  },
];
export const companyEditTabs = [
  {
    id: 0,
    label: "Company Details",
    value: "Company Details",
    componentName: "CompanyDetails",
    icon: "sensor_occupied",
  },
  {
    id: 1,
    label: "Orders",
    value: "Orders",
    componentName: "Orders",
    icon: "add_shopping_cart",
  },
  {
    id: 2,
    label: "Products",
    value: "Products",
    componentName: "Products",
    icon: "inventory_2",
  },
  {
    id: 3,
    label: "Notes",
    value: "Notes",
    componentName: "Notes",
    icon: "description",
  },
  // {
  //   id: 4,
  //   label: "FeedBack",
  //   value: "FeedBack",
  //   componentName: "FeedBack",
  //   icon: "question_answer",
  // },

  {
    id: 4,
    label: "Custom Logo",
    value: "Custom Logo",
    componentName: "CustomLogo",
    icon: "store",
  },
  {
    id: 5,
    label: "Users",
    value: "Users",
    componentName: "Users",
    icon: "person_outline",
  },
  {
    id: 6,
    label: "Life Cycle",
    value: "LifeCycle",
    componentName: "LifeCycle",
    icon: "store",
  },
];

export const OrderCustomerTabs = [
  {
    id: 0,
    label: "Company Information",
    value: "Company Information form",
    componentname: "CompanyInfo",
  },
  {
    id: 1,
    label: "Personal Details",
    value: "Personal Details",
    componentname: "PersonalInformation",
  },
  {
    id: 2,
    label: "Payment Option",
    value: "Payment Option Form",
    componentname: "PaymentOption",
  },
  {
    id: 4,
    label: "Order",
    value: "Order Form",
    componentname: "Order",
  },
  {
    id: 5,
    label: "Customer Logo",
    value: "Customer Logo Form",
    componentname: "CustomerLogo",
  },
  {
    id: 5,
    label: "Tier Discount",
    value: "TierDiscount",
    componentname: "TierDiscount",
  },
];

export const paginationDetails = {
  pageIndex: 1,
  pageSize: 25,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  hasPageSize: true,
};
export const logOptions = { 0: "Select", 1: "Team Logs", 2: "My Logs" };

export const Domains = {
  apiDomains: "https://redefine-admin.azurewebsites.net/",
  siteDomains: "http://localhost/3000/",
};

export const contentPageType = { 0: "Website", 1: "Landing", 2: "Blog" };
export const contentTabs = [
  {
    id: 1,
    label: "Website Page",
    value: "website_page",
    componentname: "website_page",
    extra: {
      storeDefaultOption: "All Website Pages",
    },
  },
  {
    id: 2,
    label: "Landing Page",
    value: "landing_page",
    componentname: "landing_page",
    extra: {
      storeDefaultOption: "All Landing Pages",
    },
  },
  {
    id: 3,
    label: "Blog",
    value: "blog",
    componentname: "blog",
    extra: {
      storeDefaultOption: "All Blog Pages",
    },
  },
];

export const LEFT = "Left Align";
export const RIGHT = "Right Align";
export const CENTER = "Center Align";

export const AppliesOptions = [
  { label: "All Products", value: "1" },
  { label: "Brands", value: "2" },
  { label: "Category", value: "3" },
  { label: "Specific Products", value: "4" },
];

export const PromotionsTypeOptions = [
  { label: "Percentage", value: "1" },
  { label: "Fixed amount", value: "2" },
  { label: "Free shipping", value: "3" },
];

export const MinRequirementsOptions = [
  { label: "None", value: "1" },
  { label: "Minimum purchase amount($)", value: "2" },
  { label: "Minimum quantity of items", value: "3" },
];

export const EligibilityOptions = [
  { label: "Limit to one use per customer", value: "1" },
  { label: "Specific customers", value: "2" },
];
export const exportTabs = [
  {
    typeName: "Export Data",
    id: 0,
  },
  {
    typeName: "Export History",
    id: 1,
  },
];
export const ImportTabs = [
  {
    typeName: "Import Data",
    id: 0,
  },
  {
    typeName: "Import History",
    id: 1,
  },
];

export const InventoryImportExportTabs = [
  {
    typeName: "Download Product File",
    id: 0,
  },
  {
    typeName: "Upload Inventory File",
    id: 1,
  },
];

export const PageName = {
  Vendor: "Vendor",
  Brand: "Brand",
  Category: "Category",
  LogoLocationMaster: "LogoLocation",
  Dimension: "Dimension",
  SizeMaster: "SizeMaster",
  SizeChart: "SizeChart",
  Attributes: "Attributes",
  QuantityDiscount: "QuantityDiscount",
  ProductTagMaster: "ProductTag",
  ProductReady: "ProductReady",
  SEOReady: "SEOReady",
  GrandMasterCatalogProduct: "GrandMasterProduct",
  MasterCatalogProduct: "MasterProduct",
  Product: "StoreProduct",
  Bundle: "Bundle",
  Customer: "Customer",
};

export const productActivityDropDownData = [
  { value: "0", label: "Product Inventory" },
  { value: "1", label: "Product Orders" },
];
export const customerProductTab = [
  {
    id: 0,
    label: "Purchased",
    value: "Purchased",
    componentname: "Purchased",
  },
  {
    id: 1,
    label: "Added to cart",
    value: "cart",
    componentname: "Cart",
  },
  {
    id: 2,
    label: "Viewed",
    value: "Viewed",
    componentname: "Viewed",
  },
  {
    id: 4,
    label: "Wishlist",
    value: "Wishlist",
    componentname: "Wishlist",
  },
];

export const companyProductTab = [
  {
    id: 0,
    label: "Purchased",
    value: "Purchased",
    componentname: "Purchased",
  },
  {
    id: 1,
    label: "Added to cart",
    value: "cart",
    componentname: "Cart",
  },
  {
    id: 2,
    label: "Viewed",
    value: "Viewed",
    componentname: "Viewed",
  },
  {
    id: 3,
    label: "All Products",
    value: "AllProducts",
    componentname: "AllProducts",
  },
  {
    id: 4,
    label: "Wishlist",
    value: "Wishlist",
    componentname: "Wishlist",
  },
];

export const ContentPageStatus = {
  Publish: "Publish",
  Draft: "Draft",
};

export const companyId = 1;
export const AssetLibraryBasePath = `/rdc/${companyId}/`;
export const CustomCssFilePath = `${companyId}/store`;

export const blobFolder = {
  temp: "temp",
  brand: "Brand",
  vendor: "Vendor",
  attribute: "Attribute",
  category: "Category",
  color: "Color",
  dimension: "Dimension",
  logoLocation: "LogoLocation",
  productTag: "ProductTag",
  quantityDiscount: "QuantityDiscount",
  readiness: "Readiness",
  sizeChart: "SizeChart",
  sizeMaster: "SizeMaster",
  store: "Store",
  bundle: "Bundle",
  product: "Product",
  grandMaster: "GrandMaster",
  profile: "Profile",
  account: "Account",
  user: "User",
  seo: "Seo",
  import: "Import",
  export: "Export",
  customLogo: "CustomLogo",
  resendEmailAttachments: "resendEmailAttachments",
  themeConfiguration: "ThemeConfiguration",
  companyConfiguration: "CompanyConfiguration",
  socialSettings: "SocialSettings",
  elementBackground: "ElementBackground",
  elementDynamics: "ElementDynamics",
  elementHeader: "ElementHeader",
  elementImages: "ElementImages",
  media: "Media",
  attributeImages: "AttributeImages",
  attributeViews: "AttributeViews",
  seoViews: "SeoViews",
  catalog: "Catalog",
  tagModals: "TagModals",
  catalogModals: "catalogModals",
  openGraph: "OpenGraph",
  seoSocial: "SeoSocial",
  giftCard: "GiftCard"
};

export const DasshboardData = [
  {
    title: "Master Catalog",
    subTitle: "Product Management",
    Icon: "library_books",
    url: "/admin/MasterCatalog/dashboard",
  },
  {
    title: "Orders",
    subTitle: "",
    Icon: "local_mall",
    butttonstore: "store",
    url: "/admin/Order/orders",
  },
  {
    title: "Content",
    subTitle: "Content Management",
    Icon: "article",
    url: "/admin/Content/Page",
  },
  {
    title: "Promotions",
    subTitle: "Promotions Management",
    Icon: "local_offer",
    url: "/admin/promotions/couponCodes",
  },
  {
    title: "Store Builder",
    subTitle: "Store Management",
    Icon: "add_business",
    url: "/admin/StoreBuilder/dashboard",
  },
  {
    title: "Customer",
    subTitle: "Customers Management",
    Icon: "people_alt",
    url: "/admin/Customer/customer",
  },
  {
    title: "Google Analytics",
    subTitle: "Google/Semrush Reports",
    Icon: "analytics",
    url: "/admin/analytics",
  },
  {
    title: "Reports",
    subTitle: "Reports Management",
    Icon: "fact_check",
    url: "/admin/reports",
  },
];

export const MenuType = [
  { label: "None", value: "none" },
  { label: "Dynamic", value: "dynamic" },
  { label: "Custom", value: "custom" },
];

export const storeBuilderTabs = [
  {
    id: 0,
    label: "Setup",
    value: "setup",
    componentname: "setup",
  },
  {
    id: 1,
    label: "General",
    value: "general",
    componentname: "general",
  },
  {
    id: 2,
    label: "Payment & Info",
    value: "paymentInfo",
    componentname: "paymentInfo",
  },
  {
    id: 3,
    label: "Taxes & Fees",
    value: "tax",
    componentname: "tax",
  },
  {
    id: 4,
    label: "Messages",
    value: "message",
    componentname: "message",
  },
  {
    id: 5,
    label: "Products",
    value: "product",
    componentname: "product",
  },
  /*{
    id: 6,
    label: "Sequence",
    value: "sequence",
    componentname: "sequence",
  },*/
  {
    id: 7,
    label: "Categories",
    value: "category",
    componentname: "category",
  },
];

export const orderNotes = {
  order: 'N',
  Internal: 'I',
  shipped: 'S'
}
export const EditStoreBuilderBundleTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "all",
  },
  {
    id: 1,
    label: "Basic Information",
    value: "basicInformationForm",
    componentname: "basic",
    // readOnly: true,
  },
  {
    id: 2,
    label: "Pricing",
    value: "pricingForm",
    componentname: "pricing",
    // readOnly: true,
  },
  {
    id: 3,
    label: "Images",
    value: "Media form",
    componentname: "attributes",
    // readOnly: true,
  },
  {
    id: 4,
    label: "Products",
    value: "Product form",
    componentname: "product",
    // readOnly: true,
  }
];

export const CurrencySymbolByCode = {
  BRL: 'R$',
  CAD: 'CA$',
  CNY: '¥',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  KPW: '₩',
  KYD: 'CI$',
  RUB: '₽',
  SGD: 'S$',
  THB: '฿',
  USD: '$',
};
export const ShippedVia = [
  { value: 'usps', label: "USPS" },
  { value: 'ups', label: "UPS" },
  { value: 'ODFD', label: "One Day Fast Delivery" }
]


export const InventoryTypeForMasterCatalog = {
  SanMarInventoryUpdate: 1,
  ResParkInventoryUpdate: 2,
  AlphaBorderInventoryUpdate: 3,
  NavInventoryUpdate: 4
}



export const RandomColors = [
  "#86EFAC",
  "#263cff",
  "#B5BECC",
  "#93C5FD",
  "#FDA4AF",
  "#FDE047",
  "#7DD3FC",
  "#BEF264",
  "#FDBA74",
  "#D8B4FE",
  "#F9A8D4",
  "#67E8F9",
];



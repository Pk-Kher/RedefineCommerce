// import ProductTagMaster from "services/productTagMaster/ProductTagMaster";

const selectAllRecord = (e) => {
  // setCheckAllCheckbox(e.target.checked);
};
const CheckboxAllComponent = () => {
  return (
    <div className="flex items-center">
      <label className="inline-flex">
        <span className="sr-only">Select all</span>
        <input
          id="parent-checkbox"
          className="form-checkbox"
          type="checkbox"
          onClick={selectAllRecord}
        // defaultChecked={checkAllCheckbox}
        />
      </label>
    </div>
  );
};

export const columns = [
  {
    field: "id",
    headerName: CheckboxAllComponent,
    width: 70,
    isComponent: true,
    orderable: false,
  },
  {
    field: "order_no",
    headerName: "Order No.",
    width: 70,
    isComponent: false,
    orderable: true,
  },
  {
    field: "items",
    headerName: "Items",
    width: 70,
    isComponent: false,
    orderable: true,
  },
  {
    field: "total",
    headerName: "Total",
    width: 70,
    isComponent: false,
    orderable: true,
  },
  {
    field: "date",
    headerName: "Date",
    width: 70,
    isComponent: false,
    orderable: true,
  },
  {
    field: "store",
    headerName: "Store",
    width: 70,
    isComponent: false,
    orderable: true,
  },
  {
    field: "print_label",
    headerName: "Print Label",
    width: 70,
    isComponent: false,
    orderable: true,
  },
  {
    field: "capture_order",
    headerName: "Capture Order",
    width: 70,
    isComponent: false,
    orderable: true,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 70,
    isComponent: false,
    orderable: true,
  },
];

export const moreFilterOptions = [
  {
    name: "Brand",
    options: [
      { label: "A T Cross Company", value: "A T Cross Company" },
      { label: "adidas", value: "adidas" },
    ],
    type: "radio",
  },
  {
    name: "Name",
    options: [
      { label: "Admin 0", value: "Admin 0" },
      { label: "Admin 1", value: "Admin 1" },
    ],
    type: "checkbox",
  },
  {
    name: "Date",
    options: [],
    type: "date",
  },
];

// profile right
export const rights = ["view", "edit", "delete"];

export const storeData = [
  {
    id: "1",
    name: "American Magic",
    of_products: 85,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vipul S",
    created_by: "Vikas P",
    status: "Active",
  },
  {
    id: "2",
    name: "Cheers to Gear",
    of_products: 116,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vipul S",
    created_by: "Vipul S",
    status: "Active",
  },
  {
    id: "3",
    name: "Corporate Gear",
    of_products: 78,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vikas P",
    created_by: "Vipul S",
    status: "Active",
  },
  {
    id: "4",
    name: "Bacardi",
    of_products: 17,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vipul S",
    created_by: "Vikas P",
    status: "Draft",
  },
  {
    id: "5",
    name: "American Magic",
    of_products: 116,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vipul S",
    created_by: "Vikas P",
    status: "Active",
  },
  {
    id: "6",
    name: "Store Builder ParsonsKellogg",
    of_products: 11,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vikas P",
    created_by: "Vikas P",
    status: "Inactive",
  },

  {
    id: "7",
    name: "American Magic",
    of_products: 113,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vipul S",
    created_by: "Vipul S",
    status: "Archived",
  },
  {
    id: "8",
    name: "Store Builder Personkelloggs",
    of_products: 116,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vipul S",
    created_by: "Vikas P",
    status: "Draft",
  },
  {
    id: "9",
    name: "American Magic",
    of_products: 123,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vipul S",
    created_by: "Vipul S",
    status: "Inactive",
  },
  {
    id: "10",
    name: "Coeporate Gear",
    of_products: 116,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vipul S",
    created_by: "Vipul S",
    status: "Active",
  },
  {
    id: "11",
    name: "Bacardi",
    of_products: 16,
    modifieddate: "2021-12-18 15:53:05",
    createddate: "2021-11-17 18:53:05",
    updated_by: "Vikas P",
    created_by: "Vipul S",
    status: "Active",
  },
];

/* Category page data */
export const categoryProductsData = [
  {
    id: 1,
    name: "Men's Patagonia Better Sweater Jacket",
    prodstatus: "Active",
    image:
      "http://ystore.us/HTML/RedefineCommerce/tailwind-admin/images/stonewash.jpg",
  },
  {
    id: 2,
    name: "Men's Patagonia Better Sweater Jacket 2",
    prodstatus: "Inactive",
    image:
      "http://ystore.us/HTML/RedefineCommerce/tailwind-admin/images/stonewash.jpg",
  },
  {
    id: 3,
    name: "Men's Patagonia Better Sweater Jacket 3",
    prodstatus: "Active",
    image:
      "http://ystore.us/HTML/RedefineCommerce/tailwind-admin/images/stonewash.jpg",
  },
];

export const masterCatalogData = {
  fields: [
    {
      mappingname: "brandId",
      dbfield: "brandId",
      displayname: "Brand OR Manufacturer Name",
      required: "Y",
    },
    {
      mappingname: "brandName",
      dbfield: "brandName",
      displayname: "Brand OR Manufacturer Name",
      required: "Y",
    },
    {
      mappingname: "vendorId",
      dbfield: "vendorId",
      displayname: "Vendor Name",
      required: "Y",
    },
    {
      mappingname: "vendorName",
      dbfield: "vendorName",
      displayname: "Vendor Name",
      required: "Y",
    },
    {
      mappingname: "name",
      dbfield: "name",
      displayname: "Product Name",
      required: "Y",
    },
    {
      mappingname: "isNameDifferentfromERP",
      dbfield: "isNameDifferentfromERP",
      displayname: "Our ERP / NAV will have different Name from Above Name",
      required: "N",
    },
    {
      mappingname: "nameInERP",
      dbfield: "nameInERP",
      displayname: "ERP Name / NAV Name ",
      required: "Y",
    },
    {
      mappingname: "isERPNameDifferent",
      dbfield: "isERPNameDifferent",
      displayname: "This item has and Existing ID in our ERP / NAV",
      required: "N",
    },
    {
      mappingname: "erpItemId",
      dbfield: "erpItemId",
      displayname: "ERP / NAV Item ID",
      required: "N",
    },
    {
      mappingname: "vendorSKU",
      dbfield: "vendorSKU",
      displayname: "Vendor SKU / Manufacturer / Brand Part Number",
      required: "Y",
    },
    {
      mappingname: "ourSKU",
      dbfield: "ourSKU",
      displayname: "Our SKU",
      required: "Y",
    },
    {
      mappingname: "producttypeId",
      dbfield: "producttypeId",
      displayname: "Product Type",
      required: "Y",
    },
    {
      mappingname: "productTypeName",
      dbfield: "productTypeName",
      displayname: "Product Type",
      required: "Y",
    },
    {
      mappingname: "companionProduct",
      dbfield: "companionProduct",
      displayname: "Companion Product",
      required: "N",
    },
    {
      mappingname: "taxCode",
      dbfield: "taxCode",
      displayname: "Tax Code",
      required: "Y",
    },
    {
      mappingname: "categoryId",
      dbfield: "categoryId",
      displayname: "Category",
      required: "Y",
    },
    {
      mappingname: "description",
      dbfield: "description",
      displayname: "Description",
      required: "Y",
    },
    {
      mappingname: "shortDescription",
      dbfield: "shortDescription",
      displayname: "Short Description",
    },
    {
      mappingname: "dimensionTemplateId",
      dbfield: "dimensionTemplateId",
      displayname: "Search Dimension Template",
      required: "N",
    },
    {
      mappingname: "length",
      dbfield: "length",
      displayname: "Length",
      required: "N",
    },
    {
      mappingname: "width",
      dbfield: "width",
      displayname: "width",
      required: "N",
    },
    {
      mappingname: "height",
      dbfield: "height",
      displayname: "Height",
      required: "N",
    },
    {
      mappingname: "volume",
      dbfield: "volume",
      displayname: "Volume",
      required: "N",
    },
    {
      mappingname: "weightInLBS",
      dbfield: "weightInLBS",
      displayname: "Weight (LBS)",
      required: "N",
    },
    {
      mappingname: "shipWeightinLBS",
      dbfield: "shipWeightinLBS",
      displayname: "Ship Weight",
      required: "N",
    },

    // sizechart
    {
      mappingname: "sizeChartId",
      dbfield: "sizeChartId",
      displayname: "Size Chart",
      required: "Y",
    },
    {
      mappingname: "sizeChartDescription",
      dbfield: "sizeChartDescription",
      displayname: "Size Chart Template Description",
    },
    {
      mappingname: "attributename",
      dbfield: "attributename",
      displayname: "Attribute Name",
      required: "Y",
    },
    {
      mappingname: "attributevalue",
      dbfield: "attributevalue",
      displayname: "Attribute Value",
      required: "Y",
    },

    {
      mappingname: "questions",
      dbfield: "questions",
      displayname: "Questions",
      required: "Y",
    },
    {
      mappingname: "answers",
      dbfield: "answers",
      displayname: "Answers",
      required: "Y",
    },
    {
      mappingname: "optionName",
      dbfield: "optionName",
      displayname: "Option Name",
      required: "Y",
    },

    {
      mappingname: "attributeRequired ",
      dbfield: " AttributeRequired ",
      displayname: "attribute Required ",
      required: "N",
    },
    {
      mappingname: "optionValues",
      dbfield: "optionValues",
      displayname: "option Values",
      required: "Y",
    },

    {
      mappingname: "oldsku",
      dbfield: "oldsku",
      displayname: "Old SKU",
      required: "Y",
    },
    {
      mappingname: "newsku",
      dbfield: "newsku",
      displayname: "New SKU",
      required: "Y",
    },
    {
      mappingname: "personalization",
      dbfield: "personalization",
      displayname: "Personalization",
      required: "Y",
    },
    {
      mappingname: "isDiscontinue",
      dbfield: "isDiscontinue",
      displayname: "Discontinued?",
    }
  ],
};

export const ProductCatalogData = {
  fields: [
    {
      mappingname: "brandId",
      dbfield: "brandId",
      displayname: "Brand OR Manufacturer Name",
      required: "Y",
    },
    {
      mappingname: "page_url",
      dbfield: "page_url",
      displayname: "Page Url Name",
      required: "Y",
    },
    {
      mappingname: "brandName",
      dbfield: "brandName",
      displayname: "Brand OR Manufacturer Name",
      required: "Y",
    },
    {
      mappingname: "vendorId",
      dbfield: "vendorId",
      displayname: "Vendor Name",
      required: "Y",
    },
    {
      mappingname: "vendorName",
      dbfield: "vendorName",
      displayname: "Vendor Name",
      required: "Y",
    },
    {
      mappingname: "name",
      dbfield: "name",
      displayname: "Product Name",
      required: "Y",
    },
    {
      mappingname: "isNameDifferentfromERP",
      dbfield: "isNameDifferentfromERP",
      displayname: "Our ERP / NAV will have different Name from Above Name",
      required: "N",
    },
    {
      mappingname: "nameInERP",
      dbfield: "nameInERP",
      displayname: "ERP Name / NAV Name ",
      required: "Y",
    },
    {
      mappingname: "isERPNameDifferent",
      dbfield: "isERPNameDifferent",
      displayname: "This item has and Existing ID in our ERP / NAV",
      required: "N",
    },
    {
      mappingname: "erpItemId",
      dbfield: "erpItemId",
      displayname: "ERP / NAV Item ID",
      required: "N",
    },
    {
      mappingname: "vendorSKU",
      dbfield: "vendorSKU",
      displayname: "Vendor SKU / Manufacturer / Brand Part Number",
      required: "Y",
    },
    {
      mappingname: "ourSKU",
      dbfield: "ourSKU",
      displayname: "Our SKU",
      required: "Y",
    },
    {
      mappingname: "producttypeId",
      dbfield: "producttypeId",
      displayname: "Product Type",
      required: "Y",
    },
    {
      mappingname: "productTypeName",
      dbfield: "productTypeName",
      displayname: "Product Type",
      required: "Y",
    },
    {
      mappingname: "companionProduct",
      dbfield: "companionProduct",
      displayname: "Companion Product",
      required: "N",
    },
    {
      mappingname: "taxCode",
      dbfield: "taxCode",
      displayname: "Tax Code",
      required: "Y",
    },
    {
      mappingname: "categoryId",
      dbfield: "categoryId",
      displayname: "Category",
      required: "Y",
    },
    {
      mappingname: "description",
      dbfield: "description",
      displayname: "Description",
      required: "Y",
    },
    {
      mappingname: "shortDescription",
      dbfield: "shortDescription",
      displayname: "Short Description",
    },
    {
      mappingname: "dimensionTemplateId",
      dbfield: "dimensionTemplateId",
      displayname: "Search Dimension Template",
      required: "N",
    },
    {
      mappingname: "length",
      dbfield: "length",
      displayname: "Length",
      required: "N",
    },
    {
      mappingname: "width",
      dbfield: "width",
      displayname: "width",
      required: "N",
    },
    {
      mappingname: "height",
      dbfield: "height",
      displayname: "Height",
      required: "N",
    },
    {
      mappingname: "volume",
      dbfield: "volume",
      displayname: "Volume",
      required: "N",
    },
    {
      mappingname: "weightInLBS",
      dbfield: "weightInLBS",
      displayname: "Weight (LBS)",
      required: "N",
    },
    {
      mappingname: "shipWeightinLBS",
      dbfield: "shipWeightinLBS",
      displayname: "Ship Weight",
      required: "N",
    },
    // pricing
    {
      mappingname: "quantityDiscountTemplate",
      dbfield: "quantityDiscountTemplate",
      displayname: "Quantity Discount Template",
    },
    /* SEO Fields */
    {
      mappingname: "previewType",
      dbfield: "previewType",
      displayname: "Preview Type",
      required: "N",
    },
    {
      mappingname: "seName",
      dbfield: "seName",
      displayname: "seName",
      required: "Y",
    },
    {
      mappingname: "pageTitle",
      dbfield: "pageTitle",
      displayname: "Page Title",
      required: "Y",
    },
    {
      mappingname: "metaDescription",
      dbfield: "metaDescription",
      displayname: "Meta Description",
      required: "Y",
    },
    {
      mappingname: "metaKeywords",
      dbfield: "metaKeywords",
      displayname: "Meta Keywords",
      required: "Y",
    },
    {
      mappingname: "roiKeywords",
      dbfield: "roiKeywords",
      displayname: "ROI Keywords",
      required: "N",
    },
    {
      mappingname: "targetedKeywords",
      dbfield: "targetedKeywords",
      displayname: "Targeted Keywords",
      required: "N",
    },
    {
      mappingname: "h1",
      dbfield: "h1title",
      displayname: "H1",
      required: "N",
    },
    {
      mappingname: "h2",
      dbfield: "h2title",
      displayname: "H2",
      required: "N",
    },
    {
      mappingname: "h3",
      dbfield: "h3title",
      displayname: "H3",
      required: "N",
    },
    {
      mappingname: "h4",
      dbfield: "h4title",
      displayname: "H4",
      required: "N",
    },
    {
      mappingname: "h5",
      dbfield: "h5title",
      displayname: "H5",
      required: "N",
    },
    {
      mappingname: "h6",
      dbfield: "H6title",
      displayname: "h6",
      required: "N",
    },
    {
      mappingname: "openGraphImagePath",
      dbfield: "openGraphImagePath",
      displayname: "Open Graph Image",
      required: "N",
    },
    {
      mappingname: "openGraphTitle",
      dbfield: "openGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "openGraphDescription",
      dbfield: "openGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },
    {
      mappingname: "facebookImagePath",
      dbfield: "facebookImagePath",
      displayname: "facebookImagePath",
      required: "N",
    },
    {
      mappingname: "facebookOpenGraphTitle",
      dbfield: "facebookOpenGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "facebookOpenGraphDescription",
      dbfield: "facebookOpenGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },
    {
      mappingname: "twitterImagePath",
      dbfield: "twitterImagePath",
      displayname: "twitterImagePath",
      required: "N",
    },
    {
      mappingname: "twitterOpenGraphTitle",
      dbfield: "twitterOpenGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "twitterOpenGraphDescription",
      dbfield: "twitterOpenGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },
    {
      mappingname: "linkedinImagePath",
      dbfield: "linkedinImagePath",
      displayname: "linkedinImagePath",
      required: "N",
    },
    {
      mappingname: "linkedinOpenGraphTitle",
      dbfield: "linkedinOpenGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "linkedinOpenGraphDescription",
      dbfield: "linkedinOpenGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },
    {
      mappingname: "pinterestImagePath",
      dbfield: "pinterestImagePath",
      displayname: "Open Graph image",
      required: "N",
    },
    {
      mappingname: "pinterestOpenGraphTitle",
      dbfield: "pinterestOpenGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "pinterestOpenGraphDescription",
      dbfield: "pinterestOpenGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },

    // sizechart
    {
      mappingname: "sizeChartId",
      dbfield: "sizeChartId",
      displayname: "Size Chart",
      required: "Y",
    },
    {
      mappingname: "sizeChartDescription",
      dbfield: "sizeChartDescription",
      displayname: "Size Chart Template Description",
    },
    {
      mappingname: "attributename",
      dbfield: "attributename",
      displayname: "Attribute Name",
      required: "Y",
    },
    {
      mappingname: "attributevalue",
      dbfield: "attributevalue",
      displayname: "Attribute Value",
      required: "Y",
    },
    {
      mappingname: "questions",
      dbfield: "questions",
      displayname: "Questions",
      required: "Y",
    },
    {
      mappingname: "answers",
      dbfield: "answers",
      displayname: "Answers",
      required: "Y",
    },
    {
      mappingname: "optionName",
      dbfield: "optionName",
      displayname: "Option Name",
      required: "Y",
    },
    {
      mappingname: "attributeRequired ",
      dbfield: " AttributeRequired ",
      displayname: "attribute Required ",
      required: "N",
    },
    {
      mappingname: "optionValues",
      dbfield: "optionValues",
      displayname: "option Values",
      required: "Y",
    },
    {
      mappingname: "oldsku",
      dbfield: "oldsku",
      displayname: "Old SKU",
      required: "Y",
    },
    {
      mappingname: "newsku",
      dbfield: "newsku",
      displayname: "New SKU",
      required: "Y",
    },
    {
      mappingname: "personalization",
      dbfield: "personalization",
      displayname: "Personalization",
      required: "Y",
    },
  ],
};

export const GrandMasterCatalogData = {
  fields: [
    {
      mappingname: "brandId",
      dbfield: "brandId",
      displayname: "Brand OR Manufacturer Name",
      required: "Y",
    },
    {
      mappingname: "brandName",
      dbfield: "brandName",
      displayname: "Brand OR Manufacturer Name",
      required: "Y",
    },
    {
      mappingname: "vendorId",
      dbfield: "vendorId",
      displayname: "Vendor Name",
      required: "Y",
    },
    {
      mappingname: "vendorName",
      dbfield: "vendorName",
      displayname: "Vendor Name",
      required: "Y",
    },
    {
      mappingname: "name",
      dbfield: "name",
      displayname: "Product Name",
      required: "Y",
    },
    {
      mappingname: "isNameDifferentfromERP",
      dbfield: "isNameDifferentfromERP",
      displayname: "Our ERP / NAV will have different Name from Above Name",
      required: "N",
    },
    {
      mappingname: "nameInERP",
      dbfield: "nameInERP",
      displayname: "ERP Name / NAV Name ",
      required: "Y",
    },
    {
      mappingname: "isERPNameDifferent",
      dbfield: "isERPNameDifferent",
      displayname: "This item has and Existing ID in our ERP / NAV",
      required: "N",
    },
    {
      mappingname: "erpItemId",
      dbfield: "erpItemId",
      displayname: "ERP / NAV Item ID",
      required: "N",
    },
    {
      mappingname: "vendorSKU",
      dbfield: "vendorSKU",
      displayname: "Vendor SKU / Manufacturer / Brand Part Number",
      required: "Y",
    },
    {
      mappingname: "ourSKU",
      dbfield: "ourSKU",
      displayname: "Our SKU",
      required: "Y",
    },
    {
      mappingname: "producttypeId",
      dbfield: "producttypeId",
      displayname: "Product Type",
      required: "Y",
    },
    {
      mappingname: "productTypeName",
      dbfield: "productTypeName",
      displayname: "Product Type",
    },
    {
      mappingname: "companionProduct",
      dbfield: "companionProduct",
      displayname: "Companion Product",
      required: "N",
    },
    {
      mappingname: "taxCode",
      dbfield: "taxCode",
      displayname: "Tax Code",
      required: "Y",
    },
    {
      mappingname: "description",
      dbfield: "description",
      displayname: "Description",
      required: "Y",
    },
    {
      mappingname: "dimensionTemplateId",
      dbfield: "dimensionTemplateId",
      displayname: "Search Dimension Template",
      required: "N",
    },
    {
      mappingname: "length",
      dbfield: "length",
      displayname: "Length",
      required: "N",
    },
    {
      mappingname: "width",
      dbfield: "width",
      displayname: "width",
      required: "N",
    },
    {
      mappingname: "height",
      dbfield: "height",
      displayname: "Height",
      required: "N",
    },
    {
      mappingname: "volume",
      dbfield: "volume",
      displayname: "Volume",
      required: "N",
    },
    {
      mappingname: "weightInLBS",
      dbfield: "weightInLBS",
      displayname: "Weight (LBS)",
      required: "N",
    },
    {
      mappingname: "shipWeightinLBS",
      dbfield: "shipWeightinLBS",
      displayname: "Ship Weight",
      required: "N",
    },
  ],
};

export const bundleFields = {
  fields: [
    {
      mappingname: "name",
      dbfield: "name",
      displayname: "Bundle Name",
      required: "Y",
    },
    {
      mappingname: "description",
      dbfield: "description",
      displayname: "Description",
    },
    {
      mappingname: "isNameDifferentfromERP",
      dbfield: "isNameDifferentfromERP",
      displayname: "Our ERP / NAV will have different Name from Above Name",
      required: "N",
    },
    {
      mappingname: "nameInERP",
      dbfield: "nameInERP",
      displayname: "ERP Name / NAV Name ",
      required: "Y",
    },
    {
      mappingname: "isERPNameDifferent",
      dbfield: "isERPNameDifferent",
      displayname: "This item has and Existing ID in our ERP / NAV",
      required: "N",
    },
    {
      mappingname: "erpItemId",
      dbfield: "erpItemId",
      displayname: "ERP / NAV Item ID",
      required: "N",
    },
    {
      mappingname: "ourSKU",
      dbfield: "ourSKU",
      displayname: "Our SKU",
      required: "Y",
    },
    {
      mappingname: "producttypeId",
      dbfield: "producttypeId",
      displayname: "Product Type",
      required: "Y",
    },
    {
      mappingname: "taxCode",
      dbfield: "taxCode",
      displayname: "Tax Code",
      required: "Y",
    },
    {
      mappingname: "categoryId",
      dbfield: "categoryId",
      displayname: "Category",
      required: "Y",
    },
    {
      mappingname: "description",
      dbfield: "description",
      displayname: "Description",
      required: "Y",
    },
    {
      mappingname: "shortDescription",
      dbfield: "shortDescription",
      displayname: "Short Description",
    },
    {
      mappingname: "dimensionTemplateId",
      dbfield: "dimensionTemplateId",
      displayname: "Search Dimension Template",
      required: "N",
    },
    {
      mappingname: "length",
      dbfield: "length",
      displayname: "Length",
      required: "N",
    },
    {
      mappingname: "width",
      dbfield: "width",
      displayname: "width",
      required: "N",
    },
    {
      mappingname: "height",
      dbfield: "height",
      displayname: "Height",
      required: "N",
    },
    {
      mappingname: "volume",
      dbfield: "volume",
      displayname: "Volume",
      required: "N",
    },
    {
      mappingname: "weightInLBS",
      dbfield: "weightInLBS",
      displayname: "Weight (LBS)",
      required: "N",
    },
    {
      mappingname: "shipWeightinLBS",
      dbfield: "shipWeightinLBS",
      displayname: "Ship Weight",
      required: "N",
    },
    // pricing
    {
      mappingname: "quantityDiscountTemplate",
      dbfield: "quantityDiscountTemplate",
      displayname: "Quantity Discount Template",
    },
    /* SEO Fields */
    {
      mappingname: "previewType",
      dbfield: "previewType",
      displayname: "Preview Type",
      required: "N",
    },
    {
      mappingname: "seName",
      dbfield: "seName",
      displayname: "seName",
      required: "Y",
    },
    {
      mappingname: "pageTitle",
      dbfield: "pageTitle",
      displayname: "Page Title",
      required: "Y",
    },
    {
      mappingname: "metaDescription",
      dbfield: "metaDescription",
      displayname: "Meta Description",
      required: "Y",
    },
    {
      mappingname: "metaKeywords",
      dbfield: "metaKeywords",
      displayname: "Meta Keywords",
      required: "Y",
    },
    {
      mappingname: "roiKeywords",
      dbfield: "roiKeywords",
      displayname: "ROI Keywords",
      required: "N",
    },
    {
      mappingname: "targetedKeywords",
      dbfield: "targetedKeywords",
      displayname: "Targeted Keywords",
      required: "N",
    },
    {
      mappingname: "h1",
      dbfield: "h1title",
      displayname: "H1",
      required: "N",
    },
    {
      mappingname: "h2",
      dbfield: "h2title",
      displayname: "H2",
      required: "N",
    },
    {
      mappingname: "h3",
      dbfield: "h3title",
      displayname: "H3",
      required: "N",
    },
    {
      mappingname: "h4",
      dbfield: "h4title",
      displayname: "H4",
      required: "N",
    },
    {
      mappingname: "h5",
      dbfield: "h5title",
      displayname: "H5",
      required: "N",
    },
    {
      mappingname: "h6",
      dbfield: "H6title",
      displayname: "h6",
      required: "N",
    },
    {
      mappingname: "openGraphImagePath",
      dbfield: "openGraphImagePath",
      displayname: "Open Graph Image",
      required: "N",
    },
    {
      mappingname: "openGraphTitle",
      dbfield: "openGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "openGraphDescription",
      dbfield: "openGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },
    {
      mappingname: "facebookImagePath",
      dbfield: "facebookImagePath",
      displayname: "facebookImagePath",
      required: "N",
    },
    {
      mappingname: "facebookOpenGraphTitle",
      dbfield: "facebookOpenGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "facebookOpenGraphDescription",
      dbfield: "facebookOpenGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },
    {
      mappingname: "twitterImagePath",
      dbfield: "twitterImagePath",
      displayname: "twitterImagePath",
      required: "N",
    },
    {
      mappingname: "twitterOpenGraphTitle",
      dbfield: "twitterOpenGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "twitterOpenGraphDescription",
      dbfield: "twitterOpenGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },
    {
      mappingname: "linkedinImagePath",
      dbfield: "linkedinImagePath",
      displayname: "linkedinImagePath",
      required: "N",
    },
    {
      mappingname: "linkedinOpenGraphTitle",
      dbfield: "linkedinOpenGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "linkedinOpenGraphDescription",
      dbfield: "linkedinOpenGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },
    {
      mappingname: "pinterestImagePath",
      dbfield: "pinterestImagePath",
      displayname: "Open Graph image",
      required: "N",
    },
    {
      mappingname: "pinterestOpenGraphTitle",
      dbfield: "pinterestOpenGraphTitle",
      displayname: "Open Graph Title",
      required: "N",
    },
    {
      mappingname: "pinterestOpenGraphDescription",
      dbfield: "pinterestOpenGraphDescription",
      displayname: "Open Graph Description",
      required: "N",
    },
  ],
};

export const logoutTime = [
  { label: "15 minutes", value: "15" },
  { label: "20 minutes", value: "20" },
  { label: "25 minutes", value: "25" },
  { label: "30 minutes", value: "30" },
  { label: "35 minutes", value: "35" },
  { label: "40 minutes", value: "40" },
];

export const loginPageStyle = [
  { value: "Right Align", label: "Right Align" },
  { value: "Left Align", label: "Left Align" },
  { value: "Center Align", label: "Center Align" },
];

export const ProductTagMaster = [
  { value: 1, label: "Top Left" },
  { value: 2, label: "Top Center" },
  { value: 3, label: "Top Right" },
  { value: 4, label: "Bottom Left" },
  { value: 5, label: "Bottom Center" },
  { value: 6, label: "Bottom Right" },
];

export const ProductStatusData = [
  { name: "New Product?", value: false, dbfield: "isNewProduct" },
  { name: "Can this product Assemble?", value: true, dbfield: "isAssembleProduct" },
  { name: "Drop Ship Product?", value: false, dbfield: "isDropShipProduct" },
  { name: "Sale Product?", value: false, dbfield: "isSaleProduct" },
  { name: "Restricted product?", value: false, dbfield: "isrestrictedProduct" },
  { name: "Featured", value: false, dbfield: "isFeatured" },
  { name: "New Arrival", value: false, dbfield: "isNewArrival" },
  { name: "Best Seller", value: false, dbfield: "isbestSellar" },
  { name: "Price Quote", value: false, dbfield: "isPriceQuote" },
  { name: "Giftset", value: false, dbfield: "isGiftSet" },
  { name: "Coming Soon", value: false, dbfield: "isCommingSoon" },
  { name: "No coupon", value: true, dbfield: "isNoCoupan" },
  { name: "Separate Ship?", value: false, dbfield: "isSepateShip" },
  { name: "Sample Product?", value: false, dbfield: "isSampleProduct" },
];

export const BundleProductStatusData = [
  { name: "Sale Product?", value: false, dbfield: "isSaleProduct" },
  { name: "Restricted product?", value: false, dbfield: "isrestrictedProduct" },
  { name: "New Arrival", value: false, dbfield: "isNewArrival" },
  { name: "Best Seller", value: false, dbfield: "isbestSellar" },
  { name: "Price Quote", value: false, dbfield: "isPriceQuote" },
  { name: "Giftset", value: false, dbfield: "isGiftSet" },
  { name: "Coming Soon", value: false, dbfield: "isCommingSoon" },
  { name: "No coupon", value: true, dbfield: "isNoCoupan" },
];

export const brandColumnsOptions = [
  { value: 1, label: "name" },
  { value: 2, label: "vendors" },
  { value: 3, label: "Status" },
  { value: 4, label: "Created By" },
  { value: 5, label: "Updated By" },
  { value: 6, label: "Created Date" },
  { value: 7, label: "Updated Date" },
];

export const ContentWebsitePageData = [
  {
    name: "Patagonia Corporate Gifts",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "P",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "PK Health Gear",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "A",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Corporate Gear",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "D",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Gameday Gear",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "P",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Cheers to Gear",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "R",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
];

export const ContentLandingPageData = [
  {
    name: "Patagonia Corporate Gifts",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "P",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Branded Nike Apparel",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "A",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Custom Yeti Cups",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "D",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Peter Millar Custom Golf Clothing",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "P",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Adidas Custom Branded Apparel",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "R",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
];

export const ContentBlogPageData = [
  {
    name: "A North Face Fleece Jacket Increases Brand Visibility",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "P",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Employee Appreciation Day Gift Ideas for Your Hard Working Staff",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "A",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Pantone Colors & the Important Role they Play in Co-Branding",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "D",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Custom YETI (Everything) Built for Your Logo",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "P",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
  {
    name: "Branded Nike Markets Your Business Beyond Any Metric",
    access_url: "https://www.corporategear.com/pantone-colors",
    publish_status: "R",
    test_status: "A/B Testing",
    created_at: "Dec 12, 2021 10:07 AM",
    created_by: "Vipul S",
    updated_at: "Dec 12, 2021 10:07 AM",
    updated_by: "Vipul S",
    domain: "www.parsonskellogg.com",
    publish_at: "Dec 12, 2021 10:07 AM",
    page_title: "About Us",
  },
];

export const StoreProductStatusTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "All",
    extra: {
      storeDefaultOption: "All",
    },
    filter: [],
  },
  {
    id: 1,
    label: "Active",
    value: "Active",
    componentname: "Active",
    extra: {
      storeDefaultOption: "Active",
    },
    filter: [
      {
        field: "recStatus",
        operator: 0,
        value: "A",
      },
    ],
  },
  {
    id: 2,
    label: " Draft",
    value: "Draft",
    componentname: "Draft",
    extra: {
      storeDefaultOption: "Draft",
    },
    filter: [
      {
        field: "recStatus",
        operator: 0,
        value: "D",
      },
    ],
  },
  {
    id: 3,
    label: "Inactive",
    value: "Inactive",
    componentname: "Inactive",
    extra: {
      storeDefaultOption: "Inactive",
    },
    filter: [
      {
        field: "recStatus",
        operator: 0,
        value: "I",
      },
    ],
  },
  // {
  //   id: 4,
  //   label: "Discontinued",
  //   value: "Discontinued",
  //   componentname: "Discontinued",
  //   extra: {
  //     storeDefaultOption: "Discontinued",
  //   },
  //   filter: [
  //     {
  //       field: "recStatus",
  //       operator: 0,
  //       value: "X",
  //     },
  //   ],
  // },
  {
    id: 5,
    label: "Bundle",
    value: "Bundle",
    componentname: "Bundle",
    extra: {
      storeDefaultOption: "Bundle",
    },
    filter: [],
  },
];

export const PromotionStatusTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "All",
    extra: {
      storeDefaultOption: "All",
    },
    filter: [],
  },
  {
    id: 1,
    label: "Active",
    value: "Active",
    componentname: "Active",
    extra: {
      storeDefaultOption: "Active",
    },
    filter: [
      {
        field: "status",
        operator: 1,
        value: "A",
      },
    ],
  },
  {
    id: 2,
    label: " Scheduled",
    value: "Scheduled",
    componentname: "Scheduled",
    extra: {
      storeDefaultOption: "Scheduled",
    },
    filter: [
      {
        field: "status",
        operator: 1,
        value: "S",
      },
    ],
  },
  {
    id: 3,
    label: "Expired",
    value: "Expired",
    componentname: "Expired",
    extra: {
      storeDefaultOption: "Expired",
    },
    filter: [
      {
        field: "status",
        operator: 1,
        value: "E",
      },
    ],
  },
];

export const ViewOrdersData = [
  {
    orders: "Sanmar",
    orddate: "Dec 12, 2021 10:07 AM",
    amount: " $ 139.00",
    customerName: "Thunder Boult",
  },
  {
    orders: "ertrSanmar01",
    orddate: "Dec 12, 2021 10:07 AM",
    amount: "$ 159.00",
    customerName: "Spiderman",
  },
];

export const productTilesDetailData = [
  {
    title: "Last Publish Detail",
    subTitle: "Last Published on Sept 05, 2021 - 12:14 PM",
    subTitle2: "Last Published by Vipul S.",
    btnName: "View Log",
  },
  {
    title: "Last Save Detail",
    subTitle: "Last Saved on Sept 05, 2021 - 12:14 PM",
    subTitle2: "Last Saved by Vipul S.",
    btnName: "View Log",
  },
];

export const importData = [
  {
    title: "Image",
    field: ["Image", "title", "status"],
    sample_data: "Hello",
    updated_date: "2022-06-06T14:45:32.616236",
    UpdatedByName: "Subroza",
  },
  {
    title: "title",
    field: ["Image", "title", "status"],
    sample_data: "Hello",
    updated_date: "2022-06-06T14:45:32.616236",
    UpdatedByName: "Subroza",
  },
];

export const OrderStatusTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "All",
    extra: {
      storeDefaultOption: "All",
    },
    filter: [],
    recordCount: '0'
  },
  {
    id: 1,
    label: "Phone Order",
    value: "Phone Order",
    componentname: "Phone Order",
    extra: {
      storeDefaultOption: "Phone Order",
    },
    filter: [
      {
        field: "isPhoneOrder",
        operator: 0,
        value: "true",
      },
    ],
    recordCount: '0'
  },
  {
    id: 2,
    label: " New/Unfulfilled ",
    value: "New/Unfulfilled ",
    componentname: "New/Unfulfilled ",
    extra: {
      storeDefaultOption: "New/Unfulfilled ",
    },
    filter: [
      {
        field: 'fulfillmentStatus',
        operator: 0,
        value: 'Unfulfilled'
      }
    ],
    recordCount: '0'
  },
  {
    id: 3,
    label: "Shipped",
    value: "Shipped",
    componentname: "Shipped",
    extra: {
      storeDefaultOption: "Shipped",
    },
    filter: [{
      field: 'fulfillmentStatus',
      operator: 0,
      value: 'Shipped'
    }],
    recordCount: '0'
  },
  {
    id: 4,
    label: "Cancelled",
    value: "Cancelled",
    componentname: "Cancelled",
    extra: {
      storeDefaultOption: "Cancelled",
    },
    filter: [
      {
        field: 'fulfillmentStatus',
        operator: 0,
        value: 'Cancelled'
      }
    ],
    recordCount: '0'
  },
];

export const orderHistory = [
  {
    orderNo: "#258478",
    order_date: "2022-06-06T14:45:32.616236",
    customer: "subroza",
    qty: "5",
    total: "16.65.00",
    payment_status: "Paid",
    fulfillment_status: "Unfulfilled",
  },
  {
    orderNo: "#258478",
    order_date: "2022-06-06T14:45:32.616236",
    customer: "subroza",
    qty: "5",
    total: "2500.00",
    payment_status: "Paid",
    fulfillment_status: "FulFilled",
  },
];

export const ChartOrderData = [
  {
    month: "Jan",
    year: 2011,
    ordersAmount: 2154,
  },
  {
    month: "Feb",
    year: 2011,
    ordersAmount: 2548,
  },
  {
    month: "Mar",
    year: 2012,
    ordersAmount: 8457,
  },
  {
    month: "Apr",
    year: 2012,
    ordersAmount: 9874,
  },
  {
    month: "May",
    year: 2022,
    ordersAmount: 4512,
  },
  {
    month: "Jun",
    year: 2020,
    ordersAmount: 6548,
  },
  {
    month: "Sep",
    year: 2023,
    ordersAmount: 8951,
  },
];

export const ChartInventoryData = [
  {
    month: "Jan",
    year: 4000,
    ordersAmount: 3654,
  },
  {
    month: "Feb",
    year: 1506,
    ordersAmount: 2548,
  },
  {
    month: "Mar",
    year: 1250,
    ordersAmount: 8457,
  },
  {
    month: "Apr",
    year: 5050,
    ordersAmount: 9874,
  },
  {
    month: "May",
    year: 2664,
    ordersAmount: 4512,
  },
  {
    month: "Jun",
    year: 6565,
    ordersAmount: 6548,
  },
  {
    month: "Sep",
    year: 2627,
    ordersAmount: 8951,
  },
];

export const themeBorderStyleOptions = [
  { value: "", label: "Select an option" },
  { value: "none", label: "None" },
  { value: "solid", label: "Solid" },
  { value: "dotted", label: "Dotted" },
  { value: "dashed", label: "Dashed" },
  { value: "double", label: "Double" },
];
export const themeFontStyleOptions = [
  { value: "", label: "Select Fonts" },
  { value: "'Open Sans', sans-serif", label: "Open Sans, sans-serif" },
  { value: "'Outfit', sans-serif", label: "Outfit, sans-serif" },
  { value: "'Lato', sans-serif", label: "Lato, sans-serif" },
  { value: "'Roboto', sans-serif", label: "Roboto, sans-serif" },
];
export const themeFontTransformationOption = [
  { value: "0", label: "Select an option" },
  { value: "none", label: "None" },
  { value: "capitalize", label: "Capitalize" },
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
];
export const themeFontWeightOption = [
  { value: "0", label: "Select Font Weight" },
  { value: "100", label: "100" },
  { value: "200", label: "200" },
  { value: "300", label: "300" },
  { value: "400", label: "400" },
  { value: "500", label: "500" },
  { value: "600", label: "600" },
  { value: "700", label: "700" },
  { value: "800", label: "800" },
  { value: "900", label: "900" },
];

export const themeFontSizeOption = [
  { value: "0", label: "Select Font Weight" },
  { value: "0.75rem", label: "12px" },
  { value: "1rem", label: "16px" },
  { value: "1.25rem", label: "20px" },
  { value: "1.50rem", label: "24px" },
  { value: "1.75rem", label: "28px" },
  { value: "2rem", label: "32px" },
  { value: "2.25rem", label: "36px" },
  { value: "2.50rem", label: "40px" },
  { value: "2.75rem", label: "44px" },
  { value: "3rem", label: "48px" },
  { value: "3.25rem", label: "52px" },
  { value: "3.50rem", label: "56px" },
  { value: "3.75rem", label: "60px" },
  { value: "4rem", label: "64px" },
  { value: "4.25rem", label: "68px" },
  { value: "4.50rem", label: "72px" },
  { value: "4.75rem", label: "76px" },
  { value: "5rem", label: "80px" },
];

export const FontSizeOptionDetailPage = [
  { label: "Small", value: "text-sm" },
  { label: "Normal", value: "text-base" },
  { label: "Large", value: "text-lg" },
];

export const TextStyleSizeOptionDetailPage = [
  { value: "font-bold", label: "Bold" },
  { value: "italic", label: "Italic" },
  { value: "underline", label: "Underline" },
];

export const WishlistOption = [
  { value: "hide", label: "Hide" },
  { value: "left_top", label: "Left Top" },
  { value: "left_bottom", label: "Left Bottom" },
  { value: "right_top", label: "Right Top" },
  { value: "right_bottom", label: "Right Bottom" },
];

export const themeLetterSpacingOption = [
  { value: "0px", label: "Default" },
  { value: "1px", label: "1" },
  { value: "2px", label: "2" },
  { value: "3px", label: "3" },
  { value: "4px", label: "4" },
  { value: "5px", label: "5" },
  { value: "6px", label: "6" },
  { value: "7px", label: "7" },
  { value: "8px", label: "8" },
  { value: "9px", label: "9" },
  { value: "10px", label: "10" },
  { value: "11px", label: "11" },
  { value: "12px", label: "12" },
  { value: "13px", label: "13" },
  { value: "14px", label: "14" },
  { value: "15px", label: "15" },
];

export const themeMaxContainerWidthOption = [
  { value: "", label: "Select an option" },
  { value: "1140px", label: "Compact (1140px)" },
  { value: "1680px", label: "Default (1680px)" },
  { value: "1920px", label: "Comfortable (1920px)" },
  // { value: "custom", label: "Custom", },
];

export const themeVerticalSpacingOption = [
  { value: "", label: "Select an option" },
  { value: "48px", label: "Compact (48px)" },
  { value: "60px", label: "Default (60px)" },
  { value: "80px", label: "Comfortable (80px)" },
];
export const BannerType = [
  { value: "type1", label: "Type 1" },
  { value: "type2", label: "Type 2" },
  { value: "type3", label: "Type 3" },
  { value: "type4", label: "Type 4" },
];
export const ViewOptions = [
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" },
];

export const contentThemeSettingAttributeDate = [
  {
    id: "font",
    label: "Font",
    components: {
      font_style: {
        name: "--tw-theme-body-font",
      },
      font_size: {
        name: "--tw-theme-body-font-size",
      },
      font_weight: {
        name: "--tw-theme-body-font-weight",
      },
      font_letter_spacing: {
        name: "--tw-theme-body-font-letter-spacing",
      },
      background_color: {
        name: "--tw-theme-font-color",
      },
    },
  },
  {
    id: "spacing",
    label: "Spacing",
    components: {
      max_container_width: {
        name: "--tw-theme-spcing-max-container-width",
      },
      vertical_spacing: {
        name: "--tw-theme-spcing-vertical_spacing",
      },
    },
  },
  {
    id: "text",
    label: "Text",
    sub_attributes: [
      {
        id: "title_font",
        label: "Title Font",
        components: {
          font_style: {
            name: "--tw-theme-title-font",
          },
          font_size: {
            name: "--tw-theme-title-font-size",
          },
          font_weight: {
            name: "--tw-theme-title-font-weight",
          },
          font_letter_spacing: {
            name: "--tw-theme-title-font-letter-spacing",
          },
        },
      },
      {
        id: "sub_title_font",
        label: "Sub Title Font",
        components: {
          font_style: {
            name: "--tw-theme-sub-title-font",
          },
          font_size: {
            name: "--tw-theme-sub-title-font-size",
          },
          font_weight: {
            name: "--tw-theme-sub-title-font-weight",
          },
          font_letter_spacing: {
            name: "--tw-theme-sub-title-font-letter-spacing",
          },
        },
      },
      {
        id: "small_title_font",
        label: "Small Title Font",
        components: {
          font_style: {
            name: "--tw-theme-small-title-font",
          },
          font_size: {
            name: "--tw-theme-small-title-font-size",
          },
          font_weight: {
            name: "--tw-theme-small-title-font-weight",
          },
          font_letter_spacing: {
            name: "--tw-theme-small-title-font-letter-spacing",
          },
        },
      },
    ],
  },
  {
    id: "buttons",
    label: "Buttons",
    sub_attributes: [
      {
        id: "primary",
        label: "Primary",
        sub_attributes: [
          {
            id: "btn_primary_text",
            label: "Text",
            components: {
              background_color: {
                name: "--tw-theme-btn-primary-text-color",
              },
            },
          },
          {
            id: "btn_primary_background",
            label: "Background",
            components: {
              background_color: {
                name: "--tw-theme-btn-primary-color",
              },
            },
          },
          {
            id: "btn_primary_border",
            label: "Border",
            components: {
              font_size: {
                name: "--tw-theme-btn-primary-border-width",
              },
            },
          },
          {
            id: "btn_primary_corner",
            label: "Corner",
            components: {
              font_size: {
                name: "--tw-theme-btn-primary-border-radius",
              },
            },
          },
          {
            id: "btn_primary_hover",
            label: "Hover",
            sub_attributes: [
              {
                id: "btn_primary_hover_text",
                label: "Text",
                components: {
                  background_color: {
                    name: "--tw-theme-btn-primary-hover-text-color",
                  },
                },
              },
              {
                id: "btn_primary_hover_background",
                label: "Background",
                components: {
                  background_color: {
                    name: "--tw-theme-btn-primary-hover-color",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        id: "secondary",
        label: "Secondary",
        sub_attributes: [
          {
            id: "btn_secondary_text",
            label: "Text",
            components: {
              background_color: {
                name: "--tw-theme-btn-secondary-text-color",
              },
            },
          },
          {
            id: "btn_secondary_background",
            label: "Background",
            components: {
              background_color: {
                name: "--tw-theme-btn-secondary-color",
              },
            },
          },
          {
            id: "btn_secondary_border",
            label: "Border",
            components: {
              font_size: {
                name: "--tw-theme-btn-secondary-border-width",
              },
            },
          },
          {
            id: "btn_secondary_corner",
            label: "Corner",
            components: {
              font_size: {
                name: "--tw-theme-btn-secondary-border-radius",
              },
            },
          },
          {
            id: "btn_secondary_hover",
            label: "Hover",
            sub_attributes: [
              {
                id: "btn_secondary_hover_text",
                label: "Text",
                components: {
                  background_color: {
                    name: "--tw-theme-btn-secondary-hover-text-color",
                  },
                },
              },
              {
                id: "btn_secondary_hover_background",
                label: "Background",
                components: {
                  background_color: {
                    name: "--tw-theme-btn-secondary-hover-color",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "link",
    label: "Link",
    components: {
      'background_color': {
        name: '--tw-theme-link-color',
        value: '#000000'
      }
    }
  }


];

export const iconLibrary = {
  fontawesome: [],
  googlematerial: ["search", "edit", "delete", "home", "settings"]
};

export const storeSettingProductPageDate = [
  {
    id: "ProductGalleryOption",
    label: "Product Gallery Option",
    components: [
      {
        Component: "ProductGallerySlideStyle",
        name: "prodOpt_SlideStyle",
      },
      {
        Component: "ToggleButton",
        name: "prodOpt_thumbnailSlider",
        title: "Thumbnail Slider",
      },
      {
        Component: "ToggleButton",
        name: "prodOpt_productZoom",
        title: "Product Zoom",
      },
      {
        Component: "ToggleButton",
        name: "prodOpt_productSticky",
        title: "Product Sticky",
      },
    ],
  },
  {
    id: "ProductInformation",
    label: "Product Information",
    components: [
      {
        Component: "ToggleButton",
        name: "prodInfo_productTitle",
        title: "Product Title",
      },
      {
        Component: "Dropdown",
        name: "prodInfo_productTitleFontSize",
        title: "Font Size",
        options: FontSizeOptionDetailPage,
        conditionalRender: "prodInfo_productTitle",
      },
      {
        Component: "Dropdown",
        name: "prodInfo_productTitleTextStyle",
        title: "Text Style",
        options: TextStyleSizeOptionDetailPage,
        conditionalRender: "prodInfo_productTitle",
      },
      {
        Component: "ToggleButton",
        name: "prodInfo_productprice",
        title: "Product Price",
      },
      {
        Component: "ToggleButton",
        name: "prodInfo_productVarient",
        title: "Product Varient",
      },
      {
        Component: "RadioButtonGroup",
        name: "prodInfo_productVarientType",
        options: ViewOptions,
        conditionalRender: "prodInfo_productVarient",
      },
      {
        Component: "ToggleButton",
        name: "prodInfo_shortDescription",
        title: "Shot Description",
      },
      {
        Component: "Dropdown",
        name: "prodInfo_shortDescriptionFontSize",
        title: "Font Size",
        options: FontSizeOptionDetailPage,
        conditionalRender: "prodInfo_shortDescription",
      },
      {
        Component: "Dropdown",
        name: "prodInfo_shortDescriptionTextStyle",
        title: "Text Style",
        options: TextStyleSizeOptionDetailPage,
        conditionalRender: "prodInfo_shortDescription",
      },
      {
        Component: "ToggleButton",
        name: "prodInfo_productRating",
        title: "Product Rating",
      },
      {
        Component: "ToggleButton",
        name: "prodInfo_availability",
        title: "Availablity",
      },
      {
        Component: "ToggleButton",
        name: "prodInfo_addToCart",
        title: "Add to Cart Button",
      },
      {
        Component: "AddToCartButton",
        name: "prodInfo_addToCartButton",
        conditionalRender: "prodInfo_addToCart",
      },
      {
        Component: "ToggleButton",
        name: "prodInfo_accordion",
        title: "Product Accordion",
      },
      {
        Component: "Dropdown",
        name: "prodInfo_accordionFontSize",
        title: "Accordion Title Font Size",
        options: FontSizeOptionDetailPage,
        conditionalRender: "prodInfo_accordion",
      },
      {
        Component: "Dropdown",
        name: "prodInfo_accordionTextStyle",
        title: "Accordion Title Text style",
        options: TextStyleSizeOptionDetailPage,
        conditionalRender: "prodInfo_accordion",
      },
    ],
  },
  {
    id: "ProductSectionDisplay",
    label: "Product Section Display",
    components: [
      {
        Component: "ColumnSelect",
        name: "prodSecDisp_columnSelect",
      },
      {
        Component: "Alignment",
        name: "prodSecDisp_alignment",
        title: "Alignment",
      },
      {
        Component: "ToggleButton",
        name: "prodSecDisp_brand",
        title: "Brand",
      },
      {
        Component: "ToggleButton",
        name: "prodSecDisp_productName",
        title: "Product Name",
      },
      {
        Component: "Dropdown",
        name: "prodSecDisp_productNameFontSize",
        title: "Font Size",
        options: FontSizeOptionDetailPage,
        conditionalRender: "prodSecDisp_productName",
      },
      {
        Component: "Dropdown",
        name: "prodSecDisp_productNameTextStyle",
        title: "Text Style",
        options: TextStyleSizeOptionDetailPage,
        conditionalRender: "prodSecDisp_productName",
      },
      {
        Component: "ColorPicker",
        name: "prodSecDisp_productNameColor",
        title: "Color",
        conditionalRender: "prodSecDisp_productName",
      },
      {
        Component: "ToggleButton",
        name: "prodSecDisp_price",
        title: "Price",
      },
      {
        Component: "ToggleButton",
        name: "prodSecDisp_color",
        title: "Color",
      },
      {
        Component: "Dropdown",
        name: "prodSecDisp_colorViewOptions",
        title: "View Options",
        options: ViewOptions,
        conditionalRender: "prodSecDisp_colorViewOptions",
      },
      {
        Component: "ToggleButton",
        name: "prodSecDisp_shortDescription",
        title: "Shot Description",
      },
      {
        Component: "Dropdown",
        name: "prodSecDisp_shortDescriptionFontSize",
        title: "Font Size",
        options: FontSizeOptionDetailPage,
        conditionalRender: "prodSecDisp_shortDescription",
      },
      {
        Component: "Dropdown",
        name: "prodSecDisp_shortDescriptionTextStyle",
        title: "Text Style",
        options: TextStyleSizeOptionDetailPage,
        conditionalRender: "prodSecDisp_shortDescription",
      },
      {
        Component: "ToggleButton",
        name: "prodSecDisp_productRating",
        title: "Product Rating",
      },
      {
        Component: "ToggleButton",
        name: "prodSecDisp_availability",
        title: "Availablity",
      },
      {
        Component: "ToggleButton",
        name: "prodSecDisp_addToCartButton",
        title: "Add to Cart Button",
      },
      {
        Component: "ToggleButton",
        name: "prodSecDisp_tags",
        title: "Tags",
      },
      {
        Component: "Dropdown",
        name: "prodSecDisp_tagsWishlist",
        title: "Wishlist",
        options: WishlistOption,
        conditionalRender: "prodSecDisp_tags",
      },
      {
        Component: "Dropdown",
        name: "prodSecDisp_tagsSaleNewArrivalHot",
        title: "Sale / New Arrival / Hot",
        options: WishlistOption,
        conditionalRender: "prodSecDisp_tags",
      },
    ],
  },
];

export const storeCategoryListProperty = [
  {
    id: "promotionalText1",
    label: "Promotional Text 1",
    components: [
      {
        Component: "CKEditor",
        name: "promotionalText1",
      },
    ],
  },
  {
    id: "BannerSection",
    label: "Banner Section",
    components: [
      {
        Component: "RadioButtonGroup",
        name: "bannertype",
        options: BannerType,
      },
    ],
  },
  {
    id: "promotionalText2",
    label: "Promotional Text 2",
    components: [
      {
        Component: "CKEditor",
        name: "promotionalText2",
      },
    ],
  },
  {
    id: "categoryListingOptions",
    label: "Category Listing Options",
    components: [
      {
        Component: "ColumnSelect",
        name: "categoryListOpt_columnSelect",
      },
      {
        Component: "Dropdown",
        name: "categoryListOpt_titleFontSize",
        title: "Select Title Text Size",
        options: FontSizeOptionDetailPage,
      },
      {
        Component: "ColorPicker",
        name: "categoryListOpt_TextColor",
        title: "Select Title Text color",
      },
      // {
      //   Component: "ToggleButton",
      //   name: "categoryListOpt_backgroundOverlay",
      //   title: "Background Overlay Color",
      // },
      // {
      //   Component: "ColorPicker",
      //   name: "categoryListOpt_backgroundOverlayColor",
      //   title: "Select Background Overlay color",
      //   conditionalRender: "categoryListOpt_backgroundOverlay",
      // },
      // {
      //   Component: "VerticalAlign",
      //   name: "categoryListOpt_textVerticalAlign",
      //   title: "Title Text Vertical Align",
      // },
      {
        Component: "Alignment",
        name: "categoryListOpt_texthorizontalAlign",
        title: "Title Text Horizontal Align",
      },
    ],
  },
];
export const storeProductListProperty = [
  {
    id: "promotionalText1",
    label: "Promotional Text 1",
    components: [
      {
        Component: "CKEditor",
        name: "promotionalText1",
      },
    ],
  },
  {
    id: "BannerSection",
    label: "Banner Section",
    components: [
      {
        Component: "RadioButtonGroup",
        name: "bannertype",
        options: BannerType,
      },
    ],
  },
  {
    id: "promotionalText2",
    label: "Promotional Text 2",
    components: [
      {
        Component: "CKEditor",
        name: "promotionalText2",
      },
    ],
  },
  {
    id: "filters",
    label: "Filter",
    components: [
      {
        Component: "RadioButtonGroup",
        name: "filter",
        options: [
          { value: "none", label: "None" },
          { value: "floyout", label: "Floyout" },
          { value: "leftSide", label: "Left Side" },
        ],
      },
      {
        Component: "LeftRight",
        name: "floyout_alignment",
        title: "flyout Alignment",
        conditionalRender: 'filter',
        conditionalValue: 'floyout'

      },
    ],
  },

  {
    id: "productListingOptions",
    label: "Product Listing Options",
    components: [
      {
        Component: "ColumnSelect",
        name: "productListOpt_columnSelect",
      },
      {
        Component: "Alignment",
        name: "productListOpt_alignment",
        title: "Alignment",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_availability",
        title: "Availablity",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_brand",
        title: "Brand",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_personalize",
        title: "Personalize",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_productName",
        title: "Product Name",
      },
      {
        Component: "Dropdown",
        name: "productListOpt_productNameFontSize",
        title: "Font Size",
        options: FontSizeOptionDetailPage,
        conditionalRender: "productListOpt_productName",
      },
      {
        Component: "Dropdown",
        name: "productListOpt_productNameTextStyle",
        title: "Text Style",
        options: TextStyleSizeOptionDetailPage,
        conditionalRender: "productListOpt_productName",
        isMulti: true,
      },
      {
        Component: "ColorPicker",
        name: "productListOpt_productNameColor",
        title: "Color",
        conditionalRender: "productListOpt_productName",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_price",
        title: "Price",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_compare",
        title: "Compare",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_color",
        title: "Color",
      },
      {
        Component: "Dropdown",
        name: "productListOpt_colorViewOptions",
        title: "View Options",
        options: ViewOptions,
        conditionalRender: "productListOpt_color",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_addToCartButton",
        title: "Add to Cart Button",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_tags",
        title: "Tags",
      },
      {
        Component: "Dropdown",
        name: "productListOpt_tagsWishlist",
        title: "Wishlist",
        options: WishlistOption,
        conditionalRender: "productListOpt_tags",
      },
      {
        Component: "Dropdown",
        name: "tagsSaleNewArrivalHot",
        title: "Sale / New Arrival / Hot",
        options: WishlistOption,
        conditionalRender: "productListOpt_tags",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_productCount",
        title: "Product Count",
      },
      {
        Component: "ToggleButton",
        name: "productListOpt_ShortDesc",
        title: "Short Description",
      },
      {
        Component: "Input",
        name: "productListOpt_viewMoreButton",
        title: "View more button Text",
        defaultValue: "View More",
      },

    ],
  },
];

export const MasterProductStatusTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "All",
    filter: [],
  },
  {
    id: 1,
    label: "Active",
    value: "Active",
    componentname: "Active",
    filter: [
      {
        field: "recStatus",
        operator: 0,
        value: "A",
      },
    ],
  },
  {
    id: 2,
    label: "Inactive",
    value: "Inactive",
    componentname: "Inactive",
    filter: [
      {
        field: "recStatus",
        operator: 0,
        value: "I",
      },
    ],
  },
  {
    id: 3,
    label: " Draft",
    value: "Draft",
    componentname: "Draft",
    filter: [
      {
        field: "recStatus",
        operator: 0,
        value: "D",
      },
    ],
  },
  {
    id: 4,
    label: "Discontinued",
    value: "Discontinued",
    componentname: "Discontinued",
    filter: [
      {
        field: "isdiscontinue",
        operator: 0,
        value: "true",
      },
    ],
  },
  {
    id: 5,
    label: "Synced with NAV",
    value: "Synced with NAV",
    componentname: "Synced with NAV",
    filter: [
      {
        field: "navSyncStatus",
        operator: 0,
        value: "S",
      },
    ],
  },
  {
    id: 6,
    label: "Resync with NAV",
    value: "ResyncwithNAV",
    componentname: "Resync with NAV",
    filter: [
      {
        field: "navSyncStatus",
        operator: 0,
        value: "R",
      },
    ],
  },
  {
    id: 7,
    label: "NAV Sync Pending",
    value: "NAVSyncPending",
    componentname: "NAV Sync Pending",
    filter: [
      {
        field: "navSyncStatus",
        operator: 0,
        value: "P",
      },
    ],
  },
];

export const GrandMasterProductStatusTabs = [
  {
    id: 0,
    label: "All",
    value: "All",
    componentname: "All",
    filter: [],
    extra: {
      storeDefaultOption: "All",
    },
  },
  {
    id: 1,
    label: "Active",
    value: "Active",
    componentname: "Active",
    filter: [
      {
        field: "recStatus",
        operator: 0,
        value: "A",
      },
    ],
  },
  {
    id: 2,
    label: "Inactive",
    value: "Inactive",
    componentname: "Inactive",
    filter: [
      {
        field: "recStatus",
        operator: 0,
        value: "I",
      },
    ],
  },
  {
    id: 3,
    label: " Draft",
    value: "Draft",
    componentname: "Draft",
    filter: [
      {
        field: "recStatus",
        operator: 0,
        value: "D",
      },
    ],
  },
];

export const productType = {
  General: -3,
  GMC: -2,
  MC: -1,
  Bundle: 0,
  CorporateStore: 1,
  EcommerceStore: 2,
  StoreBuilder: 3
};
export const StoreExportTypes = {
  [productType.GMC]: ['GrandMasterProduct'],
  [productType.MC]: [
    'MasterProductInventoryThirdParty',
    'MasterProductCatelogUPC', //catalog spelling wrong from API side
    'MasterProductCatelogProductColor',
    'MasterProductCatelogPrice',
    'MasterProductCatelogOptionProduct',
    'MasterProductCatelogInventory',
    'MasterProductCatelogFlydate',
    'MasterProductCatelogFacetColor',
    'MasterProductCatelogCompanion',
    'MasterProductCatelogCategory',
    'MasterProductCatelogAltImage',
    'MasterProductCatelog'
  ],
  [productType?.EcommerceStore]: [
    'StoreProductMinQty',
    'StoreProductLogoLocation',
    'StoreProductCompanion',
    'StoreProduct',
    'StoreOptionProduct',
    'QuantityDiscount'
  ],
  [productType?.CorporateStore]: [
    'StoreProductMinQty',
    'StoreProductLogoLocation',
    'StoreProductCompanion',
    'StoreProduct',
    'StoreOptionProduct',
    'QuantityDiscount'
  ],
  [productType?.General]: [
    'QuantityDiscount'
  ]
}
export const pageEditPasswordExpirationTime = [
  { value: "30", label: "30 Days" },
  { value: "60", label: "60 Days" },
  { value: "90", label: "90 Days" },
  { value: "120", label: "120 Days" },
];
export const CompanyId = 1;

export const storeBuilderDashboard = {
  total: 3545,
  active: 654,
  inactive: 987,
};

export const formBuilderDashboard = {
  total: 3545,
  active: 654,
  inactive: 987,
};

export const ContentPageType = {
  Website: "Website",
  Landing: "Landing",
  Blog: "Blog",
};

export const StoreBuilderCreateSteps = [
  { id: 0, step: "01", label: "Setup", component: "setup" },
  { id: 1, step: "02", label: "General", component: "general" },
  { id: 2, step: "03", label: "Payment & Info", component: "paymentInfo" },
  { id: 3, step: "04", label: "Taxes & fees", component: "tax" },
  { id: 4, step: "05", label: "Messages", component: "message" },
  { id: 5, step: "06", label: "Products", component: "product" },
  //{ id: 6, step: "07", label: "Sequence", component: "sequence" },
  { id: 7, step: "07", label: "Category", component: "category" },
];

export const StoreBuilderShippingChargesOptions = [
  { value: 1, label: "Individual" },
  { value: 2, label: "School" },
];

export const StoreBuilderShippingMethodsOptions = [
  { value: "FR", label: "Free Shipping" },
  { value: "FL", label: "Flat Fee" },
  { value: "TR", label: "Tiered Shipping" },
];

export const StorePagesObject = [
  { label: "Category Page", value: "CategoryPage" },
  { label: "Listing Page", value: "ProductListing" },
  { label: "Product Page", value: "productDetail" },
];

export const LandingPagesDropdown = [
  { value: 1, label: "Default Page" },
  { value: 2, label: "Landing Page 1" },
  { value: 3, label: "Landing Page 2" },
  { value: 4, label: "Landing Page 3" },
  { value: 5, label: "Landing Page 4" },
];
export const Orders = [
  {
    orderNo: "#258478",
    items: "05 Items",
    total: "$2401",
    date: "12/24/2021",
    store: "Corporate Gear",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
  {
    orderNo: "#246115",
    items: "01 Items",
    total: "$2652",
    date: "12/24/2021",
    store: "PK Health",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
  {
    orderNo: "#1214481",
    items: "08 Items",
    total: "$3541",
    date: "12/24/2021",
    store: "Corporate Gear",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
  {
    orderNo: "#258478",
    items: "05 Items",
    total: "$2401",
    date: "12/24/2021",
    store: "Corporate Gear",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
  {
    orderNo: "#258478",
    items: "02 Items",
    total: "$1640",
    date: "12/22/2021",
    store: "Peter Millar",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
  {
    orderNo: "#2987521",
    items: "01 Items",
    total: "$1248",
    date: "12/22/2021",
    store: "DI",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
  {
    orderNo: "#315718",
    items: "03 Items",
    total: "$2410",
    date: "12/22/2021",
    store: "Corporate Gear",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
  {
    orderNo: "#258478",
    items: "11 Items",
    total: "$198",
    date: "12/19/2021",
    store: "Gameday Gear",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
  {
    orderNo: "#215411",
    items: "05 Items",
    total: "$2401",
    date: "12/19/2021",
    store: "Corporate Gear",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
  {
    orderNo: "#32141",
    items: "03 Items",
    total: "$3104",
    date: "12/19/2021",
    store: "Corporate Gear",
    printLabel: "Print Slip",
    captureOrder: "Capture",
  },
];

export const OrderStatisticsData = [
  {
    day: "07/01/2022",
    totalOrder: "5",
    subTotal: "16231.00",
    tax: "1314.78",
    shipping: "0.00",
    refund: "0.00",
    discount: "0.00",
    adjAmount: "0.00",
    total: "",
  },
  {
    day: "07/02/2022",
    totalOrder: "1",
    subTotal: "1338.00",
    tax: "120.09",
    shipping: "0.00",
    refund: "0.00",
    discount: "0.00",
    adjAmount: "0.00",
    total: "",
  },
  {
    day: "07/05/2022",
    totalOrder: "1",
    subTotal: "13629.00",
    tax: "1056.25",
    shipping: "0.00",
    refund: "0.00",
    discount: "0.00",
    adjAmount: "0.00",
    total: "",
  },
  {
    day: "07/06/2022",
    totalOrder: "6",
    subTotal: "16430.00",
    tax: "433.06",
    shipping: "0.00",
    refund: "25.00",
    discount: "0.00",
    adjAmount: "0.00",
    total: "",
  },
]

export const SalesSummaryByStoreData = [
  {
    store: "Parsons Kellogg",
    subTotal: "799092.00",
    coupons: "0.00",
    shipping: "0.00",
    tax: "49439.60",
    adjustment: "0.00",
    giftWrap: "0.00",
    total: ""
  },
]

export const RevenueSummaryData = [
  {
    srno: "1",
    month: "Jan",
    totalOrders: "350",
    subTotal: "30761.32",
    tax: "1602.20",
    shipping: "3408.01",
    refund: "203.52",
    discount: "0.00",
    adjAmount: "0.00",
    total: "",
  },
  {
    srno: "2",
    month: "Feb",
    totalOrders: "423",
    subTotal: "34522.25",
    tax: "2044.48",
    shipping: "3588.37",
    refund: "556.06",
    discount: "15.00",
    adjAmount: "0.00",
    total: "",
  },
  {
    srno: "3",
    month: "Mar",
    totalOrders: "621",
    subTotal: "58077.38",
    tax: "2988.98",
    shipping: "5574.47",
    refund: "135.07",
    discount: "0.00",
    adjAmount: "0.00",
    total: "",
  },
  {
    srno: "4",
    month: "Apr",
    totalOrders: "302",
    subTotal: "38604.06",
    tax: "1413.78",
    shipping: "3466.16",
    refund: "146.80",
    discount: "0.00",
    adjAmount: "0.00",
    total: "",
  },
  {
    srno: "5",
    month: "May",
    totalOrders: "196",
    subTotal: "16388.90",
    tax: "1082.94",
    shipping: "2157.55",
    refund: "45.00",
    discount: "0.00",
    adjAmount: "0.00",
    total: "",
  },
  {
    srno: "6",
    month: "Jun",
    totalOrders: "107",
    subTotal: "10574.90",
    tax: "321.13",
    shipping: "1036.76",
    refund: "0.00",
    discount: "79.35",
    adjAmount: "0.00",
    total: "",
  },
  {
    srno: "7",
    month: "Jul",
    totalOrders: "295",
    subTotal: "38764.35",
    tax: "1998.22",
    shipping: "3731.18",
    refund: "667.31",
    discount: "13.35",
    adjAmount: "0.00",
    total: "",
  },
  {
    srno: "8",
    month: "Aug",
    totalOrders: "316",
    subTotal: "52473.46",
    tax: "3540.34",
    shipping: "3478.12",
    refund: "275.87",
    discount: "0.00",
    adjAmount: "0.00",
    total: "",
  },
]

export const MailLogData = [
  {
    fromEmail: "yourorder@corporategear.com",
    toEmail: "olga@ironpointadvisors.com",
    storeName: "Parsons Kellogg",
    subject: "Welcome to Corporate Gear!",
    ipAddress: "111.222.333.444",
    sentOn: "07/16/2022",
    view: "",
    sendMail: "",
    resendMail: ""
  },
  {
    fromEmail: "yourorder@corporategear.com",
    toEmail: "damon.giangrande@setf.com",
    storeName: "Parsons Kellogg",
    subject: "Welcome to Corporate Gear!",
    ipAddress: "111.222.333.444",
    sentOn: "07/16/2022",
    view: "",
    sendMail: "",
    resendMail: ""
  },
]

export const InquirieslistData = [
  {
    name: "Vipul S",
    email: "vipul@redefinecommerce.com",
    subject: "",
    date: "07/16/2022",
    view: "",
    reply: ""
  }
];
export const paymentStatus = [
  { label: 'ARIBA', value: 'ARIBA' },
  { label: 'ARIBA AUTHORIZED', value: 'ARIBA AUTHORIZED' },
  { label: 'Authorized', value: 'Authorized' },
  { label: 'COUPA AUTHORIZED', value: 'COUPA AUTHORIZED' },
  { label: 'CAPTURE', value: 'CAPTURE' },
  { label: 'CAPTURED', value: 'CAPTURED' },
  { label: 'CANCELED', value: 'CANCELED' },
  { label: 'Expired', value: 'E' },
  { label: 'FRAUD', value: 'FRAUD' },
  { label: 'PENDING', value: 'PENDING' },

  // { label: 'Overdue', value: 'overdue' },
  // { label: 'Paid', value: 'paid' },
  // { label: 'Partially paid', value: 'partiallyPaid' },
  // { label: 'Partially refunded', value: 'partiallyRefunded' },
  // { label: 'Refunded', value: 'refunded' },
  // { label: 'Unpaid', value: 'unpaid' },
  // { label: 'Voided', value: 'voided' },
];
export const orderStatus = [
  { label: 'Canceled', value: 'Canceled' },
  { label: 'New', value: 'New' },
  { label: 'Authorized', value: 'Authorized' },
  { label: 'Partially Shipped', value: 'Partially Shipped' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Shipped', value: 'Shipped' },
];

export const storeBuildernavlocationcodeOptions = [
  { value: 'GPK', label: "GPK" },
  { value: 'GDEC', label: "GDEC" },
];



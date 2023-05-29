/*Component Name: VendorSKUMapping
Component Functional Details: User can create or update VendorSKUMapping master details from here.
Created By: chandan
Created Date: 27-06-2022
Modified By: chandan
Modified Date: 27-06-2022 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Formik, Form as FormikForm, useFormikContext } from "formik";
import Input from "components/common/formComponent/Input";
import ReactTable from "components/common/table/ReactTableServerSide";
import { paginationDetails } from "global/Enum";
import { productType } from "dummy/Dummy";
import DropdownService from "services/common/dropdown/DropdownService";
import Dropdown from "components/common/formComponent/Dropdown";
import Select from "components/common/formComponent/Select";
import { NavLink, useParams } from "react-router-dom";
import CheckBox from "components/common/table/CheckBox";
import MasterProductService from "services/admin/masterCatalog/masterCatalog/products/VendorSKUMapping";
import GrandMasterVendorSKUMapping from "services/admin/masterCatalog/grandMaster/products/VendorSKUMapping";
import StoreProductService from "services/admin/masterCatalog/store/product/VendorSKUMapping";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import * as Yup from "yup";
import MasterAttributeCombinationService from "services/admin/masterCatalog/masterCatalog/products/attribute/AttributeCombinationService";
import GrandMasterAttributeCombinationService from "services/admin/masterCatalog/grandMaster/products/attribute/AttributeCombinationService";
import StoreAttributeCombinationService from "services/admin/masterCatalog/store/product/attribute/AttributeCombinationService";
import { ValidationMsgs } from "global/ValidationMessages";
import MasterVendorSKUMappingService from "services/admin/masterCatalog/masterCatalog/VendorSKUMappingService";
import GrandMasterVendorSKUMappingService from "services/admin/masterCatalog/grandMaster/products/VendorSKUMapping";
import StoreVendorSKUMappingService from "services/admin/masterCatalog/store/product/VendorSKUMapping";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import UnsavedFormHandler from "../UnsavedFormHandler";
import ErrorHandler from "../ErrorHandler";
import { useMemo } from "react";

const VendorSKUMapping = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  type,
  setFormSubmit,
  setIsError,
  activeTab,
  index,
  setModalInfo,
  setOpenBasicModal,
  requiredFields,
  checkProductStatus,
  productstatusVal,
  readOnly,
  listLink,
  displayView = false,
  getProductReadinessData,
  getValidationForAllFilledFieldsFunc,
  setsaveUnSavedFields,
  setWishedToChangeTab,
  clearCacheForBrandCategory,
  ...rest
}) => {
  const permission = useSelector(store => store.permission);
  const API = (type == productType.MC ? MasterProductService : (type == productType.GMC ? GrandMasterVendorSKUMapping : (StoreProductService)));
  const CombinationAPI = (type == productType.MC ? MasterAttributeCombinationService : type == productType.GMC ? GrandMasterAttributeCombinationService : StoreAttributeCombinationService)
  const VendorSKUMappingAPI = (type == productType.MC ? MasterVendorSKUMappingService : (type == productType.GMC ? GrandMasterVendorSKUMappingService : StoreVendorSKUMappingService))

  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useSelector(store => store.location);
  const [Data, setData] = useState([]);
  const formRef = useRef();
  const [initialValues, setInitialValues] = useState({});
  const [vendorOptions, setVendorOptions] = useState([]);
  const [VendorsForAdd, setVendorsForAdd] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [filterVendor, setFilterVendor] = useState("0");
  const [AttributeCombinations, setAttributeCombinations] = useState([]);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  useEffect(() => {
    CombinationAPI.getAttributeCombinationByID(id).then((response) => {
      if (response.data.success) {
        setAttributeCombinations(response.data.data);
      }
    })
      .catch((errors) => { });
  }, []);

  const COLUMNS = useMemo(() => [
    {
      id: "vendorName",
      Header: "Vendor / Product Name",
      accessor: "vendorName",
      column_name: "vendorName",
      disableSortBy: true
    },
    {
      id: "vendorSKU",
      Header: "Vendor SKU",
      accessor: "vendorSKU",
      column_name: "vendorSKU",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return (
          (row?.original?.subRows && row?.original?.subRows.length > 0) ?
            <VendorSKU readOnly={readOnly} filterVendor={filterVendor} row={row} value={value} /> : ''
        );
      },
    },
    {
      id: "referenceName",
      Header: "Reference Name",
      accessor: "referenceName",
      column_name: "referenceName",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return (

          (row?.original?.subRows && row?.original?.subRows.length > 0) ? <div className="text-left w-40 flex">
            {readOnly || filterVendor === '0' ? value : <Input
              name={`productVendorSKUMAppingModel.${row.original.id}.referenceName`}
              className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
              type="text"
              disabled={readOnly}
            />}
          </div> : ''

        )
      },
    },
    {
      id: "ourSUBSKU",
      Header: "Our SUB SKU",
      accessor: "ourSUBSKU",
      column_name: "ourSUBSKU",
      disableSortBy: true
      /* Cell: ({ value, row }) => {
        return (
          (!row.original?.subRows || row?.original?.subRows <= 0) ? <div className="font-semibold text-left w-40 flex">
            {readOnly ? value : <Input
              name={`products.${row.original.id}.ourSUBSKU`}
              className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
              type="text"
            />}
          </div> : ''
        );
      }, */
    },
    {
      id: "mpn",
      Header: "MPN",
      accessor: "mpn",
      column_name: "mpn",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return (
          (!row.original.subRows || row.original.subRows <= 0) ? <div className="text-left w-40 flex">
            {readOnly || filterVendor === '0' ? value : <Input
              name={`productVendorSKUMAppingModel.${row.original.vendorSKUMAppingId}.productVendorSKUMAppingDetailModels.${row.original.ourSUBSKU}.mpn`}
              className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
              type="text"
              disabled={readOnly}
            />}
          </div> : ''
        );
      },
    },
    {
      id: "defaultVendor",
      Header: "DEFAULT VENDOR",
      accessor: "isDefaultVendor",
      column_name: "defaultVendor",
      disableSortBy: true,
      Cell: ({ value, row }) => {
        return (
          (row?.original?.subRows && row?.original?.subRows.length > 0) ? <DefaultVendor value={value} row={row} disabled={readOnly || filterVendor === '0'} /> : ''
        );
      }
    },
  ], [filterVendor, readOnly]);
  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "name",
      direction: 0,
      priority: 0,
    },
  ]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    ...paginationDetails,
  });
  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const setSortingOptionHandler = (column, direction) => {
    setSortingOptions([
      {
        field: column,
        direction: direction,
        priority: 0,
      },
    ]);
  };

  const getVendorSKUData = useCallback(
    (pageIndex) => {
      dispatch(setAddLoading(true))

      API.getVendorSKUMappingData({
        args: {
          pageSize: 9999999,
          pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
        productId: id
      }).then((response) => {
        setData(response.data.data.items);
        setPaginationData((prevState) => ({
          ...prevState,
          pageIndex: response.data.data.pageIndex,
          pageSize: response.data.data.pageSize,
          totalCount: response.data.data.totalCount,
          totalPages: response.data.data.totalPages,
          hasPreviousPage: response.data.data.hasPreviousPage,
          hasNextPage: response.data.data.hasNextPage,
        }));
        // let selectedVendor = response.data.data.items.map((value, index) => {
        //   return { label: value.vendorName, value: value.vendorId }
        // });
        // if (selectedVendor.length > 0) {
        //   setSelectedVendors([{ label: "All Vendors", value: "0" }, ...selectedVendor]);
        // }
        dispatch(setAddLoading(false))

      }).catch(() => {
        dispatch(setAddLoading(false))

      });
    },
    [
      filteringOptions,
      paginationData.pageSize,
      sortingOptions,
      paginationData.pageIndex,
    ]
  );
  const getSelectedVEndorList = useCallback(() => {
    VendorSKUMappingAPI.getVendorListByProductId(id).then((response) => {
      if (response.data.data) {
        let selectedVendor = response.data.data.map((value, index) => {
          return { label: value.vendorName, value: value.id }
        });
        if (selectedVendor.length > 0) {
          setSelectedVendors([{ label: "All Vendors", value: "0" }, ...selectedVendor]);
        }
      }
    }).catch(() => { });
  }, [])

  useEffect(() => {
    DropdownService.getDropdownValues("vendor").then((res) => {
      if (res.data.success) {
        setVendorOptions(res.data.data);
      }
    });
  }, []);
  useEffect(() => {
    if (activeTab === index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab, index, AttributeCombinations]);

  useEffect(() => {
    let temp = {};
    Data.map((value, index) => {
      let tempVendor = { ...value };
      let products = {};
      if (tempVendor.subRows && tempVendor.subRows.length > 0) {
        tempVendor.subRows.map((product, index) => {
          products = { ...products, [product.ourSUBSKU]: { ...product } }
          return '';
        });
      }
      delete tempVendor['subRows']
      temp = {
        ...temp, [value.id]: {
          ...tempVendor, productVendorSKUMAppingDetailModels: products
        }
      };
      return '';
    });
    setInitialValues({ productVendorSKUMAppingModel: temp })
  }, [Data]);

  // set Vendors dropdown options
  useEffect(() => {
    setVendorsForAdd(prev => {
      var tempVendors = [];
      selectedVendors.map((value, index) => {
        if (value.value) {
          tempVendors = [...tempVendors, value.value.toString()];
        }
        return ""
      });
      return vendorOptions.filter((value, index) => {
        return !tempVendors.includes(value.value.toString());
      })
    })

  }, [selectedVendors, vendorOptions]);

  const onSubmit = (fields, { resetForm }) => {
    if (readOnly || filterVendor === '0') {
      return;
    }
    dispatch(setAddLoading(true))

    let data = fields.productVendorSKUMAppingModel
    let finalData = Object.keys(data).map((key, index) => {
      let subRows = data[key].productVendorSKUMAppingDetailModels;
      return {
        id: data[key].id,
        rowVersion: data[key].rowVersion,
        recStatus: "A",
        vendorId: data[key].vendorId,
        productId: data[key].productId,
        vendorSKU: data[key].vendorSKU,
        referenceName: data[key].referenceName,
        isDefaultVendor: data[key].isDefaultVendor,
        productVendorSKUMAppingDetailModels: typeof subRows === 'object' ? Object.keys(subRows).map((key1, index) => {
          return {
            id: subRows[key1].id,
            vendorSKUMAppingId: subRows[key1].vendorSKUMAppingId,
            ourSUBSKU: subRows[key1].ourSUBSKU,
            mpn: subRows[key1].mpn,
            rowVersion: subRows[key1].rowVersion,
            recStatus: "A"
          };
        }) : [],
        ...location,
      }
    });

    API.createUpdateVendorSKU({ productVendorSKUMAppingModel: finalData })
      .then((response) => {
        if (response.data.success && response.data.data) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.masterCatalog.vendorSKU.updated,
            })
          );
          getVendorSKUData();
          getProductReadinessData();
          clearCacheForBrandCategory()
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))
        }
        // getValidationForAllFilledFieldsFunc()
      }).catch((errors) => {
        dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.masterCatalog.vendorSKU.notUpdated }));
        dispatch(setAddLoading(false))
      });
  };

  const validationSchema = Yup.object({
    vendorId: Yup.string().required(ValidationMsgs.common.vendorIdRequired),
  });
  const saveVendors = (fields, { resetForm }) => {
    dispatch(setAddLoading(true))

    API.addVendorSKU({
      productVendorSKUMAppingModel: [
        {
          ...fields,
          ...location
        }
      ]
    }).then((response) => {
      if (response.data.success && response.data.data) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.masterCatalog.vendorSKU.added,
          })
        );
        getVendorSKUData();
        getSelectedVEndorList();
        getProductReadinessData();
        clearCacheForBrandCategory();
        resetForm({});
      } else {
        dispatch(
          setAlertMessage({ type: "danger", message: serverError(response) })
        );
        dispatch(setAddLoading(false))
      }
      // getValidationForAllFilledFieldsFunc()
    }).catch((errors) => {
      dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.masterCatalog.vendorSKU.notAdded }));
      dispatch(setAddLoading(false))
    });
  };

  useEffect(() => {
    setWishedToChangeTab(false)
  }, []);

  useEffect(() => {
    getVendorSKUData();
    getSelectedVEndorList();
  }, [activeTab])
  return (
    <>{
      AttributeCombinations.length <= 0 ?
        <div className="py-5">
          <div className="flex flex-wrap uppercase font-bold text-sm ml-8 text-rose-500">
            <span className="text-rose-500 text-2xl leading-none">*</span>Please Create Attribute Combination First.</div>
        </div> :
        <div className="panel-25 tab-content">
          {/* <!-- Vendor SKU Mapping start -->  */}
          {!displayView && <div className="mt-5">
            {!readOnly && <div className="flex items-center justify-end gap-4 px-6">
              {(permission?.isEdit || permission?.isDelete) && <NavLink to={`/admin/MasterCatalog/MasterCatalog/vendorSKU/import/${id}`} className="text-indigo-500 hover:text-indigo-600 cursor-pointer">
                Import
              </NavLink>}
              <NavLink to={`/admin/MasterCatalog/MasterCatalog/vendorSKU/export/${id}`} className="text-indigo-500 hover:text-indigo-600 cursor-pointer">
                Export
              </NavLink>
            </div>}
            <Formik
              enableReinitialize={true}
              initialValues={{
                id: 0,
                rowVersion: "",
                recStatus: "A",
                vendorId: '',
                productId: id,
                isDefaultVendor: false
              }}
              onSubmit={saveVendors}
              validationSchema={validationSchema}
            >
              {({ setFieldValue, errors, values }) => {
                return (
                  <FormikForm>
                    <div className="flex gap-4 px-7 pt-5">
                      <Dropdown
                        label="vendorId"
                        name="vendorId"
                        className={`w-full`}
                        placeholder="Select Vendors"
                        options={VendorsForAdd}
                        defaultValue={values.vendorId}
                        isDisabled={readOnly}
                      />
                      {(!readOnly && (permission?.isEdit || permission?.isDelete)) && <button disabled={GlobalLoading} type="submit" className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white">Add</button>}
                      <VendorSkuDropDown setData={setData} selectedVendors={selectedVendors} setColumnFilteringOptions={setColumnFilteringOptions} setFilterVendor={setFilterVendor} filterVendor={filterVendor} />
                    </div>
                  </FormikForm>
                );
              }}
            </Formik>
          </div>}

          <Formik
            enableReinitialize={true}
            initialValues={{
              ...initialValues
            }}
            onSubmit={onSubmit}
            innerRef={formRef}
          >
            {({ setFieldValue, errors, values }) => {
              return (
                <FormikForm>
                  <ErrorHandler setIsError={setIsError} errors={errors} checkProductStatus={checkProductStatus} />
                  <UnsavedFormHandler values={values} setsaveUnSavedFields={setsaveUnSavedFields} InitialData={initialValues} />

                  <ReactTable
                    COLUMNS={COLUMNS}
                    DATA={Data}
                    {...paginationData}
                    setTablePageSize={(value) =>
                      setPaginationDataFunc("pageSize", value)
                    }
                    totalCount={0}
                    fetchData={getVendorSKUData}
                    sortingOptions={sortingOptions}
                    setSortingOptions={setSortingOptionHandler}
                    setColumnFilteringOptions={setColumnFilteringOptions}
                    expandedRows={true}
                    hiddenColumns={['rowSelection']}
                    displaySearch={false}
                    tablePadding={''}

                  />
                </FormikForm>
              );
            }}

          </Formik>
        </div>
    }
    </>
  );
};

export default VendorSKUMapping;

const VendorSkuDropDown = ({ setData, selectedVendors, setColumnFilteringOptions, setFilterVendor, filterVendor }) => {

  useEffect(() => {
    if (filterVendor !== '0') {
      setColumnFilteringOptions([{
        field: 'vendorId',
        operation: 0,
        value: filterVendor
      }]);
    } else {
      setColumnFilteringOptions([]);
    }

  }, [filterVendor]);

  return (
    <div >
      <Select
        label="filterVendorId"
        onChange={(e) => {
          if (e) {
            setFilterVendor(
              e.value
            );
          }
          else {
            setFilterVendor("");
          }
        }}
        defaultValue={filterVendor}
        name="filterVendorId"
        options={selectedVendors}
        className={'w-48'}
        isClearable={false}
      />
    </div>
  );
};

const DefaultVendor = ({ value, row, disabled }) => {
  const { values, setFieldValue } = useFormikContext();
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    setIsChecked(() => {
      if (values?.productVendorSKUMAppingModel[row.original.id] !== undefined && values?.productVendorSKUMAppingModel[row.original.id]?.isDefaultVendor) {
        return true;
      } else {
        return false;
      }
    })
  }, [values?.productVendorSKUMAppingModel[row.original.id]?.isDefaultVendor]);
  return (
    <CheckBox name={`vendors[${row.original.id}].defaultVendor`} {...row.getToggleRowSelectedProps()} onChange={(e) => { setFieldValue(`productVendorSKUMAppingModel[${row.original.id}].isDefaultVendor`, e.target.checked) }} checked={isChecked} disabled={disabled} />
  );
}

const VendorSKU = ({ readOnly, filterVendor, row, value }) => {
  return (
    <div className="text-left w-40 flex">
      {readOnly || filterVendor === '0' ? value : <Input
        name={`productVendorSKUMAppingModel.${row?.original?.id}.vendorSKU`}
        className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
        type="text"
        disabled={readOnly}
      />}
    </div>
  )
}


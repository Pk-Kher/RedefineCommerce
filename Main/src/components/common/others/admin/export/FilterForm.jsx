/*Component Name: FilterForm
Component Functional Details:  FilterForm .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useEffect, useMemo, Fragment, useCallback } from 'react';
import { useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'components/common/formComponent/Dropdown';
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { exportTabs, RecStatusValuebyName, RecStatusValueForForm } from "global/Enum"
import ImportExportService from 'services/admin/masterCatalog/masterCatalog/products/ImportExportService';
import { productType } from "dummy/Dummy";
import { useParams } from "react-router-dom";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import BrandService from "services/admin/brand/BrandService";
import VendorService from "services/admin/vendor/VendorService";
import StoreBrandService from "services/admin/masterCatalog/store/brand/BrandService"

const FilterForm = ({ type, setAllExpData, getExportdbFields, setParentExportType }) => {
    const { values, setFieldValue } = useFormikContext();
    const [brands, setBrands] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [exportType, setExportType] = useState([]);
    const { storeId } = useParams();
    const dispatch = useDispatch();
    const getBrandOptions = (vendorId = [0]) => {
        if (![productType.EcommerceStore, productType.CorporateStore].includes(type) && !storeId) {

            BrandService.getMultipleVendorsWiseBrandForMaster({ vendorIds: vendorId }).then((res) => {
                if (res?.data?.success && res?.data?.data) {
                    setBrands(res?.data?.data);
                }
            }).catch(() => { });
        }
        else if (storeId) {
            StoreBrandService.getBrandsByVendors({ storeId: storeId, vendorIds: vendorId }).then((res) => {
                if (res.data.success) {
                    setBrands(res.data.data);
                }
            });
        }
    }
    const getVendorsOptions = (brandIds = [], selectedVendorOptions = [], setFieldValue) => {
        let API = ![productType.EcommerceStore, productType.CorporateStore].includes(type) ? VendorService.getMultipleVendorsBrandWiseForMaster : VendorService.getMultipleVendorsBrandWiseForStore;

        if (brandIds.length > 0) {
            dispatch(setAddLoading(true));
            API({ storeId: (storeId || 0), brandIds: brandIds })
                .then((res) => {
                    if (res?.data?.success && res?.data?.data) {
                        setVendors(res.data.data);
                        //to remove vendor that not associate with brands
                        if (selectedVendorOptions.length > 0 && setFieldValue instanceof Function) {
                            let optionsValues = res?.data?.data?.map((value) => value?.value);
                            setFieldValue('vendor', selectedVendorOptions.filter(value => optionsValues.includes(value)));
                        }
                    }
                    dispatch(setAddLoading(false));
                }).catch(() => {
                    dispatch(setAddLoading(false));
                });
        } else {
            setVendors([]);
        }
    }
    useEffect(() => {
        getBrandOptions();
        getVendorsOptions();

        if (type !== undefined) {
            ImportExportService.getExportTypes(type, true).then((response) => {
                let options = []
                const res = response.data.data;
                if (res && res.length > 0) {
                    res.map((data, index) => {
                        options = [...options, { label: data.tableName, value: data.id }]
                    })
                }
                setAllExpData(res)
                setExportType(options);
                setParentExportType(() => {
                    return res.map((value) => value.tableName);
                });
            }).catch(() => { })
        }
    }, [type]);
    return (
        <>
            <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Brand Name </div>
                <Dropdown options={brands} name={'brand'} isMulti={true} defaultValue={values.brand} onChange={(e) => {
                    let data = e.map(value => value.value);
                    setFieldValue('brand', data);
                    getVendorsOptions(data, values?.vendor, setFieldValue);
                }}
                    placeholder='All Brands'
                />
            </div>
            <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Vendor Name  </div>
                <Dropdown options={vendors} name={'vendor'} isMulti={true} defaultValue={values.vendor} onChange={(e) => {
                    let data = e.map(value => value.value);
                    setFieldValue('vendor', data);

                }}
                    placeholder='All Vendors'
                />
            </div>
            <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Status  <span className="text-rose-500 text-2xl leading-none"></span></div>
                <Dropdown options={RecStatusValueForForm} name={'recStatus'} defaultValue={values.recStatus} />
            </div>
            <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2" >Export Type <span className="text-rose-500 text-2xl leading-none">*</span></div>
                <Dropdown options={exportType} name={'exporttype'} defaultValue={values.exporttype}
                    onChange={(data) => {
                        if (data) {
                            setFieldValue(`exporttype`, data.value);
                            if (getExportdbFields instanceof Function) {
                                getExportdbFields(data.value, setFieldValue)
                            }
                        } else {
                            setFieldValue(`exporttype`, 0);
                        }
                    }} />
            </div>
        </>
    );
};

export default FilterForm;

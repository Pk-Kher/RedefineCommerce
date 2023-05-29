
/*Component Name: StepOne
Component Functional Details:  StepOne .
Created By: PK Kher
Created Date: 7-19-2022
Modified By: Happy Patel
Modified Date:15-11-2022 */

import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { productType } from "dummy/Dummy";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Formik, Form as FormikForm } from "formik";
import { ValidationMsgs } from 'global/ValidationMessages';
import Dropdown from 'components/common/formComponent/Dropdown';
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { RecStatusValuebyName, RecStatusValueForForm } from "global/Enum"
import ImportExportService from "services/admin/masterCatalog/masterCatalog/products/ImportExportService";
import { displayColumnSelection, serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import BrandService from "services/admin/brand/BrandService";
import StoreBrandService from "services/admin/masterCatalog/store/brand/BrandService"
import VendorService from "services/admin/vendor/VendorService";
import { useCallback } from "react";

const StepOne = ({ currentStep, stepLength, index, goToStep, type, exportId, setExportTypeOptions }) => {
    var FileSaver = require('file-saver');
    const [brands, setBrands] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [ExpError, setExpError] = useState("");
    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
    const { storeId } = useParams();
    const [exportType, setExportType] = useState([]);
    const [SelectedExportType, setSelectedExportType] = useState([]);
    const [AllExpData, setAllExpData] = useState([]);
    const location = useSelector((store) => store?.location);
    const [tableColumns, setTableColumns] = useState([]);

    const dispatch = useDispatch()
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
            ImportExportService.getExportTypes(type, false).then((response) => {
                let options = []
                const res = response.data.data;
                if (res && res.length > 0) {
                    res.map((data, index) => {
                        options = [...options, { label: data.tableName, value: data.id }]
                    })
                }
                setAllExpData(res)
                setExportType(options);
                setExportTypeOptions(() => {
                    return res.map(value => value?.tableName);
                });

            }).catch(() => { })
        }
    }, [type]);
    const getExportdbFields = useCallback((exType) => {
        let tableName = AllExpData.filter((value, i) => {
            return value.id === exType;
        });
        if (exType && displayColumnSelection(tableName[0]?.tableName)) {
            dispatch(setAddLoading(true));
            ImportExportService.getExportdbFields(type, exType).then((response) => {
                let columns = response.data.data
                setTableColumns(columns);
                dispatch(setAddLoading(false));
            }).catch(() => {
                dispatch(setAddLoading(false));
            });
        } else {
            setTableColumns([]);
        }
    }, [AllExpData]);

    const validationSchema = Yup.object({
        exporttype: Yup.string().required(ValidationMsgs.product.export.exportTypeRequired),
    });


    const submitHandler = (fields, { resetForm }) => {
        if ((SelectedExportType[0]?.tableName === "product" || SelectedExportType[0]?.tableName === "GrandMasterProduct") && SelectedExportType[0]?.isImportTemplate) {
            // FileSaver.saveAs(`${process.env.REACT_APP_API_BLOB}/rdc/temp/${CompanyId}/mastercatalog/export/product.csv`, "Product.csv");
            window.location.href = `${process.env.REACT_APP_API_BLOB}/rdc/${CompanyId}/import/templates/Master_Product_List.csv`;
            goToStep(currentStep + 1, fields.exporttype)
        }
        else {
            let filteringOptions = [{
                field: "recStatus",
                operator: 1,
                value: fields?.recStatus || [RecStatusValuebyName.Active, RecStatusValuebyName.Inactive].join(",")
            },
            {
                field: "brandId",
                operator: 1,
                value: (fields?.brand?.length > 0 ? fields?.brand?.join(",") : "0")
            },
            {
                field: "vendorId",
                operator: 1,
                value: (fields?.vendor?.length > 0 ? fields?.vendor?.join(",") : "0")
            }]
            const object = ({
                exporttype: parseInt(fields.exporttype),
                fieldsname: tableColumns,
                sourceId: type,
                storeId: [productType.EcommerceStore, productType.CorporateStore].includes(type) ? parseInt(storeId) : 0,
                newargs: {
                    pageIndex: 0,
                    pageSize: 0,
                    pagingStrategy: 0,
                    sortingOptions: [],
                    filteringOptions: filteringOptions
                },
                exportotherdetailmodel: {
                    browser: location.browser,
                    location: location.location,
                    ipAddress: location.ipAddress,
                    macAddress: location.macAddress
                }
            });
            console.log(object);
            // return;
            dispatch(setAddLoading(true))
            ImportExportService.exportData(object).then((response) => {
                if (response.data.success) {
                    FileSaver.saveAs(response.data.data, "export.csv");
                    // window.location.href = response.data.data;
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.product.export.exportSuccess,
                        })
                    );
                    dispatch(setAddLoading(false))

                } else {
                    dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
                    dispatch(setAddLoading(false))

                }
                resetForm()
                dispatch(setAddLoading(false))
                goToStep(currentStep + 1, fields.exporttype)

            }).catch(err => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.product.export.exportFailed,
                    })
                );
                dispatch(setAddLoading(false))

            });
        }
    }
    return (
        <>
            <div className={`import-step import-step-1 ${currentStep !== 1 ? 'hidden' : 'visible'}`}>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        brand: '',
                        vendor: '',
                        recStatus: '',
                        exporttype: "",
                        fieldsname: []
                    }}
                    validationSchema={validationSchema}
                    onSubmit={submitHandler}
                >
                    {({ errors, setTouched, touched, resetForm, setFieldValue, values }) => {
                        return (
                            <FormikForm>
                                <div className="p-4 uppercase tracking-wide text-lg font-bold border-b-2 border-neutral-200">Select Import Method (Step {index + 1} of {stepLength})</div>
                                <div className="p-4">
                                    <div className=" border-grey-300 bg-grey-100 text-grey-600 p-4 rounded-md">
                                        <div className="flex items-center flex-wrap mb-3 last:mb-0"><span className="material-icons-outlined mr-2 w-6 h-6">info</span> Select one of these formats to import our products information.</div>
                                        <div className='p-6 grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                            <div>
                                                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Export Type <span className="text-rose-500 text-2xl leading-none">*</span></div>
                                                <Dropdown options={exportType} name={'exporttype'} defaultValue={values.exporttype}
                                                    onChange={(data) => {
                                                        if (data) {
                                                            setFieldValue(`exporttype`, data.value)
                                                            setSelectedExportType(() => {
                                                                return AllExpData.filter((value, i) => {
                                                                    return value.id === data.value;
                                                                })
                                                            });

                                                        } else {
                                                            setFieldValue(`exporttype`, "");
                                                        }
                                                        getExportdbFields(data?.value);
                                                    }}
                                                />
                                                {ExpError !== "" && <div className="text-rose-500 leading-none">{ExpError}</div>}
                                            </div>
                                            {(SelectedExportType[0]?.tableName !== "product" && type !== productType.GMC) &&
                                                <>
                                                    <div>
                                                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Brand Name</div>
                                                        <Dropdown options={brands} name={'brand'} isMulti={true} defaultValue={values.brand} onChange={(e) => {
                                                            let data = e.map(value => value.value);
                                                            setFieldValue('brand', data);
                                                            getVendorsOptions(data, values?.vendor, setFieldValue);
                                                        }}
                                                            placeholder='All Brands'
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Vendor Name </div>
                                                        <Dropdown options={vendors} name={'vendor'} isMulti={true} defaultValue={values.vendor} onChange={(e) => {
                                                            let data = e.map(value => value.value);
                                                            setFieldValue('vendor', data);

                                                        }}
                                                            placeholder='All Vendors'
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Status </div>
                                                        <Dropdown options={RecStatusValueForForm} name={'recStatus'} defaultValue={values.recStatus} />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div className="flex items-center flex-wrap mb-3 last:mb-00"><span className="material-icons-outlined mr-2 w-6 h-6">
                                            download_for_offline</span> You can download your
                                            <span className="mx-1">Excel format.</span>
                                            This will help you link your products to them.
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 text-right">
                                    <button type="button" className="cursor-pointer btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white mr-2" onClick={() => {
                                        if (values?.exporttype !== "") { goToStep(currentStep + 1, values.exporttype) }
                                        else {
                                            setExpError(ValidationMsgs.product.import.ExportTypeError)
                                        }
                                    }}>Next Step</button>
                                    <button type="submit" className="cursor-pointer btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white">Download and Next Step</button>
                                </div>
                            </FormikForm>
                        )
                    }}
                </Formik>

            </div>
        </>
    );
};

export default StepOne;

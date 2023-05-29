/*Component Name: Import
Component Functional Details:  Import
Created By: Shrey Patel
Created Date: 02-01-2023
Modified By: <ModifiedBy>
Modified Date: <ModifiedDate> */

import Dropdown from 'components/common/formComponent/Dropdown';
import Tabs from 'components/common/Tabs';
import { Formik, Form as FormikForm, } from 'formik';
import { InventoryImportExportTabs, RecStatusValuebyName, RecStatusValueForForm } from 'global/Enum';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import ThirdPartyInventorySync from 'services/admin/masterCatalog/masterCatalog/ThirdPartyInventorySync/ThirdPartyInventorySync';
import VendorService from 'services/admin/vendor/VendorService';
import { serverError } from 'services/common/helper/Helper';
import Messages from "components/common/alerts/messages/Index";
import ElementHeaderSetup from 'components/admin/content/template/create/elements/ElementHeaderSetup';

const ExportInventory = ({ setShowImportExportInventory, setShowInventoryList, InventoryTypeId, InventoryName }) => {
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const AdminId = useSelector((store) => store?.user?.id);
    const permission = useSelector(store => store.permission);

    const [Data, setData] = useState([]);
    const [BrandList, setBrandList] = useState([]);
    const [VendorList, setVendorList] = useState([]);
    const [BrandIdForVendor, setBrandIdForVendor] = useState(0);
    const [vendorValidate, setVendorValidate] = useState({ CheckVendorId: InventoryTypeId == 3 ? true : false });
    const [activeTab, setActiveTab] = useState(0);

    const onTabClick = (e, index) => {
        e.preventDefault();
        setActiveTab(index);
    };

    const onSubmit = (values, { resetForm }) => {
        dispatch(setAddLoading(true))
        if (activeTab != 0) {
            const formData = new FormData();
            formData.append("UserId", AdminId);
            formData.append("file", values.file);
            formData.append("other.ExportType", 3);
            formData.append("other.Browser", location.browser);
            formData.append("InventoryTypeId", InventoryTypeId);
            formData.append("other.Location", location.location);
            formData.append("other.IPAddress", location.ipAddress);
            formData.append("other.MACAddress", location.macAddress);

            ThirdPartyInventorySync.importInventory(formData)
                .then((response) => {
                    if (response.data.success) {
                        dispatch(
                            setAlertMessage({
                                type: "success",
                                message: response.data.data,
                            })
                        );
                        dispatch(setAddLoading(false))
                    } else {
                        dispatch(
                            setAlertMessage({
                                type: "danger",
                                message: serverError(response),
                            })
                        );
                        dispatch(setAddLoading(false))
                    }
                })
                .catch(() => {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: ValidationMsgs.product.export.importFailed,
                        })
                    );
                    dispatch(setAddLoading(false))
                });
        } else {
            // dispatch(setAddLoading(true))
            ThirdPartyInventorySync.exportProductInventory({ ...values, exportotherdetailmodel: { ...location }, })
                .then((response) => {
                    if (response.data.success) {
                        dispatch(
                            setAlertMessage({
                                type: "success",
                                message: ValidationMsgs.commonExport.success,
                            })
                        );
                        window.location.href = response.data.data;
                    } else {
                        dispatch(
                            setAlertMessage({
                                type: "danger",
                                message: serverError(response),
                            })
                        );
                    }
                    dispatch(setAddLoading(false));
                }).catch((error) => {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: ValidationMsgs.commonExport.failed,
                        })
                    );
                    dispatch(setAddLoading(false));
                });
        }
    };

    const getInventoryBrandList = useCallback(
        () => {
            dispatch(setAddLoading(true))
            ThirdPartyInventorySync.getInventoryBrandList(InventoryTypeId).then((response) => {
                setBrandList(response.data.data);
                dispatch(setAddLoading(false))
            }).catch(() => {
                dispatch(setAddLoading(false))
            })
        }, []);

    useEffect(() => {
        getInventoryBrandList();
    }, [InventoryTypeId])

    const getInventoryVendorList = () => {
        dispatch(setAddLoading(true))
        VendorService.getVendorByBrand(BrandIdForVendor).then((response) => {
            setVendorList(response.data.data);
            dispatch(setAddLoading(false))
        }).catch(() => {
            dispatch(setAddLoading(false))
        })
    };

    useEffect(() => {
        if (InventoryTypeId == 3) {
            getInventoryVendorList();
        }
    }, [BrandIdForVendor])

    const schema = Yup.object({
        brandId: Yup.number().required(ValidationMsgs.brand.nameRequired).min(1, ValidationMsgs.brand.nameRequired),
        status: Yup.string().required(ValidationMsgs.common.recStatusRequired),
        vendorId: vendorValidate.CheckVendorId && Yup.number().required(ValidationMsgs.common.vendorIdRequired).min(1, ValidationMsgs.common.vendorIdRequired),
    });

    return (
        <>
            <title>Import/Export</title>
            <div >
                <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                    <div className="flex mb-8 justify-between">
                        <div className="flex items-center">
                            <button className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2" onClick={() => { setShowImportExportInventory(false) }}>
                                <span className="material-icons-outlined">west</span>
                            </button>
                            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                                Back
                            </h1>
                        </div>
                        {(permission?.isEdit || permission?.isDelete) &&
                            <div className="flex flex-wrap space-x-2">
                                <button className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={() => { setShowInventoryList(false) }}>
                                    Cancel
                                </button>
                            </div>
                        }
                    </div>
                    <div className="bg-white shadow-xxl rounded-md mt-10">
                        <div className="w-full bg-white shadow-xxl rounded-md mb-8 pt-8">
                            <div className="p-4 uppercase tracking-wide text-lg font-bold border-b-2 border-neutral-200">
                                Master Catalog - {InventoryName}  Bulk Export Product Inventory
                            </div>
                            <div className='p-4'>
                                <Tabs
                                    options={useMemo(() =>
                                        InventoryImportExportTabs.map((value) => {
                                            return {
                                                id: value.id,
                                                label: value.typeName,
                                                value: value.typeName,
                                            };
                                        })
                                    )}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    onTabClick={onTabClick}
                                />
                            </div>
                            <Messages />
                            {/* For Upload Tab  */}
                            {activeTab != 0 ?
                                <UploadInventory Data={Data} InventoryTypeId={InventoryTypeId} onSubmit={() => onSubmit} schema={schema} AdminId={AdminId} />
                                :
                                <ImportInventory brands={BrandList} Vendor={VendorList} Data={Data} InventoryTypeId={InventoryTypeId} setBrandIdForVendor={setBrandIdForVendor} schema={schema} onSubmit={() => onSubmit} AdminId={AdminId} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ExportInventory;

const ImportInventory = ({ brands, Vendor, Data, AdminId, InventoryTypeId, setBrandIdForVendor, onSubmit, schema }) => {

    return (
        <>
            <title>Export</title>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    inventoryTypeId: Data?.inventoryTypeId || InventoryTypeId,
                    brandId: Data?.brandId || 0,
                    vendorId: Data?.vendorId || 0,
                    status: Data?.recStatus || RecStatusValuebyName.Active,
                    userId: AdminId,
                }}
                onSubmit={onSubmit()}
                validationSchema={schema}
                validateOnMount={true}
            >
                {({ errors, setFieldValue, values }) => {
                    setBrandIdForVendor(values.brandId)

                    return (
                        <FormikForm>
                            <div >
                                <div className=" border-grey-300 bg-grey-100 text-grey-600 p-4 rounded-md">
                                    <div className="flex items-center flex-wrap mb-3 last:mb-0"><span className="font-semibold mx-1">Download Existing Data For Update.</span></div>
                                    <div className='p-6'>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-500 uppercase mb-2 flex ml-2">Brand Name :
                                                <span className="text-rose-500 text-2xl leading-none">*</span>
                                                <div className='w-1/4 ml-4' >
                                                    <Dropdown options={brands} name={'brandId'} isMulti={false} defaultValue={values.brandId} />
                                                </div>
                                            </div>
                                        </div>
                                        {InventoryTypeId == 3 &&
                                            <div>
                                                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 flex">Vendor Name :
                                                    <span className="text-rose-500 text-2xl leading-none">*</span>
                                                    <div className='w-1/4 ml-4' >
                                                        <Dropdown options={Vendor} name={'vendorId'} defaultValue={values.vendorId} />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <div>
                                            <div className="text-xs font-semibold text-gray-500 uppercase mt-4 flex ml-1">Status :
                                                <span className="text-rose-500 text-2xl leading-none">*</span>
                                                <div className='w-1/4 ml-14' >
                                                    <Dropdown options={RecStatusValueForForm} name={'status'} defaultValue={values.status} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center flex-wrap mb-3 last:mb-0">
                                        <button type="submit" className="cursor-pointer btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white">Download Data</button>
                                    </div>
                                </div>
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

const UploadInventory = ({ Data, AdminId, InventoryTypeId, onSubmit }) => {

    return (
        <>
            <title>Upload</title>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    file: Data.files || ""
                }}
                onSubmit={onSubmit()}
            // validationSchema={schema}
            // validateOnMount={true}
            >
                {({ errors, setFieldValue, values }) => {
                    return (
                        <FormikForm>
                            <div >
                                <div className=" border-grey-300 bg-grey-100 text-grey-600 p-4 rounded-md">
                                    <div className="flex items-center flex-wrap mb-3 last:mb-0"><span className="font-semibold mx-1">Check Your File.</span></div>
                                    <div className="p-4">
                                        <div className="mb-6">
                                            <label htmlFor="" className="uppercase tracking-wide text-xs font-bold mb-2 flex"> File To Check :
                                                <input type="file" name="file" id='file' onChange={(event) => { setFieldValue("file", event.currentTarget.files[0]); }}
                                                    className="w-1/5 px-2 py-1 text-xs leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md ml-8"
                                                />
                                            </label>
                                            <div div className="text-xs mt-1 ml-40">
                                                <div className="">The file must be .CSV</div>
                                                <div className="">The file must be under 20MBytes.</div>
                                                <div className="">
                                                    You can import 25000 items at once.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center flex-wrap mb-3 last:mb-0 ">
                                        <button type="submit" className="cursor-pointer btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white">Upload Data</button>
                                    </div>
                                </div>
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

/*Component Name: Export
Component Functional Details:  Export .
Created By: PK Kher
Created Date: 7-19-2022
Modified By: Happy Patel
Modified Date: 12/21/2022 */

import * as Yup from "yup";
import History from './History';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from 'components/common/Tabs';
import { Formik, Form as FormikForm } from "formik";
import { ValidationMsgs } from 'global/ValidationMessages';
import { displayColumnSelection, serverError } from 'services/common/helper/Helper';
import Checkbox from 'components/common/formComponent/Checkbox';
import Dropdown from 'components/common/formComponent/Dropdown';
import DropdownService from 'services/common/dropdown/DropdownService';
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { exportTabs, RecStatusValuebyName, RecStatusValueForForm } from "global/Enum"
import React, { useState, useEffect, useMemo, Fragment, useCallback } from 'react';
import ImportExportService from 'services/admin/masterCatalog/masterCatalog/products/ImportExportService';
import { productType } from "dummy/Dummy";
import { useParams } from "react-router-dom";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import FilterForm from "./FilterForm";
import CheckBox from "components/common/table/CheckBox";

const Export = ({ type }) => {

    var FileSaver = require('file-saver');
    const [activeTab, setActiveTab] = useState(0);
    const [showColumns, setShowColumns] = useState(false);
    const [tableColumns, setTableColumns] = useState([]);

    const [SelectedExportType, setSelectedExportType] = useState("");
    const [AllExpData, setAllExpData] = useState([]);
    const [toggleCheckbox, setToggleCheckbox] = useState(true);
    const [exportType, setExportType] = useState([]);
    const location = useSelector((store) => store?.location);
    const dispatch = useDispatch();
    const { storeId } = useParams();


    const getExportdbFields = useCallback((exType, setFieldValue) => {
        let tableName = AllExpData.filter((value, i) => {
            return value.id === exType;
        })
        setSelectedExportType(tableName[0]?.tableName)
        if (exType && displayColumnSelection(tableName[0]?.tableName)) {
            dispatch(setAddLoading(true));
            ImportExportService.getExportdbFields(type, exType).then((response) => {
                let columns = response.data.data
                setFieldValue("fieldsname", columns);
                setTableColumns(columns);
                dispatch(setAddLoading(false));
            }).catch(() => {
                dispatch(setAddLoading(false));
            });
        } else {
            setTableColumns([]);
        }
    }, [AllExpData])

    const onTabClick = (e, index) => {
        e.preventDefault();
        setActiveTab(index);
    };

    const validationSchema = Yup.object({
        recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
        exporttype: Yup.string().required(ValidationMsgs.product.export.exporttypeRequired),
    });

    const submitHandler = (fields, { resetForm }) => {
        if (![productType.EcommerceStore, productType.CorporateStore].includes(type)) {

        }
        if ((tableColumns?.length > 0 && (SelectedExportType === "product" || SelectedExportType === "OptionProduct" || SelectedExportType === "ProductColor") && fields?.fieldsname?.length <= 0)) {
            dispatch(setAlertMessage({
                type: 'danger',
                message: 'Please select at least one field to export.'
            }));
            return;
        }
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
        },
        {
            field: "isdiscontinue",
            operator: 1,
            value: fields?.isDiscontinue
        },]

        const object = ({
            exporttype: parseInt(fields.exporttype),
            fieldsname: fields.fieldsname/*  && fields.fieldsname.length > 0 ? fields.fieldsname : [] */,
            sourceId: type,
            storeId: [productType.EcommerceStore, productType.CorporateStore].includes(type) ? parseInt(storeId) : 0,
            newargs: {
                pageIndex: 0,
                pageSize: 0,
                pagingStrategy: 0,
                sortingOptions: [],
                filteringOptions: filteringOptions
            },
            exportotherdetailmodel: location

        });
        console.log(object);
        dispatch(setAddLoading(true))
        ImportExportService.exportData(object).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                window.location.href = response.data.data;
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.product.export.exportSuccess,
                    })
                );
            } else {
                dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
            }
            dispatch(setAddLoading(false))
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

    const toggleModulesAllCheckbox = (e, setFieldValue) => {
        setToggleCheckbox((prev) => !prev);
        let checkAll = [];
        if (e.target.checked) {
            setFieldValue("fieldsname", tableColumns);
        } else {
            setFieldValue("fieldsname", checkAll)
        }
    };
    return (
        <>
            <title>Export</title>
            <div >
                <div className="bg-white shadow-xxl rounded-md mb-8">
                    <div className="w-full bg-white shadow-xxl rounded-md mb-8 pt-8">
                        <div className='p-4'>
                            <Tabs
                                options={useMemo(() =>
                                    exportTabs.map((value) => {
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
                        {activeTab === 0 && <div className={''}>
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    brand: [],
                                    vendor: [],
                                    recStatus: 'A',
                                    fieldsname: [],
                                    exporttype: "",
                                    optProductStatus: 'A',
                                    isDiscontinue: 'false'
                                }}
                                validationSchema={validationSchema}
                                onSubmit={submitHandler}
                            >
                                {({ errors, setFieldValue, values }) => {
                                    return (
                                        <FormikForm>
                                            <div className="import-step import-step-1">
                                                <div className='p-6 grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                                    <FilterForm type={type} setAllExpData={setAllExpData} getExportdbFields={getExportdbFields} setParentExportType={setExportType} />
                                                    {SelectedExportType === "product" &&
                                                        <div>
                                                            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Is Discontinue <span className="text-rose-500 text-2xl leading-none">*</span></div>
                                                            <Dropdown options={[{ label: "Yes", value: 'true', }, { label: "No", value: 'false' }]} name={'isDiscontinue'} defaultValue={values.isDiscontinue} />
                                                        </div>
                                                    }

                                                </div>
                                                {(tableColumns?.length > 0 && displayColumnSelection(SelectedExportType)) &&
                                                    <div className="p-6 pt-0 flex items-center space-x-2">
                                                        <span className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer" onClick={() => setShowColumns((prev) => !prev)}>Select Fields</span>
                                                    </div>
                                                }
                                            </div>

                                            <div className={`import-step import-step-2`}>
                                                {(tableColumns?.length > 0 && displayColumnSelection(SelectedExportType)) &&

                                                    <div className={`p-6 pt-0 ${showColumns ? 'hidden' : 'visible'}`}>
                                                        <div className="mb-6 last:mb-0">
                                                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Select Column <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                            {tableColumns?.length > 0 &&
                                                                <div className='mb-5'>
                                                                    <CheckBox indeterminate={values?.fieldsname?.length > 0 && values.fieldsname?.length < tableColumns?.length} name="toggleCheckbox" id={'toggleCheckbox'} label={"checkAll"} checked={values?.fieldsname?.length === tableColumns.length} onChange={(e) => { toggleModulesAllCheckbox(e, setFieldValue) }} />
                                                                    <label className="ml-2 inline-block" htmlFor={'toggleCheckbox'}>Check All</label>
                                                                </div>
                                                            }
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                {tableColumns && tableColumns.map((tableValue, index) => {
                                                                    return (
                                                                        <Fragment key={index}>
                                                                            <div>
                                                                                <Checkbox label={tableValue} id={`fieldsname[${index}]`} value={tableValue} name={`fieldsname[${index}]`}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.checked) {
                                                                                            setFieldValue('fieldsname', [...values.fieldsname, e.target.value])
                                                                                        } else {
                                                                                            let tempColumns = values.fieldsname.filter(value => e.target.value !== value);
                                                                                            setFieldValue('fieldsname', tempColumns);
                                                                                        }
                                                                                    }} checked={values.fieldsname.includes(tableValue)} />
                                                                            </div>
                                                                        </Fragment>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="p-4 flex items-center justify-end space-x-2 border-t-2 border-neutral-200">
                                                    <button type='submit' className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">Download Data</button>
                                                </div>
                                            </div>
                                        </FormikForm>
                                    )
                                }}
                            </Formik>

                        </div>}
                        {activeTab === 1 && <div className={''}>
                            <History exportType={exportType} type={type} />
                        </div>}

                    </div>
                </div>
            </div>
        </>
    );
};

export default Export;

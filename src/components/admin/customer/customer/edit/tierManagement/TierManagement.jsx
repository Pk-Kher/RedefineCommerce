/*Component Name: TierManagement
Component Functional Details:  TierManagement .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useRef } from 'react';
import { Form as FormikForm, Formik } from "formik";
import TierList from './TierList';
import { useEffect } from 'react';
import Dropdown from 'components/common/formComponent/Dropdown';
import TierService from 'services/admin/tier/TierService';
import DropdownService from 'services/common/dropdown/DropdownService';
import CustomerTierService from 'services/admin/customerTier/CustomerTierService';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
import * as Yup from "yup"
import { useCallback } from 'react';
import CheckBox from 'components/common/table/CheckBox';
import { ValidationMsgs } from 'global/ValidationMessages';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import CustomerService from 'services/admin/customer/CustomerService';
import CustomerInfo from 'components/admin/order/edit/CustomerInfo';

const TierManagement = ({ customerInfo, getCustomerData }) => {
    const [customizeTier, setCustomizeTier] = useState(false);
    const [tier, setTier] = useState([]);
    const [brand, setBrand] = useState([]);
    const [vendor, setVendor] = useState([]);
    const location = useSelector((store) => store.location);
    const getTiers = useRef(null);
    const dispatch = useDispatch();
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    const permission = useSelector(store => store?.permission)

    const getTier = () => {
        dispatch(setAddLoading(true))

        TierService.getTiersByStoreID(customerInfo.storeId).then(response => {
            if (response.data.data) {
                setTier(() => {
                    return response.data.data.map((value, index) => {
                        return {
                            label: value?.tierName,
                            value: value?.id
                        }
                    })
                })
            }
            dispatch(setAddLoading(false))
        }).catch(error => {
            dispatch(setAddLoading(false))
        })
    }

    useEffect(() => {
        getTier();
    }, [customerInfo.storeId]);

    useEffect(() => {
        DropdownService.getDropdownValues('brand').then(response => {
            if (response.data.data) {
                setBrand(response.data.data);
            }
        }).catch(errors => { })
        DropdownService.getDropdownValues('vendor').then(response => {
            if (response.data.data) {
                setVendor(response.data.data);
            }
        }).catch(errors => { })
    }, [])

    const onSubmit = (values, { resetForm }) => {
        if (values.id) {
            // setEditTierData(null);
            updateTier(values, resetForm)
        } else {
            createTier(values, resetForm);
        }
    }

    const createTier = useCallback((values, resetForm) => {
        dispatch(setAddLoading(true))

        CustomerTierService.createCustomerTier({
            customerTierModel: {
                ...values,
                ...location
            }
        }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.tier.tierCreated,
                    })
                );
                if (getTiers.current instanceof Function) {
                    getTiers.current();
                }
                resetForm({})
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            dispatch(setAddLoading(false))
        }).catch((errors) => {
            dispatch(
                setAlertMessage({ type: "danger", message: ValidationMsgs.tier.tierNotCreated })
            );
            dispatch(setAddLoading(false))
        });
    }, []);

    const updateTier = useCallback((values, resetForm) => {
        dispatch(setAddLoading(true))

        CustomerTierService.updateCustomerTier({
            customerTierModel: {
                ...values,
                ...location
            }
        })
            .then((response) => {
                if (response.data.success && response.data.data) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.tier.tierUpdated,
                        })
                    );
                    if (getTiers.current instanceof Function) {
                        getTiers.current();
                    }
                    resetForm({})
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                }
                dispatch(setAddLoading(false))
            }).catch((errors) => {
                dispatch(
                    setAlertMessage({ type: "danger", message: ValidationMsgs.tier.tierNotUpdated })
                );
                dispatch(setAddLoading(false))
            });
    }, []);

    const updateMailTier = (values) => {
        dispatch(setAddLoading(true))
        CustomerService.updateCustomerMainTier({
            customerId: customerInfo.id,
            tierId: values.tierId
        }).then((response) => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.tier.tierCreated,
                    })
                );
                getCustomerData()
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            dispatch(setAddLoading(false))
        }).catch((errors) => {
            dispatch(
                setAlertMessage({ type: "danger", message: ValidationMsgs.tier.tierNotCreated })
            );
            dispatch(setAddLoading(false))
        });
    };

    const validationSchema = Yup.object({
        brandId: Yup.string().required(ValidationMsgs.common.brandIdRequired),
        vendorId: Yup.string().required(ValidationMsgs.common.vendorIdRequired),
        tierId: Yup.string().required(ValidationMsgs.customer.tierRequired)
    });
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    id: 0,
                    customerId: customerInfo.id,
                    brandId: "",
                    vendorId: "",
                    tierId: "",
                    recStatus: "A",
                    rowVersion: ''
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({ setFieldValue, errors, values, setValues, resetForm }) => {
                    return (
                        <FormikForm>
                            <div className='grow'>
                                <div className='p-6 space-y-6'>
                                    <div className='grid grid-cols-1 gap-6'>
                                        <div >
                                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Select Tier <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                            <div className="flex flex-wrap justify-between">
                                                <Dropdown className="w-5/6" options={tier} name={'defaultTierId'} defaultValue={customerInfo.tierId} onChange={(e) => setFieldValue("tierId", e.value)} /* isDisabled={true}  */ />
                                                {(permission?.isEdit || permission?.isDelete) &&
                                                    <button
                                                        disabled={GlobalLoading}
                                                        onClick={() => updateMailTier(values)}
                                                        type='submit' className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}>
                                                        <div className={`w-full flex justify-center align-middle `}>
                                                            {GlobalLoading && (
                                                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                                            )}
                                                            Save
                                                        </div>
                                                    </button>
                                                }
                                            </div>
                                        </div>



                                        <div>
                                            <label className="text-gray-500 inline-flex items-center">
                                                <CheckBox type="checkbox" className="form-checkbox" id="different_Name" checked={customizeTier} onChange={(e) => {
                                                    setCustomizeTier(prev => e.target.checked)
                                                }} />
                                                <span className="ml-2">Do you want to customize tier ?</span>
                                            </label>
                                        </div>
                                        {(permission?.isEdit || permission?.isDelete) &&
                                            <div className={`${!customizeTier && 'hidden'}`}>
                                                <div className='mb-6'>
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Brand Name <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                    <Dropdown options={brand} name="brandId" defaultValue={values.brandId} />
                                                </div>
                                                <div className='mb-6'>
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Vendor Name <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                    <Dropdown options={vendor} name="vendorId" defaultValue={values.vendorId} />
                                                </div>
                                                <div className='mb-6'>
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Tier Name <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                    <Dropdown options={tier} name="tierId" defaultValue={values.tierId} />
                                                </div>

                                                <div className="flex flex-wrap justify-center space-x-2 my-4">
                                                    <button type='button' onClick={() => { resetForm({}); }} className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700">Cancel</button>
                                                    <button
                                                        disabled={GlobalLoading}
                                                        type='submit' className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}>
                                                        <div className={`w-full flex justify-center align-middle `}>
                                                            {GlobalLoading && (
                                                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                                            )}
                                                            Save
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                        <TierList customerInfo={customerInfo} getTiers={getTiers} setEditTierData={setValues} setCustomizeTier={setCustomizeTier} />

                                    </div>
                                </div>
                            </div>
                        </FormikForm>
                    )
                }}
            </Formik>
        </>
    );
};

export default TierManagement;

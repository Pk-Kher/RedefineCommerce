/*Component Name: Address
Component Functional Details:  Address .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import Transition from 'utils/Transition';
import { Form as FormikForm, Formik } from "formik";
import { RecStatusValuebyName } from 'global/Enum';
import Input from 'components/common/formComponent/Input';
import { ValidationMsgs } from 'global/ValidationMessages';
import * as Yup from "yup";
import CustomerService from 'services/admin/customer/CustomerService';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const AddressModal = ({ showAddressModal, setAddressModal, addressType, customerInfo, getCustomerData }) => {
    const dispatch = useDispatch();
    const location = useSelector(store => store.location);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    const onSubmit = (values, { resetForm }) => {
        dispatch(setAddLoading(true))

        CustomerService.createAddress({
            customerAddressModel: { ...values, ...location }
        }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.customer.addAddress,
                    })
                );
                setAddressModal(false);
                getCustomerData();
                resetForm({});
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
                dispatch(setAddLoading(false))
            }
        }).catch((errors) => {
            dispatch(
                setAlertMessage({ type: "danger", message: ValidationMsgs.customer.failToAddAddress })
            );
            dispatch(setAddLoading(false))
        })
    }
    const validationSchema = Yup.object({
        address1: Yup.string().required(ValidationMsgs.common.addressRequired),
        firstname: Yup.string().required(ValidationMsgs.common.firstNameRequired),
        lastName: Yup.string().required(ValidationMsgs.common.lastNameRequired),
        email: Yup.string().email(ValidationMsgs.common.Email).required(ValidationMsgs.user.emailRequired),
        phone: Yup.string().required(ValidationMsgs.common.phoneRequired).matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, ValidationMsgs.common.phoneMatches),
        city: Yup.string().required(ValidationMsgs.common.cityRequired),
        state: Yup.string().required(ValidationMsgs.common.stateRequired),
        countryName: Yup.string().required(ValidationMsgs.common.countryRequired),
        postalCode: Yup.string().required(ValidationMsgs.common.postalCodeRequired).max(6, ValidationMsgs.common.postalCodeLength),
        fax: Yup.string().nullable().max(15, ValidationMsgs.common.faxLength),
        countryCode: Yup.string().nullable().max(3, ValidationMsgs.common.countryCodeLength)
    });
    return (
        <>
            <Transition
                className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
                show={showAddressModal}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
                onClick={() => setAddressModal(false)}
            />
            <Transition
                className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                show={showAddressModal}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div className="bg-white rounded shadow-lg overflow-auto max-w-[560px] w-full max-h-full" >
                    <div className="px-5 py-3 border-b border-neutral-200">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-gray-800">{addressType === 'S' ? 'Shipping Address' : 'Billing Address'}</div>
                            <button className="text-gray-400 hover:text-gray-500" onClick={() => setAddressModal(prev => !prev)}>
                                <div className="sr-only">Close</div>
                                <svg className="w-4 h-4 fill-current">
                                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"> </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            id: 0,
                            customerId: customerInfo.id || 0,
                            firstname: "",
                            lastName: "",
                            email: "",
                            address1: "",
                            address2: "",
                            suite: "",
                            city: "",
                            state: "",
                            postalCode: "",
                            fax: "",
                            phone: "",
                            countryName: "",
                            countryCode: "",
                            addressType: addressType,
                            isDefault: false,
                            recStatus: RecStatusValuebyName.Active,
                            rowVersion: "",
                        }}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                    //     validateOnChange={true}
                    //     validateOnBlur={false}
                    >
                        {({ setFieldValue, errors, values }) => {
                            return (
                                <FormikForm>
                                    <div className="px-5 pt-4 pb-1">
                                        <div className="text-sm flex flex-wrap justify-start text-left -mx-4">
                                            <div className="w-full p-4">
                                                <div className="grid grid-cols-12 gap-6">
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">First Name<span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input type="text" name={'firstname'} placeholder="First Name" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Last Name<span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input type="text" name={'lastName'} placeholder="Last Name" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Email<span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input type="email" name={'email'} placeholder="Email" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Phone<span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input type="text" name={'phone'} placeholder="000-000-0000" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Address 1 <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input name={'address1'} type="text" placeholder="Address 01" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Address 2</label>
                                                        <Input type="text" name={'address2'} placeholder="Address 02" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">City <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input type="text" name={'city'} placeholder="City" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">State <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input type="text" name={'state'} placeholder="State" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name" maxLength={10}>Postal Code <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input type="text" name={'postalCode'} placeholder="Postal Code" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Country <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input type="text" name={'countryName'} placeholder="Country" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name" maxLength={3}>Country Code</label>
                                                        <Input type="text" name={'countryCode'} placeholder="Country Code" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Apt/ Suite#</label>
                                                        <Input name={'suite'} type="text" placeholder="Apt/ Suite#" />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Fax</label>
                                                        <Input type="text" name={'fax'} placeholder="000-000-0000" maxLength={15} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-4">
                                        <div className="flex flex-wrap justify-end space-x-2">
                                            <button
                                                disabled={GlobalLoading}
                                                className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}                                            >
                                                <div className={`w-full flex justify-center align-middle `}>
                                                    {GlobalLoading && (
                                                        <span className="spinner-border spinner-border-sm mr-2"></span>
                                                    )}
                                                    Save
                                                </div>
                                            </button>
                                            <button type='button' className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={() => setAddressModal(prev => !prev)}>Cancel</button>
                                        </div>
                                    </div >
                                </FormikForm>
                            )
                        }}
                    </Formik>
                </div >
            </Transition >
        </>
    );
};

export default AddressModal;

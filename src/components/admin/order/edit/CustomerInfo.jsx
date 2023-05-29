/*Component Name: CustomerInfo
Component Functional Details:  CustomerInfo .
Created By: PK Kher
Created Date: 7-25-2022
Modified By: PK Kher
Modified Date: 7-25-2022*/

import Input from 'components/common/formComponent/Input';
import React, { useState, useRef, useEffect, } from 'react';
import Transition from 'utils/Transition';
import { useSelector } from "react-redux";
import { DateTimeFormat, serverError } from 'services/common/helper/Helper';
import { Formik, Form as FormikForm } from "formik";
import OrderService from 'services/admin/order/OrderService';
import * as Yup from "yup";
import { ValidationMsgs } from 'global/ValidationMessages';
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import SaveButton from 'components/common/formComponent/SaveButton';
import Messages from "components/common/alerts/messages/Index";
import Dropdown from 'components/common/formComponent/Dropdown';
import StateService from 'services/admin/state/StateService';
import CountryService from 'services/admin/country/CountryService';

const CustomerInfo = ({ orderDetail, getOrderDetails, setDisplayMessage }) => {

    return (
        <>
            <div className="w-full justify-between bg-white py-3 rounded-md shadow-lg">
                <div className="w-full flex mb-2 last:mb-0">
                    <div className="w-1/2 text-left px-3"><div className="text-lg font-bold text-gray-500 text-left px-2 leading-10">Customer Info</div></div>
                    {/* <div className="w-1/2 text-left px-3">
                        <div className="text-lg font-bold text-gray-500 text-right px-2 leading-10"><button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Print</button></div>
                    </div> */}
                </div>
                <div className="w-full flex mb-4 last:mb-0 border-t border-b border-neatural-200">
                    <div className="w-1/2 text-left pl-3"><div className="text-md font-bold text-gray-500 text-left px-2 leading-10">Order Details</div></div>
                </div>
                <div className="w-full flex mb-2 px-3 last:mb-0">
                    <div className="w-1/2 text-left"><div className="text-md font-medium text-gray-500 text-left px-2 py-1">Order #</div></div>
                    <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">{orderDetail?.orderNumber}</div></div>
                </div>
                <div className="w-full flex mb-2 px-3 last:mb-0">
                    <div className="w-1/2 text-left"><div className="text-md font-medium text-gray-500 text-left px-2 py-1">Order ID</div></div>
                    <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">{orderDetail?.orderNumber}</div></div>
                </div>
                <div className="w-full flex mb-2 px-3 last:mb-0">
                    <div className="w-1/2 text-left"><div className="text-md font-medium text-gray-500 text-left px-2 py-1">Reference #</div></div>
                    <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">{orderDetail?.refenceOrderID}</div></div>
                </div>
                <div className="w-full flex mb-2 px-3 last:mb-0">
                    <div className="w-1/2 text-left"><div className="text-md font-medium text-gray-500 text-left px-2 py-1">Imported On</div></div>
                    <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">{orderDetail?.orderDate && DateTimeFormat(orderDetail?.orderDate).date + " " + DateTimeFormat(orderDetail?.orderDate).time}</div></div>
                </div>
                <div className="w-full flex mb-2 px-3 last:mb-0">
                    <div className="w-1/2 text-left"><div className="text-md font-medium text-gray-500 text-left px-2 py-1">Ordered On</div></div>
                    <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">{orderDetail?.orderDate && DateTimeFormat(orderDetail?.orderDate).date + " " + DateTimeFormat(orderDetail?.orderDate).time}</div></div>
                </div>
                <div className="w-full flex mb-2 px-3 last:mb-0">
                    <div className="w-1/2 text-left"><div className="text-md font-medium text-gray-500 text-left px-2 py-1">Channel</div></div>
                    <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">{orderDetail?.channel}</div></div>
                </div>
                <div className="w-full flex mb-4 last:mb-0 border-t border-b border-neatural-200">
                    <div className="w-1/2 text-left pl-3"><div className="text-md font-bold text-gray-500 text-left px-2 leading-10">Shipping Address</div></div>
                    <AddressModal title={'Shipping Address'} address={orderDetail?.shippingAddress} type="s" getOrderDetails={getOrderDetails} orderDetail={orderDetail} setDisplayMessage={setDisplayMessage} />
                </div>
                <div className="w-full flex px-3 mb-4 last:mb-0">
                    <div className="w-2/2 text-left">
                        <div className="text-md font-medium text-gray-500 text-left px-2 leading-6">
                            {orderDetail?.shippingAddress?.name}<br />
                            {orderDetail?.shippingAddress?.email ? <>{orderDetail?.shippingAddress?.email}<br /></> : ''}
                            {orderDetail?.shippingAddress?.address1}<br />
                            {orderDetail?.shippingAddress?.address2 && <>{orderDetail?.shippingAddress?.address2}<br /></>}
                            {orderDetail?.shippingAddress?.city}, {orderDetail?.shippingAddress?.state},{orderDetail?.shippingAddress?.country}, {orderDetail?.shippingAddress?.zipCode}<br />
                            {orderDetail?.shippingAddress?.phone}
                        </div>
                    </div>
                </div>
                <div className="w-full flex mb-4 last:mb-0 border-t border-b border-neatural-200">
                    <div className="w-1/2 text-left pl-3"><div className="text-md font-bold text-gray-500 text-left px-2 leading-10">Billing Address</div></div>
                    <AddressModal title={'Billing Address'} address={orderDetail?.billingAddress} type="b" getOrderDetails={getOrderDetails} orderDetail={orderDetail} setDisplayMessage={setDisplayMessage} />
                </div>
                <div className="w-full flex px-3 mb-4 last:mb-0">
                    <div className="w-2/2 text-left">
                        <div className="text-md font-medium text-gray-500 text-left px-2 leading-6">
                            {orderDetail?.billingAddress?.name}<br />
                            {orderDetail?.billingAddress?.email}<br />
                            {orderDetail?.billingAddress?.address1}<br />
                            {orderDetail?.billingAddress?.address2 && <>{orderDetail?.billingAddress?.address2}<br /></>}
                            {orderDetail?.billingAddress?.city}, {orderDetail?.billingAddress?.state},{orderDetail?.billingAddress?.country}, {orderDetail?.billingAddress?.zipCode}<br />
                            {orderDetail?.billingAddress?.phone}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const AddressModal = ({ title, GlobalLoading, address, type, getOrderDetails, orderDetail, setDisplayMessage }) => {
    const permission = useSelector(store => store?.permission);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const location = useSelector(store => store?.location)
    // const getEditData = useRef(null);
    const dropdown = useRef(null);
    const trigger = useRef(null);
    // close if the esc key is pressed

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!showModal || keyCode !== 27) return;
            setShowModal(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });
    const saveAddress = (values, { resetForm }) => {
        dispatch(setAddLoading(true));
        OrderService.updateAddress({ ...values, ...location }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(setAlertMessage({
                    type: "success",
                    message: response.data.data/* ValidationMsgs.order.shippingAddressUpdated */
                }));
                getOrderDetails();
            } else {
                dispatch(setAlertMessage({
                    type: "danger",
                    message: serverError(response)
                }));
            }
            setShowModal(prev => !prev);
            dispatch(setAddLoading(false));
        }).catch((error) => {
            dispatch(setAddLoading(false));
        })
    }
    const validationSchema = Yup.object({
        firstName: Yup.string().required(ValidationMsgs.common.firstNameRequired),
        lastName: Yup.string().required(ValidationMsgs.common.lastNameRequired),
        email: Yup.string().email(ValidationMsgs.common.Email),
        company: Yup.string().required(ValidationMsgs.customer.companyNameRequired),

        address1: Yup.string().required(ValidationMsgs.common.addressRequired),

        email: Yup.string().email(ValidationMsgs.common.Email).required(ValidationMsgs.user.emailRequired),
        phone: Yup.string().required(ValidationMsgs.common.phoneRequired).matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, ValidationMsgs.common.phoneMatches),
        city: Yup.string().required(ValidationMsgs.common.cityRequired),
        state: Yup.string().required(ValidationMsgs.common.stateRequired),
        country: Yup.string().required(ValidationMsgs.common.countryRequired),
        zipCode: Yup.string().required(ValidationMsgs.common.postalCodeRequired),
        fax: Yup.string().nullable().max(15, ValidationMsgs.common.faxLength),
        countryCode: Yup.string().nullable().max(3, ValidationMsgs.common.countryCodeLength)
    });
    useEffect(() => {
        setDisplayMessage(!showModal);
    }, [showModal]);

    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const getCountry = () => {
        CountryService.getCountryWithCode().then((response) => {
            if (response?.data?.success && response?.data?.data) {
                setCountry(() => {
                    return response?.data?.data?.map(value => {
                        return {
                            ...value,
                            label: value.name,
                            value: value.name,
                            countryCode: value.countryCode,
                        }
                    })
                });
            }
        }).catch(() => { });
    }

    const getState = (countryName) => {
        if (countryName) {
            StateService.getStateByCountryName(countryName).then((response) => {
                if (response?.data?.success && response?.data?.data) {
                    setState(() => {
                        return response?.data?.data?.map(value => {
                            return {
                                label: value.label,
                                value: value.label,
                            }
                        })
                    });
                }
            }).catch(() => { });
        } else {
            setState([]);
        }
    }
    useEffect(() => {
        getCountry();
    }, []);
    useEffect(() => {
        if (address?.country) {
            getState(address?.country);
        } else {
            setState([]);
        }
    }, [address?.country]);

    return (
        <div className="w-1/2 text-right pr-3">
            {(permission?.isEdit || permission?.isDelete) && <div className="text-md font-medium text-gray-500 text-right px-2">
                <span title='edit' aria-controls="basic-modal03"><span className="material-icons-outlined leading-10 cursor-pointer" ref={trigger} onClick={() => setShowModal(prev => !prev)}>edit</span></span>
            </div>}
            <Transition
                className="fixed inset-0 bg-slate-900 bg-opacity-30 z-40 transition-opacity"
                show={showModal}
                tag="div"
                enter="transition ease-out duration-100 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-100"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            />
            <Transition
                id="basic-modal03"
                className="fixed inset-0 z-40 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                role="dialog"
                aria-modal="true"
                show={showModal}
                enter="transition ease-in-out duration-200"
                enterStart="opacity-0 translate-y-4"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-in-out duration-200"
                leaveStart="opacity-100 translate-y-0"
                leaveEnd="opacity-0 translate-y-4"
            >
                <div className="bg-white rounded shadow-lg overflow-auto max-w-[767px] w-full max-h-full" ref={dropdown}>
                    <div className="px-5 py-3 border-b border-neutral-200">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-gray-800">{title}</div>
                            <button type="button" className="text-gray-400 hover:text-gray-500 cursor-pointer" onClick={() => setShowModal(prev => !prev)}>
                                <div className="sr-only" >Close</div>
                                <svg className="w-4 h-4 fill-current">
                                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            orderId: orderDetail?.orderNumber,
                            firstName: address?.firstName || '',
                            lastName: address?.lastName || '',
                            email: address?.email || '',
                            address1: address?.address1 || '',
                            address2: address?.address2 || '',
                            city: address?.city || '',
                            state: address?.state || '',
                            country: address?.country || '',
                            zipCode: address?.zipCode || '',
                            company: address?.company || '',
                            suite: address?.suite || '',
                            phone: address?.phone || '',
                            fax: address?.fax || '',
                            countryCode: address?.countryCode || '',
                            stateCode: address?.stateCode || '',
                            addressType: address?.addressType || '',
                            type: type
                        }}
                        onSubmit={saveAddress}
                        validationSchema={validationSchema}
                        validateOnMount={true}
                    >
                        {({ errors, setFieldValue, values }) => {
                            return (
                                <FormikForm>
                                    <Messages />
                                    <div className="px-5 pt-4 pb-1">
                                        <div className="text-sm flex flex-wrap justify-start text-left -mx-4">
                                            <div className="w-full p-4">
                                                <div className="grid grid-cols-12 gap-6">
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">First Name</label>
                                                        <Input
                                                            name={'firstName'}
                                                            type="text"
                                                            placeholder="First Name"
                                                        // defaultValue={values?.firstName}
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Last Name</label>
                                                        <Input
                                                            name={'lastName'}
                                                            type="text"
                                                            placeholder="Last Name"
                                                        // defaultValue={values?.lastName}
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Company Name <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input
                                                            name={'company'}
                                                            type="text"
                                                            placeholder="Company Name"
                                                        // defaultValue={values?.company}
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Email</label>
                                                        <Input
                                                            name={'email'}
                                                            type="text"
                                                            placeholder="Email"
                                                        // defaultValue={values?.email}
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Address 1 <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input
                                                            type="text"
                                                            name={'address1'}
                                                            placeholder="Address 01"
                                                        // defaultValue={values?.address1}
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Address 2</label>
                                                        <Input
                                                            name={'address2'}
                                                            type="text"
                                                            placeholder="Address 02"
                                                        // defaultValue={values?.address2}
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">City <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input
                                                            name={'city'}
                                                            type="text"
                                                            placeholder="City"
                                                        // defaultValue={values?.city}

                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Country <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        {/* <Input
                                                            name={'country'}
                                                            type="text"
                                                            placeholder="Country"
                                                        // defaultValue={values?.country}
                                                        /> */}
                                                        <Dropdown
                                                            options={country}
                                                            defaultValue={values?.country || ''}
                                                            name={`country`}
                                                            onChange={(e) => {
                                                                setFieldValue(`country`, (e ? e.value : ''));
                                                                setFieldValue(`countryCode`, e ? e?.countryCode : '');
                                                                getState(e?.value);
                                                                setFieldValue(`state`, '');
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Country Code</label>
                                                        <Input
                                                            name={'countryCode'}
                                                            disabled={true}
                                                            type="text"
                                                            placeholder="Country Code"
                                                        // defaultValue={values?.countryCode}
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">State <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        {/* <Input
                                                            name={'state'}
                                                            type="text"
                                                            placeholder="State"
                                                        // defaultValue={values?.state}
                                                        /> */}
                                                        <Dropdown
                                                            options={state}
                                                            defaultValue={values?.state || ''}
                                                            name={`state`}
                                                            onChange={(e) => {
                                                                setFieldValue(`state`, (e ? e.value : ''));
                                                            }}
                                                        />
                                                    </div>
                                                    {/* <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">State Code</label>
                                                        <Input
                                                            name={'stateCode'}
                                                            type="text"
                                                            placeholder="State Code"
                                                        // defaultValue={values?.stateCode}
                                                        />
                                                    </div> */}
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Postal Code <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input
                                                            name={'zipCode'}
                                                            type="text"
                                                            placeholder="Postal Code"
                                                        // defaultValue={values?.zipCode}
                                                        />
                                                    </div>


                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Phone</label>
                                                        <Input
                                                            name={'phone'}
                                                            type="text"
                                                            placeholder="000-000-0000"
                                                        // defaultValue={values?.phone}
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Fax</label>
                                                        <Input
                                                            name={'fax'}
                                                            type="text"
                                                            placeholder="000-000-0000"
                                                        // defaultValue={values?.fax}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-4">
                                        <div className="flex flex-wrap justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(prev => !prev)}
                                                className={`btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700`}
                                            >
                                                <div className={`w-full flex justify-center align-middle `}>
                                                    Cancel
                                                </div>
                                            </button>
                                            <SaveButton errors={errors}>Update</SaveButton>
                                            {/* <button
                                                className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                                            >
                                                <div className={`w-full flex justify-center align-middle `}>
                                                    
                                                </div>
                                            </button> */}
                                        </div>
                                    </div>
                                </FormikForm>
                            )
                        }}
                    </Formik>
                </div>
            </Transition >
        </div >

    )
}
export default CustomerInfo;

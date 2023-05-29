/*Component Name: PersonalInformation
Component Functional Details: User can create or update PersonalInformation master details from here.
Created By: Happy
Created Date: 11/10/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect, useCallback } from "react";
import { FieldArray, Form as FormikForm, Formik } from "formik";
import { Link, useParams } from "react-router-dom";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";
import Checkbox from "components/common/formComponent/Checkbox";
import { RecStatusValue, RecStatusValuebyName } from "global/Enum";
import DropdownService from "services/common/dropdown/DropdownService";
import CommonFields from "./CommonFields";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import CustomerService from "services/admin/customer/CustomerService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import OrderService from "services/admin/order/OrderService";
import { serverError } from "services/common/helper/Helper";
import { async } from "q";
import SaveButton from "components/common/formComponent/SaveButton";
import StoreCustomerService from "services/front/StoreCustomerService";

const PersonalInformation = ({ orderDetails, setCustomerOrderModal, CustomerOrderModal, customerData }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const [data, setData] = useState(customerData);
    useEffect(() => {
        setData(customerData);
    }, [customerData]);
    const [stores, setStores] = useState([]);
    const [shippingSameBilling, setShippingSameBilling] = useState(false);
    const [address, setAddress] = useState({ billing: {}, shipping: {} });
    const location = useSelector((store) => store?.location);
    useEffect(() => {
        DropdownService.getDropdownValues(
            "store"
        ).then((res) => {
            if (res.data.success) {
                setStores(() => {
                    return res.data.data;
                });
            }
        });
    }, [setStores]);


    const getAddress = useCallback((addressType) => {
        OrderService.getOrderAddress({
            orderId: orderDetails.orderNumber,
            addressType: addressType
        }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                setAddress((prev) => ({ ...prev, [(addressType == 'S' ? 'shipping' : 'billing')]: (response?.data?.data || {}) }));
            } else {
                dispatch(setAlertMessage({ message: ValidationMsgs.customer.addressNotFound, type: 'danger' }));
            }
        }).catch((error) => {
            dispatch(setAlertMessage({ message: ValidationMsgs.customer.addressNotFound, type: 'danger' }));
        });;
    }, [orderDetails]);

    useEffect(() => {
        if (orderDetails?.customerId) {
            getAddress('S');
            getAddress('B');
        }
    }, [orderDetails]);
    const validationSchema = Yup.object({
        firstname: Yup.string().required(ValidationMsgs.common.firstNameRequired),
        lastName: Yup.string().required(ValidationMsgs.common.lastNameRequired),
        storeId: Yup.string().required(ValidationMsgs.common.storeIdRequired),
        billing: Yup.object({
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
            fax: Yup.string().nullable().max(255, ValidationMsgs.common.faxLength),
            countryCode: Yup.string().nullable().max(3, ValidationMsgs.common.countryCodeLength)
        }),
        shipping: Yup.object({
            firstName: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.firstNameRequired) : Yup.string()),
            lastName: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.lastNameRequired) : Yup.string()),
            email: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().email(ValidationMsgs.common.Email).required(ValidationMsgs.user.emailRequired) : Yup.string()),
            company: Yup.string().required(ValidationMsgs.customer.companyNameRequired),
            address1: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.addressRequired) : Yup.string()),
            phone: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.phoneRequired).matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, ValidationMsgs.common.phoneMatches) : Yup.string()),
            city: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.cityRequired) : Yup.string()),
            state: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.stateRequired) : Yup.string()),
            country: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.countryRequired) : Yup.string()),
            zipCode: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.postalCodeRequired) : Yup.string()),
            fax: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().nullable().max(15, ValidationMsgs.common.faxLength) : Yup.string()),
            countryCode: Yup.string().when('addressType', (addressType, schema) => (!shippingSameBilling) ? Yup.string().nullable().max(3, ValidationMsgs.common.countryCodeLength) : Yup.string())
        })
    });
    const onSubmit = async (values, { resetForm }) => {
        updateCustomerInfo({ ...values, customerAddress: undefined });
    }
    const updateCustomerInfo = (values) => {
        dispatch(setAddLoading(true));
        CustomerService.updateCustomer({
            customerModel: { ...values, ...location }
        }).then((response) => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.customer.updated,
                    })
                );
                updateBillingAddress(values);
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            dispatch(setAddLoading(false));
        }).catch((errors) => {
            dispatch(
                setAlertMessage({
                    type: "danger",
                    message: ValidationMsgs.customer.notUpdated,
                })
            );
            dispatch(setAddLoading(false));
        });
    }
    const updateBillingAddress = (values) => {
        dispatch(setAddLoading(true));
        OrderService.updateAddress({ ...values.billing, ...location }).then((response) => {
            if (response.data.success && response.data.data) {
                getAddress('B');
                updateShippingAddress((shippingSameBilling ? { ...values.billing, addressType: 'S' } : values.shipping))
            } else {
                dispatch(setAlertMessage({
                    type: "danger",
                    message: serverError(response)
                }));
            }
            dispatch(setAddLoading(false));
        }).catch((error) => {
            dispatch(setAddLoading(false));
        })
    }
    const updateShippingAddress = (values) => {
        dispatch(setAddLoading(true));
        OrderService.updateAddress({ ...values, ...location }).then((response) => {
            if (response.data.success && response.data.data) {
                getAddress('S');
            } else {
                dispatch(setAlertMessage({
                    type: "danger",
                    message: serverError(response)
                }));
            }
            dispatch(setAddLoading(false));
        }).catch((error) => {
            dispatch(setAddLoading(false));
        })
    }
    const resetPassword = () => {
        dispatch(setAddLoading(true));
        StoreCustomerService.sendResetPasswordLink(orderDetails?.storeId, data?.email).then((response) => {
            if (response?.data?.data?.issend) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.customer.resetPasswordLink,
                    type: 'success'
                }));
            } else {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.customer.resetPasswordLinkNotSend,
                    type: 'danger'
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));

        })
    }
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    id: data?.id || 0,
                    storeId: data?.storeId || "",
                    firstname: data?.firstname || "",
                    lastName: data?.lastName || "",
                    email: data?.email || "",
                    companyName: data?.companyName || "",
                    tierId: data?.tierId || 0,
                    isRegistered: true,
                    sharedCustomerId: 0,
                    isLocked: false,
                    navCustomerId: data?.navCustomerId || "",
                    customerType: "credit",
                    isTaxableuser: false,
                    recStatus: RecStatusValuebyName.Active,
                    rowVersion: data?.rowVersion || "",
                    billing: {
                        // ...address.billing,
                        firstName: address?.billing?.firstName || "",
                        lastName: address?.billing?.lastName || "",
                        name: address?.billing?.name || "",
                        email: address?.billing?.email || "",
                        address1: address?.billing?.address1 || "",
                        address2: address?.billing?.address2 || "",
                        city: address?.billing?.city || "",
                        state: address?.billing?.state || "",
                        country: address?.billing?.country || "",
                        zipCode: address?.billing?.zipCode || "",
                        company: address?.billing?.company || "",
                        suite: address?.billing?.suite || "",
                        phone: address?.billing?.phone || "",
                        fax: address?.billing?.fax || "",
                        countryCode: address?.billing?.countryCode || "",
                        stateCode: address?.billing?.stateCode || "",
                        addressType: address?.billing?.addressType || "B",
                        ...location,
                        orderId: orderDetails?.orderNumber,
                    },
                    shipping: {
                        firstName: address?.shipping?.firstName || "",
                        lastName: address?.shipping?.lastName || "",
                        name: address?.shipping?.name || "",
                        email: address?.shipping?.email || "",
                        address1: address?.shipping?.address1 || "",
                        address2: address?.shipping?.address2 || "",
                        city: address?.shipping?.city || "",
                        state: address?.shipping?.state || "",
                        country: address?.shipping?.country || "",
                        zipCode: address?.shipping?.zipCode || "",
                        company: address?.shipping?.company || "",
                        suite: address?.shipping?.suite || "",
                        phone: address?.shipping?.phone || "",
                        fax: address?.shipping?.fax || "",
                        countryCode: address?.shipping?.countryCode || "",
                        stateCode: address?.shipping?.stateCode || "",
                        addressType: address?.shipping?.addressType || "S",
                        ...location,
                        orderId: orderDetails?.orderNumber,
                    },
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                validateOnMount={true}
            >
                {({ setFieldValue, errors, values, setValues, resetForm }) => {
                    // console.log(values.shipping.email, address?.shipping?.email, 'pkk');
                    return (
                        <FormikForm>
                            <div className="w-full">
                                <div className="p-6 border-b-2 border-slate-200 last:border-b-0">
                                    <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">Security Info</div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                            {"Store"}
                                            <span className="text-rose-500 text-lg leading-none">
                                                *
                                            </span>

                                            <Dropdown
                                                defaultValue={values.storeId}
                                                name={"storeId"}
                                                options={stores}
                                                onChange={(data) => {
                                                    if (data) {
                                                        setFieldValue("storeId", data.value);
                                                    } else {
                                                        setFieldValue("storeId", '');
                                                    }
                                                    // getTier(data.value);
                                                }}
                                            />
                                        </div>
                                        <div className="block uppercase tracking-wide text-gray-500 text-xs  mb-2">
                                            {"Email"}
                                            <Input type="text" name="email" />
                                        </div>
                                        <div className="block uppercase tracking-wide text-gray-500 text-xs  mb-2">
                                            {"First Name"}
                                            <span className="text-rose-500 text-lg leading-none">
                                                *
                                            </span>

                                            <Input type="text" name="firstname" />
                                        </div>
                                        <div className="block uppercase tracking-wide text-gray-500 text-xs  mb-2">
                                            {"Last Name"}
                                            <span className="text-rose-500 text-lg leading-none">
                                                *
                                            </span>

                                            <Input type="text" name="lastName" />
                                        </div>

                                        {/* <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                            {"Password"}
                                            <span className="text-rose-500 text-lg leading-none">
                                                *
                                            </span>
                                            <Input type="password" name="password" />
                                        </div> */}
                                    </div>
                                    {(permission?.isEdit || permission?.isDelete) && <div className=""><span className="text-sm text-indigo-500 cursor-pointer" onClick={resetPassword}>Reset password</span></div>}
                                </div>
                                {/* //billing */}
                                <div className="p-6 border-b-2 border-slate-200 last:border-b-0" >
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold">Billing Info</div>

                                    </div>
                                    <CommonFields
                                        addressType={'billing'}
                                        values={values.billing}
                                    />
                                </div>
                                {/* shipping */}
                                <div className="p-6 border-b-2 border-slate-200 last:border-b-0" >
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold">{'Shipping Info'} </div>
                                        <div className="flex items-center gap-1">
                                            <label className={"flex items-center"}>
                                                <Checkbox
                                                    name={"same_ship"}
                                                    onChange={(e) => {
                                                        setShippingSameBilling(e.target.checked);
                                                    }}
                                                    checked={shippingSameBilling}
                                                    className={"form-checkbox ml-2"}
                                                />
                                                <span className={"text-sm font-medium"}>{"Same as billing address"}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className={shippingSameBilling ? 'hidden' : ''}>
                                        <CommonFields
                                            addressType={'shipping'}
                                            values={values.shipping}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end pt-2 pb-5 pr-3 space-x-2 border-t border-gray-200 sticky bottom-0 bg-white">
                                <button data-modal-toggle="customerModal" type="button" className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={() => { resetForm(); setCustomerOrderModal(false) }}>Cancel</button>
                                {(permission?.isEdit || permission?.isDelete) && <>
                                    <SaveButton errors={errors} >Save</SaveButton>
                                    <button type="button" disabled={true} className="btn bg-indigo-600 text-white">Search From NAV</button>
                                    <button type="button" disabled={true} className="btn bg-indigo-600 text-white">Create in NAV</button>
                                </>}
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

export default PersonalInformation;

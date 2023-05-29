/*Component Name: PaymentOption
Component Functional Details: User can create or update PaymentOption master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import ToggleButton from 'components/common/formComponent/ToggleButton';
import React from 'react';
import { FieldArray, Form as FormikForm, Formik } from "formik";
import { Link, useParams } from "react-router-dom";
import * as Yup from "yup";
import Input from 'components/common/formComponent/Input';
import InputNumber from 'components/common/formComponent/InputNumber';
import { ValidationMsgs } from 'global/ValidationMessages';
import { useSelector } from 'react-redux';
import OrderService from 'services/admin/order/OrderService';
import { useState } from 'react';
import { useEffect } from 'react';
import CustomerService from 'services/admin/customer/CustomerService';
import { useDispatch } from 'react-redux';
import { serverError } from 'services/common/helper/Helper';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import SaveButton from 'components/common/formComponent/SaveButton';
const PaymentOption = ({ orderDetails, setCustomerOrderModal, CustomerOrderModal }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const [paymentInfo, setPaymentInfo] = useState({});
    const [poInformation, setPoInformation] = useState({});
    const onSubmit = (values, { resetForm }) => {
        dispatch(setAddLoading(true));
        CustomerService.createPO({
            customerPONumberModel: {
                ...values,
                ...location
            }
        }).then((response) => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.customer.poCreated,
                    })
                );
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            dispatch(setAddLoading(false));
        })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.customer.poNotCreated,
                    })
                );
                dispatch(setAddLoading(false));
            });
    }
    const validationSchema = Yup.object({
        poNumber: Yup.string().when("isGeneralPo", {
            is: false,
            then: Yup.string().required(ValidationMsgs.customer.poNumberRequired)
        }),
        amount: Yup.string(ValidationMsgs.customer.notValidAmount).when("isGeneralPo", {
            is: false,
            then: Yup.string(ValidationMsgs.customer.notValidAmount).required(ValidationMsgs.customer.amount)
        }),
    });
    const getPaymentInfo = () => {
        OrderService.getOrderPaymentInfo(orderDetails?.orderNumber,).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                setPaymentInfo(response.data.data);
            }
        }).catch(() => { });
        CustomerService.getCustomerCreditCardsById(orderDetails?.customerId, orderDetails?.orderNumber).then((response) => {
            if (response?.data?.success && response?.data?.data?.poDetail) {
                setPoInformation(response.data.data.poDetail);
            }
        }).catch(() => { });
    }
    useEffect(() => {
        if (orderDetails?.orderNumber) {
            getPaymentInfo();
        }
    }, [orderDetails]);
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    id: 0,
                    customerId: poInformation?.customerId || orderDetails?.customerId,
                    isGeneralPo: poInformation ? poInformation?.isGeneralPo : true,
                    poNumber: poInformation?.poNumber || "",
                    amount: poInformation?.amount || 0,
                    recStatus: poInformation?.recStatus || "A",
                    rowVersion: poInformation?.rowVersion || "",
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({ setFieldValue, errors, values }) => {
                    return (
                        <FormikForm>
                            <div className="p-6 border-b-2 border-slate-200 last:border-b-0 pt-6">
                                <div className="block uppercase tracking-wide text-gray-500 text-base font-bold">Credit card information</div>
                                <div className="grid grid-cols-12 gap-4 p-6 pt-4">
                                    <div className="col-span-12 md:col-span-6">
                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="">Name on card <span className="text-rose-500 text-lg leading-none">*</span></label>
                                        <div className="">{paymentInfo?.nameOnCard || 'xxxx xxxx'}</div>
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="">Card number <span className="text-rose-500 text-lg leading-none">*</span></label>
                                        <div className="">xxxx xxxx xxxx {paymentInfo?.cardNumber?.substr(-4) || 'xxxx'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-b-2 border-slate-200 last:border-b-0 pt-6">
                                <div className="w-full text-base font-bold mb-4">PO Information</div>
                                <div className="grid grid-cols-12 gap-4 p-6 pt-4" >
                                    <div className="col-span-12">
                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">General PO <span className="text-rose-500 text-lg leading-none"></span></label>
                                        <div className="flex items-center">
                                            <div className="w-16 relative">
                                                <input type="checkbox" id="default-bill-1" className="sr-only" />
                                                <ToggleButton
                                                    id={"isGeneralPo"}
                                                    name={"isGeneralPo"}
                                                    defaultValue={values.isGeneralPo}
                                                    onChange={(e) => {
                                                        setFieldValue('isGeneralPo', e.target.checked)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {!values.isGeneralPo && <>
                                        <div className="col-span-12 md:col-span-6" >
                                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">PO Number <span className="text-rose-500 text-lg leading-none">*</span></label>
                                            <Input name={'poNumber'} type="text" />
                                        </div>
                                        <div className="col-span-12 md:col-span-6" >
                                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Amount <span className="text-rose-500 text-lg leading-none">*</span></label>
                                            <InputNumber value={values.amount} name={'amount'} displayError={true} onChange={(e) => {
                                                setFieldValue('amount', e.target.value);
                                            }} />
                                        </div>

                                    </>}
                                </div>
                                <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200">
                                    <button type="button" className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700">Cancel</button>
                                    {(permission?.isEdit || permission?.isDelete) && <SaveButton errors={errors} >Save</SaveButton>}
                                    {/* <button type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Save</button> */}
                                </div>
                            </div>

                        </FormikForm>
                    )
                }}
            </Formik>
        </>
    );
};

export default PaymentOption;

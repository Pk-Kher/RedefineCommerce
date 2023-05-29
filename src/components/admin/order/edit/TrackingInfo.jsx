/*Component Name: TrackingInfo
Component Functional Details:  TrackingInfo .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import DatePicker from 'components/common/formComponent/DatePicker';
import Input from 'components/common/formComponent/Input';
import { useSelector } from "react-redux";
import { Form as FormikForm, Formik } from "formik";
import * as Yup from "yup";
import { ValidationMsgs } from 'global/ValidationMessages';
import { ShippedVia } from 'global/Enum';
import Dropdown from 'components/common/formComponent/Dropdown';
import OrderService from 'services/admin/order/OrderService';
import { useDispatch } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
import { useEffect } from 'react';
import SaveButton from 'components/common/formComponent/SaveButton';

const TrackingInfo = ({ orderDetail, getOrderDetails }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const location = useSelector(store => store?.location);
    const [shippingOptions, setShippingOptions] = useState([]);
    useEffect(() => {
        if (orderDetail?.orderNumber) {
            OrderService.getShippingOptionsByStore(orderDetail?.orderNumber).then(response => {
                if (response?.data?.success && response?.data?.data) {
                    setShippingOptions(response?.data?.data);
                }
            }).catch(() => {

            })
        }
    }, [orderDetail]);
    const onSubmit = (values, { resetForm }, isSendEmail = false) => {
        dispatch(setAddLoading(true));
        OrderService.updateTrackingInfo({ ...values, isSendEmail, ...location }).then((response) => {
            if (response.data.success) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.trackingStored,
                    type: 'success'
                }));
                getOrderDetails();
            } else {
                dispatch(setAlertMessage({
                    message: serverError(response),
                    type: 'danger'
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAlertMessage({
                message: ValidationMsgs.order.trackingNotStored,
                type: 'danger'
            }))
        })
    }
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    trackingNumber: orderDetail?.shippingTackingNumber || "",
                    orderId: orderDetail?.orderNumber || '',
                    shippingDate: orderDetail?.shippedOn || '',
                    shippingVia: orderDetail?.shippedVIA || '',
                }}
                onSubmit={onSubmit}
                validationSchema={Yup.object().shape({
                    trackingNumber: Yup.string().required(ValidationMsgs.order.trackingNo),
                    shippingDate: Yup.string().required(ValidationMsgs.order.shippingDate),
                    shippingVia: Yup.string().required(ValidationMsgs.order.shippedVIA),
                })}
                validateOnMount={true}
            >
                {({ setFieldValue, errors, values, resetForm }) => {
                    return (
                        <FormikForm>
                            <div className="w-full justify-between bg-white px-6 py-6 rounded-md shadow-lg">
                                <div className="w-full flex mb-2 last:mb-0">
                                    <div className="w-2/2 text-left mb-2"><div className="text-lg font-bold text-gray-500 text-left leading-10">Tracking Info</div></div>
                                </div>
                                <div className="w-full mb-4 last:mb-0">
                                    <div className="text-md font-medium text-gray-500 text-left mb-2">Tracking #</div>
                                    <div className="text-md font-medium text-gray-500 text-left"><span className="text-indigo-500 cursor-pointer">{orderDetail?.shippingTackingNumber || ''}</span></div>
                                </div>
                                {<>
                                    <div className="w-full mb-4 last:mb-0">
                                        <div className="text-md font-medium text-gray-500 text-left mb-2">Tracking #</div>
                                        <div className="text-md font-medium text-gray-500 text-left">
                                            <Input name={'trackingNumber'} type="text" className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`} />
                                        </div>
                                    </div>
                                    <div className="w-full mb-4 last:mb-0">
                                        <div className="text-md font-medium text-gray-500 text-left mb-2">Shipped Via</div>
                                        <div className="text-md font-medium text-gray-500 text-left">
                                            <Dropdown name={'shippingVia'} options={shippingOptions} defaultValue={values.shippingVia} onChange={(e) => {
                                                setFieldValue('shippingVia', e.value);
                                            }} />
                                        </div>
                                    </div>
                                    <div className="w-full mb-4 last:mb-0">
                                        <div className="text-md font-medium text-gray-500 text-left mb-2">Shipped on</div>
                                        <div className="text-md font-medium text-gray-500 text-left">
                                            <DatePicker name="shippingDate" defaultValue={values?.shippingDate} />
                                        </div>
                                    </div>
                                    <div className="w-full mb-4 last:mb-0">
                                        <div className="flex flex-wrap gap-2">
                                            {(permission?.isEdit || permission?.isDelete) && <>
                                                <SaveButton errors={errors}>Update</SaveButton>
                                                <SaveButton type='button'
                                                    onClick={() => {
                                                        if (Object.keys(values).length <= 0) {
                                                            onSubmit(values, { resetForm }, true);
                                                        } else {
                                                            dispatch(setAlertMessage({ type: "danger", message: serverError({ data: { errors: errors } }) }));
                                                        }
                                                    }}
                                                    className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer`}>
                                                    <div className={`w-full flex justify-center align-middle `}>
                                                        Update
                                                        &amp; Send Email
                                                    </div>
                                                </SaveButton>
                                            </>}
                                        </div>
                                    </div>
                                </>}
                            </div>
                        </FormikForm>
                    )
                }}
            </Formik>
        </>
    );
};

export default TrackingInfo;

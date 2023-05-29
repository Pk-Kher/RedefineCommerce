/*Component Name: Status
Component Functional Details:  Status .
Created By: PK Kher
Created Date: \7-25-2022
Modified By: PK Kher
Modified Date: 7-25-2022 */

import React, { useEffect, useState } from 'react';
import { orderStatus } from "global/Enum"
import Select from 'components/common/formComponent/Select';
import OrderService from 'services/admin/order/OrderService';
import { ValidationMsgs } from 'global/ValidationMessages';
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import { serverError } from 'services/common/helper/Helper';
import { useSelector } from 'react-redux';
const Status = ({ orderDetail, getOrderDetails }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const location = useSelector(store => store.location);
    const [orderStatusValue, setOrderStatusValue] = useState('');
    useEffect(() => {
        setOrderStatusValue(orderDetail.orderStatus);
    }, [orderDetail])
    useEffect(() => {
        if (orderDetail?.orderStatus) {
            setOrderStatusValue(orderDetail.orderStatus);
        }
    }, [orderDetail]);
    const updateStatus = (value) => {
        dispatch(setAddLoading(true));
        OrderService.updateOrderStatus({
            orderId: orderDetail.orderNumber,
            orderStatus: value,
            ...location
        }).then((response) => {
            if (response?.data?.success) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.statusUpdated,
                    type: 'success'
                }));
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            getOrderDetails();
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
            dispatch(setAlertMessage({
                message: ValidationMsgs.order.statusNotUpdated,
                type: 'success'
            }));
        })
    }
    return (
        <>
            <div className="w-full justify-between bg-white px-3 py-3 rounded-md shadow-lg">
                <div className="w-full mb-2 last:mb-0">
                    <div className="text-lg font-bold text-gray-500 text-left px-2 leading-10">Order Status</div>
                </div>
                <div className="w-full mb-2 px-2">
                    <Select options={orderStatus} name='orderStatus' defaultValue={orderStatusValue} onChange={(e) => {
                        setOrderStatusValue(e.value);
                        updateStatus(e.value);
                    }}
                        isDisabled={!permission?.isEdit && !permission?.isDelete}
                    />
                </div>
            </div>
        </>
    );
};

export default Status;

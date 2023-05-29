/*Component Name: Action
Component Functional Details:  Action .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import { ValidationMsgs } from 'global/ValidationMessages';
import { useCallback } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import OrderService from 'services/admin/order/OrderService';
import { serverError } from 'services/common/helper/Helper';
import Transition from 'utils/Transition';
import OldOrders from './OldOrders';

const OrderAction = ({ getOrderDetails, orderDetail }) => {
    const permission = useSelector(store => store?.permission);
    const editDeletePerm = (permission?.isEdit || permission?.isDelete);
    const location = useSelector(store => store.location);
    const user = useSelector(store => store.user);
    const [orderModal, setOrderModal] = useState(false);
    const dispatch = useDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { id } = useParams();
    const trigger = useRef(null);
    const dropdown = useRef(null);
    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });
    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    const review = useCallback(() => {
        setDropdownOpen(false);
        dispatch(setAddLoading(true));
        OrderService.reviewOrder({
            orderId: id,
            ...location
        }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.reviewMailSend,
                    type: 'success'
                }));
            } else {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.reviewMailNotSend,
                    type: 'danger'
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAlertMessage({
                message: ValidationMsgs.order.reviewMailNotSend,
                type: 'danger'
            }));
            dispatch(setAddLoading(false));

        });
    }, [id, location]);
    const duplicate = useCallback(() => {
        setDropdownOpen(false);
        dispatch(setAddLoading(true));
        OrderService.duplicateOrder({
            orderId: id,
            userId: user.id,
            ...location
        }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.duplicateOrder,
                    type: 'success'
                }))
                getOrderDetails();
            } else {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.orderNotDuplicate,
                    type: 'danger'
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAlertMessage({
                message: ValidationMsgs.order.orderNotDuplicate,
                type: 'danger'
            }));
            dispatch(setAddLoading(false));

        });
    }, [id, location, user]);
    const fraud = useCallback(() => {
        setDropdownOpen(false);
        dispatch(setAddLoading(true));
        OrderService.orderFraud({
            orderId: id,
            isFraudStatus: true,
            ...location
        }).then((response) => {
            if (response?.data?.success) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.fraud,
                    type: 'success'
                }));
            } else {
                dispatch(setAlertMessage({
                    message: serverError(response),
                    type: 'danger'
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
            dispatch(setAlertMessage({
                message: ValidationMsgs.order.statusNotChange,
                type: 'danger'
            }));
        });
    }, [id, location]);
    const blockOrderIP = useCallback(() => {
        setDropdownOpen(false);
        dispatch(setAddLoading(true));
        OrderService.blockOrderIP({
            orderId: id,
            isBlockIP: true,
            ...location
        }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.orderIPBlocked,
                    type: 'success'
                }));
            } else {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.orderIPNotBlocked,
                    type: 'danger'
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAlertMessage({
                message: ValidationMsgs.order.orderIPBlocked,
                type: 'danger'
            }));
            dispatch(setAddLoading(false));

        });
    }, [id, location]);
    const cancelOrder = useCallback(() => {
        setDropdownOpen(false);
        dispatch(setAddLoading(true));
        OrderService.cancelOrder({
            orderId: id,
            isCancelStatus: true,
            ...location
        }).then((response) => {
            console.log(response.data);
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));

        });
    }, [id, location]);
    return (
        <>
            <div className="relative inline-flex" x-data="{ open: false }">
                <button ref={trigger} type='button' onClick={() => setDropdownOpen(prev => !prev)} className="flex flex-wrap items-center text-sm text-indigo-500" aria-haspopup="true" aria-expanded="false">
                    <span >More action</span> <span className="material-icons-outlined">expand_more</span>
                </button>
                <Transition
                    show={dropdownOpen}
                    tag="div"
                    className="origin-top-left z-10 absolute top-full right-0 min-w-72 bg-white border border-neutral-200 pt-1.5 rounded shadow-lg overflow-hidden mt-1"
                    enter="transition ease-out duration-100 transform"
                    enterStart="opacity-0 -translate-y-2"
                    enterEnd="opacity-100 translate-y-0"
                    leave="transition ease-out duration-100"
                    leaveStart="opacity-100"
                    leaveEnd="opacity-0"
                >
                    <ul className="my-2 mx-1 text-sm" ref={dropdown}>
                        {editDeletePerm && <li className="py-2 px-3 cursor-pointer" onClick={review}>
                            <span className="flex items-center text-indigo-500"><span className="material-icons-outlined">preview</span><span className="ml-2">Review</span></span>
                        </li>}
                        <li className="py-2 px-3 cursor-pointer" onClick={() => setOrderModal(true)}>
                            <span className="flex items-center text-indigo-500"><span className="material-icons-outlined">visibility</span><span className="ml-2">View Old Orders</span></span>
                        </li>
                        {editDeletePerm && <li className="py-2 px-3 cursor-pointer" onClick={duplicate}>
                            <span className="flex items-center text-indigo-500"><span className="material-icons-outlined">content_copy</span><span className="ml-2">Duplicate</span></span>
                        </li>}
                        {(editDeletePerm && orderDetail?.paymentStatus !== 'Fraud') && <li className="py-2 px-3 cursor-pointer" onClick={fraud}>
                            <span className="flex items-center text-indigo-500"><span className="material-icons-outlined">no_accounts</span><span className="ml-2">Fraud</span></span>
                        </li>}
                        <li className={`py-2 px-3 ${editDeletePerm ? 'cursor-pointer' : ''}`} onClick={editDeletePerm ? blockOrderIP : () => { }}>
                            <div className='flex justify-between'>
                                <span className={`flex items-center ${editDeletePerm ? 'text-indigo-500' : 'text-indigo-300'}`}>
                                    <span className="material-icons-outlined">desktop_access_disabled</span>
                                    <span className="ml-2">Block IP</span>
                                </span>
                                {orderDetail?.isBlockIpAddress && <span className="material-icons-outlined text-green-500">done</span>}
                            </div>
                        </li>
                        {((permission?.isDelete) && orderDetail?.fulfillmentStatus !== 'Cancelled') && <li className="py-2 px-3 cursor-pointer" onClick={cancelOrder}>
                            <span className="flex items-center text-indigo-500"><span className="material-icons-outlined">close</span><span className="ml-2">Cancel Order</span></span>
                        </li>}
                    </ul>
                </Transition>
                <OldOrders orderDetails={orderDetail} OrderModal={orderModal} setOrderModal={setOrderModal} />
            </div>
        </>
    );
};

export default OrderAction;

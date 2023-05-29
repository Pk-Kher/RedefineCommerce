/*Component Name: Create
Component Functional Details:  Create .
Created By: PK Kher
Created Date: 7-22-2022
Modified By: PK Kher
Modified Date: 7-22-2022 */

import React, { useState, useEffect } from 'react';
import Invoice from './invoice/Invoice';
import Items from './Items/Items';
import Log from './Log';
import OrderAction from './OrderAction';
import Timeline from './Timeline';

import CustomerInfo from './CustomerInfo';
import TrackingInfo from './TrackingInfo';
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import OrderService from 'services/admin/order/OrderService';
import DropdownStatus from './Status';
import Status from 'components/common/displayStatus/Status';
import { DateTimeFormat } from 'services/common/helper/Helper';
import Note from './Note';
import { orderNotes } from 'global/Enum';
import UploadDocument from './UploadDocument';
import Tag from './Tag';
import Image from 'components/common/formComponent/Image';
import { ValidationMsgs } from 'global/ValidationMessages';
import GeneralStatus from 'components/common/displayStatus/General';


const Create = ({ statusList }) => {
    const location = useSelector((store) => store?.location);
    const [orderDetail, setOrderDetail] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    const isAddMode = !id;
    const dispatch = useDispatch();
    const [displayMessage, setDisplayMessage] = useState(true);
    const [formValues, setFormValues] = useState({
        brandIdList: '',
        storeIdList: "",
    });
    useEffect(() => {
        if (!isAddMode) {
            getOrderDetails();
        }
    }, [id]);
    const getOrderDetails = () => {
        dispatch(setAddLoading(true));
        OrderService.getOrderDetails({
            orderNumber: id,
            ...location
        }).then((response) => {
            if (response?.data?.success && response.data.data) {
                setOrderDetail(response.data.data);
            } else {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.orderNotFound,
                    type: 'danger'
                }));
                navigate('/admin/Order/orders');
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        })
    }
    return (
        <>
            <title>Order Receipt</title>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full'>
                <div className='sm:flex sm:justify-between mb-8 sm:flex-wrap sm:items-start'>
                    <div c0lass="flex mb-4 sm:mb-0 grow">
                        <NavLink to={'/admin/order/orders'} className="inline-flex btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 items-center mr-2"> <span className="material-icons-outlined">west</span> </NavLink>
                        <div className="inline-flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold inline-flex">Orders: #{orderDetail?.orderNumber}</h1>
                            <div >Ref # : {orderDetail?.refenceOrderID}</div>
                            Fulfillment:<GeneralStatus type={orderDetail?.fulfillmentStatus} style={{ backgroundColor: `${statusList?.['fulfillmentstatus']?.[orderDetail?.fulfillmentStatus?.toLowerCase()]?.color}`, color: `${statusList?.['fulfillmentstatus']?.[orderDetail?.fulfillmentStatus?.toLowerCase()]?.textColor}` }} />
                            Payment: <GeneralStatus type={orderDetail?.paymentStatus} style={{ backgroundColor: `${statusList?.['paymentstatus']?.[orderDetail?.paymentStatus?.toLowerCase()]?.color}`, color: `${statusList?.['paymentstatus']?.[orderDetail?.paymentStatus?.toLowerCase()]?.textColor}` }} />
                        </div>
                        <div className="text-sm text-gray-500 flex items-center pl-16 pt-2">
                            <div >{orderDetail?.orderDate ? DateTimeFormat(orderDetail?.orderDate).date + " " + DateTimeFormat(orderDetail?.orderDate).time : ''}</div>&nbsp;from
                            <div className="flex justify-center items-center h-10 border mx-1">
                                <img src={process.env.REACT_APP_API_BLOB + orderDetail?.storeLogo} alt="No Image" className={`w-12 text-center`} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center gap-4 mr-4">
                            <OrderAction orderDetail={orderDetail} getOrderDetails={getOrderDetails} />
                        </div>
                        <div className="inline-flex rounded-md shadow-sm -space-x-1" role="group">
                            <div className="relative inline-flex">
                                <button type='button' onClick={() => {
                                    if (orderDetail?.previousOrderId) {
                                        navigate(`/admin/Order/orders/edit/${orderDetail?.previousOrderId}`);
                                    }
                                }} className={`flex flex-wrap items-center text-sm px-3 py-2 bg-white border rounded-r-md ${orderDetail?.previousOrderId ? 'border-neutral-200 text-gray-500 hover:text-gray-700' : 'border-neutral-100 text-gray-200 cursor-default'}`}>
                                    <span className="material-icons-outlined">west</span>
                                </button>
                            </div>
                            <div className="relative inline-flex">
                                <button onClick={() => {
                                    if (orderDetail?.nextOrderId) {
                                        navigate(`/admin/Order/orders/edit/${orderDetail?.nextOrderId}`);
                                    }
                                }} type='button' className={`flex flex-wrap items-center text-sm px-3 py-2 bg-white border rounded-r-md ${orderDetail?.nextOrderId ? 'border-neutral-200 text-gray-500 hover:text-gray-700' : 'border-neutral-100 text-gray-200 cursor-default'}`}>
                                    <span className="material-icons-outlined">east</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {displayMessage && <Messages />}
                <div className="flex flex-col md:flex-row md:-mr-px text-sm relative">
                    <div className='w-full h-full'>
                        <div className='grid grid-cols-12 gap-6'>
                            <div className="overflow-x-auto col-span-full lg:col-span-9">
                                <div className='flex flex-wrap'>
                                    <div className="w-full bg-white shadow-lg rounded-md px-2 py-2 mb-6">
                                        <div className='w-full justify-between px-2 mb-8'>
                                            <div className="flex justify-between flex-wrap items-center px-2 border-b border-neutral-200">
                                                <div className="flex text-left items-center">
                                                    <span className="text-lg font-bold text-gray-500 text-left leading-10">Line Items</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex max-h-screen'>
                                            <Items orderDetail={orderDetail} setDisplayMessage={setDisplayMessage} />
                                        </div>
                                    </div>
                                    <Invoice orderDetail={orderDetail} />
                                    <Timeline orderDetail={orderDetail} />
                                    <div className="w-full bg-white shadow-lg rounded-md px-2 py-2 mb-6">
                                        <div className="flex px-2 border-b border-neutral-200 justify-between items-center">
                                            <div className="text-lg font-bold text-gray-500 text-left leading-10">Order Log</div>
                                        </div>
                                        <div className='flex overflow-x-auto max-h-screen'>
                                            <Log orderDetail={orderDetail} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full sm:col-span-3 lg:col-span-3">
                                <div className='w-full grid grid-cols-1 gap-6'>
                                    <DropdownStatus orderDetail={orderDetail} getOrderDetails={getOrderDetails} />
                                    <CustomerInfo orderDetail={orderDetail} getOrderDetails={getOrderDetails} setDisplayMessage={setDisplayMessage} />
                                    <TrackingInfo orderDetail={orderDetail} getOrderDetails={getOrderDetails} />
                                    <Note orderDetail={orderDetail} title="Order Note" note={orderDetail.orderNotes} type={orderNotes.order} />
                                    <Note orderDetail={orderDetail} title="Internal Note" note={orderDetail.internalNotes} type={orderNotes.Internal} />
                                    <Note orderDetail={orderDetail} title="Shipped Note" note={orderDetail.shippedNotes} type={orderNotes.shipped} />
                                    <UploadDocument orderDetail={orderDetail} />
                                    <Tag orderDetail={orderDetail} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div >
        </>
    );
};

export default Create;

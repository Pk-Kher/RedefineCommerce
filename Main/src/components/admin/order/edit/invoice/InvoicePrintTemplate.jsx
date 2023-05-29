/*Component Name: InvoicePrintTemplate
Component Functional Details:  InvoicePrintTemplate .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import Image from 'components/common/formComponent/Image';
import { CurrencySymbolByCode } from 'global/Enum';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import OrderService from 'services/admin/order/OrderService';
import { DateTimeFormat } from 'services/common/helper/Helper';
import Prices from './Prices';
import "assets/css/tailwind/admin/index.css";
import { useDispatch, useSelector } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
const InvoicePrintTemplate = () => {
    const location = useSelector(store => store?.location);
    const dispatch = useDispatch();
    const print = useRef();
    const handlePrint = useReactToPrint({
        content: () => print.current,
    });
    const [orderItems, setOrderItems] = useState([]);
    const [orderDetail, setOrderDetail] = useState({});
    const { id } = useParams();
    const getOrderItems = useCallback(
        (pageIndex) => {
            OrderService.OrderedShoppingCartItems({
                pageSearchArgs: {
                    pageIndex: 0,
                    pageSize: 0,
                    pagingStrategy: 0,
                    filteringOptions: [
                        {
                            field: "isItemCancel",
                            operator: 1,
                            value: false
                        }
                    ]
                },
                orderId: id,
                productTypeId: 0
            }).then((response) => {
                if (response?.data?.data?.items) {
                    setOrderItems(response.data.data?.items);
                }
            }).catch(() => {
            })
        },
        [orderDetail]
    );
    useEffect(() => {
        getOrderItems();
        getOrderDetails();
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
                    message: "Order not found.",
                    type: 'danger'
                }));
                // navigate('/admin/Order/orders');
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        })
    }
    return (
        <>
            <title>Order Receipt: #{orderDetail?.orderNumber}</title>
            <div className='px-4 sm:px-6 lg:px-8 py-8 w-full'>
                <div className='sm:flex sm:justify-between mb-8 sm:flex-wrap sm:items-start'>
                    <div c0lass="flex mb-4 sm:mb-0 grow">
                        <NavLink to={`/admin/order/orders/edit/${orderDetail?.orderNumber}`} className="inline-flex btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 items-center mr-2"> <span className="material-icons-outlined">west</span> </NavLink>
                        <div className="inline-flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold inline-flex">Orders Receipt: #{orderDetail?.orderNumber}</h1>

                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center gap-4 mr-4">
                            <button type='button' onClick={handlePrint} className='btn bg-indigo-500 hover:bg-indigo-600 text-white ml-2 first:ml-0'>Print Invoice</button>
                        </div>
                    </div>
                </div>
                <div className="" style={{ fontFamily: 'Raleway,sans-serif' }} id="printpdfpage" ref={print}>
                    <title>Order Receipt: #{orderDetail?.orderNumber}</title>
                    <div className="mx-auto bg-white min-h-screen px-5">
                        <div className="px-4 py-4 border-b border-neutral-200 text-center">
                            <img className="inline-block w-72" src={process.env.REACT_APP_API_BLOB + orderDetail?.storeLogo} alt="" />
                        </div>
                        <div className="grid grid-cols-2 px-4 py-1 border-b border-neutral-200">
                            <div className="">
                                <div className="font-semibold">Order # : {orderDetail?.orderNumber}</div>
                            </div>
                            <div className=" text-right">
                                <div className="font-semibold">Order Date :{orderDetail?.orderDate ? DateTimeFormat(orderDetail?.orderDate).date + " " + DateTimeFormat(orderDetail?.orderDate).time : ''}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 px-4 py-4 border-b border-neutral-200">
                            <div className="w-full ">
                                <div className="font-semibold mb-1">Shipping Address</div>
                                <div className="">
                                    {orderDetail?.shippingAddress?.name}<br />
                                    {orderDetail?.shippingAddress?.email ? <>{orderDetail?.shippingAddress?.email}<br /></> : ''}
                                    {orderDetail?.shippingAddress?.address1}<br />
                                    {orderDetail?.shippingAddress?.address2 && <>{orderDetail?.shippingAddress?.address2}<br /></>}
                                    {orderDetail?.shippingAddress?.city}, {orderDetail?.shippingAddress?.state},{orderDetail?.shippingAddress?.country}, {orderDetail?.shippingAddress?.zipCode}<br />
                                    {orderDetail?.shippingAddress?.phone}
                                </div>
                            </div>
                            <div className="w-full ">
                                <div className="font-semibold mb-1">Billing Address</div>
                                <div className="">
                                    {orderDetail?.billingAddress?.name}<br />
                                    {orderDetail?.billingAddress?.email}<br />
                                    {orderDetail?.billingAddress?.address1}<br />
                                    {orderDetail?.billingAddress?.address2 && <>{orderDetail?.billingAddress?.address2}<br /></>}
                                    {orderDetail?.billingAddress?.city}, {orderDetail?.billingAddress?.state},{orderDetail?.billingAddress?.country}, {orderDetail?.billingAddress?.zipCode}<br />
                                    {orderDetail?.billingAddress?.phone}
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                                <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                                    <tr>
                                        <th className="px-2 py-2" colSpan="2">
                                            <div className="font-semibold text-left max-w-sm flex items-center"> <span>Line Items</span></div>
                                        </th>
                                        <th className="px-2 py-2">
                                            <div className="font-semibold text-right max-w-sm flex items-center justify-end">
                                                <span>Subtotal</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-200 border-b border-neutral-200">
                                    {
                                        orderItems.map((value, index) => {
                                            return (
                                                <tr key={value?.id}>
                                                    <td className="px-2 py-3 whitespace-nowrap w-px">
                                                        <div className='flex flex-row'>
                                                            <div className="w-14 h-14 shrink-0 mr-2 sm:mr-3">
                                                                <img className="w-14 h-14 shrink-0 mr-2 sm:mr-3" src={`${process.env.REACT_APP_API_BLOB}${value?.colorImage}`} alt="" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-3">
                                                        <div className='w-80'>
                                                            <div className="">{value?.productName}</div>
                                                            <div className="text-[#707070] text-sm font-normal">Color: {value?.attributeOptionValue || '-'} </div>
                                                            <div className="text-[#707070] text-sm font-normal">SKU: {value?.sku || '-'} </div>
                                                            <div className='grid grid-cols-8 gap-4'>
                                                                {value?.shoppingCartLogoPersonViewModels && value?.shoppingCartLogoPersonViewModels.map((value, index) => {
                                                                    return (
                                                                        <div className="flex justify-center items-center h-10 border mx-1 w-10 overflow-hidden text-sm" key={value?.id}>
                                                                            <Image src={value?.logoPositionImage} alt="No Image" className={`max-h-full`} />
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                            <div className="divide-y divide-gray-300">
                                                                {value?.shoppingCartLineSizeListViewModel && value?.shoppingCartLineSizeListViewModel.map((value, index) => {
                                                                    return (
                                                                        <div className="flex flex-wrap gap-2 justify-between py-1" key={index}>
                                                                            <div className="">Size: {value?.sizeName || '-'}</div>
                                                                            <div className="">Qty: {value?.qty || 0}</div>
                                                                            <div className="">${(value?.price / value?.qty) || 0}/Qty</div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-3 text-right"><span>{`${CurrencySymbolByCode.USD}${parseFloat(value?.subTotal).toFixed(2) || 0}`}</span></td>
                                                </tr>
                                            );
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                        <Prices orderDetail={orderDetail} />
                        <div className="text-center px-4 pt-2">© {new Date().getFullYear()} {orderDetail?.storeName} All Rights Reserved</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoicePrintTemplate;

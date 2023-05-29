/*Component Name: Invoice
Component Functional Details:  Invoice .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import InvoicePrintTemplate from './InvoicePrintTemplate';
import Prices from './Prices';

const Invoice = ({ orderDetail }) => {
    const permission = useSelector(store => store?.permission);
    return (
        <>
            <div className="w-full bg-white shadow-lg rounded-md px-2 py-2 mb-6">
                <div >
                    <div className='w-full justify-between px-2 mb-8'>
                        <div className="flex justify-between flex-wrap items-center px-2 border-b border-neutral-200">
                            <div className="flex text-left items-center">
                                <span className="text-lg font-bold text-gray-500 text-left leading-10">Channel Invoice #258478 </span>
                            </div>
                        </div>
                    </div>
                    <Prices orderDetail={orderDetail} />
                </div>
                <div className="flex overflow-x-auto max-h-screen py-2">
                    <div className="w-full justify-between px-3">
                        <div className="w-full flex mb-2 last:mb-0">
                            <div className="w-full text-right px-2 py-1">
                                <NavLink to={`/admin/Order/orders/receipt/${orderDetail?.orderNumber}`} className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-2 first:ml-0" >Print Invoice</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Invoice;

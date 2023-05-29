/*Component Name: prices
Component Functional Details:  prices .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { CurrencySymbolByCode } from 'global/Enum';

const Prices = ({ orderDetail }) => {
    return (
        <>
            <div className="overflow-x-auto max-h-screen"  >
                <div className="w-full justify-between px-3 mb-2">
                    <div className="w-full flex mb-2 last:mb-0">
                        <div className="w-1/2 text-left">
                            <div className="text-md font-medium text-gray-500 text-left px-2 py-1"><span className="inline-block min-w-[100px] font-bold">Subtotal</span> {orderDetail?.totalItems} Items</div>
                        </div>
                        <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">{orderDetail ? CurrencySymbolByCode.USD + parseFloat(orderDetail?.subTotal).toFixed(2) : 0}</div></div>
                    </div>
                    <div className="w-full flex mb-2 last:mb-0">
                        <div className="w-1/2 text-left">
                            <div className="text-md font-medium text-gray-500 text-left px-2 py-1"><span className="inline-block min-w-[100px] font-bold">Tax</span> {orderDetail?.taxType}</div>
                        </div>
                        <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">${orderDetail?.tax ? parseFloat(orderDetail?.tax).toFixed(2) : 0}</div></div>
                    </div>
                    <div className="w-full flex mb-2 last:mb-0">
                        <div className="w-1/2 text-left">
                            <div className="text-md font-medium text-gray-500 text-left px-2 py-1"><span className="inline-block min-w-[100px] font-bold">Shipping</span> {orderDetail?.shippingType}</div>
                        </div>
                        <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">${orderDetail?.shipping ? parseFloat(orderDetail?.shipping).toFixed(2) : 0}</div></div>
                    </div>
                    <div className="w-full flex mb-2 last:mb-0">
                        <div className="w-1/2 text-left">
                            <div className="text-md font-medium text-gray-500 text-left px-2 py-1"><span className="inline-block min-w-[100px] font-bold">Fee</span>{orderDetail?.feeType}</div>
                        </div>
                        <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">${orderDetail?.fee ? parseFloat(orderDetail?.fee).toFixed(2) : 0}</div></div>
                    </div>
                    <div className="w-full flex mb-2 last:mb-0">
                        <div className="w-1/2 text-left">
                            <div className="text-md font-medium text-gray-500 text-left px-2 py-1"><span className="inline-block min-w-[100px] font-bold">Other</span> {orderDetail?.othersType}</div>
                        </div>
                        <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">${orderDetail?.others ? parseFloat(orderDetail?.others) : 0}</div></div>
                    </div>
                    <div className="w-full flex mb-2 last:mb-0">
                        <div className="w-1/2 text-left">
                            <div className="text-md font-medium text-gray-500 text-left px-2 py-1"><span className="inline-block min-w-[100px] font-bold">Discounts</span> {orderDetail?.discountsType}</div>
                        </div>
                        <div className="w-1/2 text-right"><div className="text-md font-medium text-gray-500 text-right px-2 py-1">{orderDetail?.discounts ? CurrencySymbolByCode.USD + parseFloat(orderDetail?.discounts).toFixed(2) : '(empty)'}</div></div>
                    </div>
                    <div className="w-full flex mb-2 last:mb-0 border-t border-neutral-200 divide-y divide-dotted">
                        <div className="w-1/2 text-left">
                            <div className="text-lg font-bold text-gray-500 text-left px-2 py-1"><span className="inline-block font-bold">Total</span></div>
                        </div>
                        <div className="w-1/2 text-right"><div className="text-lg font-bold text-gray-500 text-right px-2 py-1">${orderDetail?.total ? parseFloat(orderDetail?.total).toFixed(2) : 0}</div></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Prices;

/*Component Name: OldOrders
Component Functional Details: User can create or update OldOrders master details from here.
Created By: Happy
Created Date: 11/10/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import Tabs from 'components/common/Tabs';
import { OrderCustomerTabs } from 'global/Enum';
import React, { useEffect } from 'react';
import Order from '../list/customerOrderDetail/Order';
import Messages from "components/common/alerts/messages/Index";
import { useParams } from 'react-router-dom';
const OldOrders = ({ setOrderModal, OrderModal, orderDetails }) => {
    const { id } = useParams();
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!OrderModal || keyCode !== 27) return;
            setOrderModal(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });
    useEffect(() => {
        setOrderModal(false);
    }, [id]);
    return (
        <>
            <div
                className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-30 transition-opacity ${!OrderModal && 'hidden'}`}
                onClick={() => setOrderModal(false)}
            />
            <div
                className={`fixed inset-0 z-30 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6 ${!OrderModal && 'hidden'}`}
            >
                <div className="relative bg-white rounded shadow-lg overflow-auto max-w-4xl w-full max-h-full z-30" >
                    <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl"> Order History </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="customerModal"
                            onClick={() => setOrderModal(false)}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path className="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="col-span-full xl:col-span-9">
                        <div className="w-full bg-white rounded-md mb-6">
                            {OrderModal && <Order orderDetails={orderDetails} />}
                        </div>
                    </div>
                </div >
            </div>
        </>
    );
};

export default OldOrders;

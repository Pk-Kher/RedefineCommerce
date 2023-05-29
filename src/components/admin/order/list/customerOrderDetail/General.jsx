/*Component Name: General
Component Functional Details: User can create or update General master details from here.
Created By: Happy
Created Date: 11/10/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import Tabs from 'components/common/Tabs';
import { OrderCustomerTabs } from 'global/Enum';
import React from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import Transition from 'utils/Transition';
import CompanyInfo from './CompanyInfo';
import CustomerLogo from './CustomerLogo';
import Order from './Order';
import PaymentOption from './PaymentOption';
import PersonalInformation from './PersonalInformation';
import Messages from "components/common/alerts/messages/Index";
import { useEffect, useCallback } from 'react';
import TierDiscount from './TierDiscount';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { ValidationMsgs } from 'global/ValidationMessages';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import { useDispatch } from 'react-redux';
import CustomerService from 'services/admin/customer/CustomerService';

const General = ({ setCustomerOrderModal, CustomerOrderModal, orderDetails }) => {

    const dispatch = useDispatch();
    const isAddMode = false;
    const [activeTab, setActiveTab] = useState(0);
    const [customerData, setCustomerData] = useState({});
    const onTabClick = (e, index) => {
        e.preventDefault();
        setActiveTab(index);
        // if (!isError) {
        // }
        /* else {
        setModalInfo((prev) => {
            return {
                    ...prev,
                    message: ValidationMsgs.common.tabValidation,
                    module: "Product",
                    title: "Form Error",
                    ButtonName: "OK",
                    displayCancelButton: false,
                };
            });
            setOpenBasicModal((prev) => !prev);
        } */
    };
    const componentsForm = {
        CompanyInfo: CompanyInfo,
        PersonalInformation: PersonalInformation,
        PaymentOption: PaymentOption,
        Order: Order,
        CustomerLogo: CustomerLogo,
        TierDiscount: TierDiscount,
    };
    const displayTabs = useMemo(() => {
        return isAddMode
            ? OrderCustomerTabs.filter((element) => element.componentname != "all")
            : OrderCustomerTabs
    }, [OrderCustomerTabs]);
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!CustomerOrderModal || keyCode !== 27) return;
            setCustomerOrderModal(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });
    const getCustomerData = useCallback(() => {
        dispatch(setAddLoading(true));
        CustomerService.getCustomerById(orderDetails?.customerId).then((response) => {
            if (response.data.data) {
                setCustomerData(response.data.data);
            } else {
                dispatch(
                    setAlertMessage({
                        message: ValidationMsgs.customer.customerNotFound,
                        type: "danger",
                    })
                );
            }
            dispatch(setAddLoading(false));
        }).catch((error) => {
            dispatch(setAddLoading(false));
        });
    }, [orderDetails]);
    useEffect(() => {
        if (orderDetails?.orderNumber) {
            getCustomerData();
        }
    }, [orderDetails])
    return (
        <>
            <div
                className="fixed inset-0 bg-slate-900 bg-opacity-30 z-30 transition-opacity"
                // show={Cus`tomerOrderModal}
                // tag="div"
                // enter="transition ease-out duration-200 transform"
                // enterStart="opacity-0 -translate-y-2"
                // enterEnd="opacity-100 translate-y-0"
                // leave="transition ease-out duration-200"
                // leaveStart="opacity-100"
                // leaveEnd="opacity-0"
                onClick={() => setCustomerOrderModal(false)}

            />
            <div
                className="fixed inset-0 z-30 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6 "
            // show={CustomerOrderModal}
            // tag="div"
            // enter="transition ease-out duration-200 transform"
            // enterStart="opacity-0 -translate-y-2"
            // enterEnd="opacity-100 translate-y-0"
            // leave="transition ease-out duration-200"
            // leaveStart="opacity-100"
            // leaveEnd="opacity-0"
            >
                <div className="relative bg-white rounded shadow-lg overflow-auto max-w-4xl w-full max-h-full z-30" >
                    <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl"> Customer </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="customerModal"
                            onClick={() => setCustomerOrderModal(false)}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path className="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="col-span-full xl:col-span-9">
                        <div className="w-full bg-white rounded-md mb-6">
                            <div className='sticky top-0 bg-white'>
                                <Tabs
                                    options={displayTabs}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    onTabClick={onTabClick}
                                />
                            </div>
                            <Messages />
                            <div className="w-full">
                                {(
                                    <>
                                        {displayTabs.map((tab, index) => {
                                            const Component = componentsForm[tab.componentname];
                                            return (
                                                <div
                                                    className={`${activeTab !== index && "hidden"
                                                        } w-full rounded-md mb-8 tab-content text-sm`}
                                                    key={index}
                                                >
                                                    <Component
                                                        activeTab={activeTab}
                                                        index={index}
                                                        setActiveTab={setActiveTab}
                                                        setCustomerOrderModal={setCustomerOrderModal}
                                                        CustomerOrderModal={CustomerOrderModal}
                                                        orderDetails={orderDetails}
                                                        customerData={customerData}
                                                        {...tab}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </>
    );
};

export default General;

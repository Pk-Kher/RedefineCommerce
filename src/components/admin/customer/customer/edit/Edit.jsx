/*Component Name: Edit
Component Functional Details: User can create or update Edit master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import Tabs from 'components/common/Tabs';
import { customerEditTabs } from 'global/Enum';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useParams, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import CustomerService from 'services/admin/customer/CustomerService';
import Actions from './Actions';
import CreditInfo from './CreditInfo';
import CustomLogo from './CustomLogo';
import Emails from './Emails';
import LifeCycle from './LifeCycle';
import Notes from './Notes';
import Orders from './Orders';
import PaymentOption from './PaymentOption';
import PersonalDetails from './personalDetails/PersonalDetails';
import Products from './product/Products';
import SideBar from './sidebar/SideBar';
import TierManagement from './tierManagement/TierManagement';
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import EditModal from './personalDetails/EditModal';
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Edit = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        setActiveTab(() => {
            let tab = parseInt(searchParams.get('tab'));
            return (!isNaN(tab)) ? tab : 0;
        });
    }, []);
    const dispatch = useDispatch();
    const onTabClick = (e, index) => {
        e.preventDefault();
        setActiveTab(index);
    };
    const [showEdit, setShowEdit] = useState(false);
    const components = {
        PersonalDetails: PersonalDetails,
        Actions: Actions,
        Emails: Emails,
        PaymentOption: PaymentOption,
        Orders: Orders,
        Products: Products,
        Notes: Notes,
        CustomLogo: CustomLogo,
        CreditInfo: CreditInfo,
        TierManagement: TierManagement,
        LifeCycle: LifeCycle,
    };
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    const getCustomerData = useCallback(() => {
        dispatch(setAddLoading(true))

        CustomerService.getCustomerById(id).then((response) => {
            if (response.data.data) {
                setData(response.data.data);
            } else {
                dispatch(
                    setAlertMessage({
                        message: ValidationMsgs.customer.customerNotFound,
                        type: "danger",
                    })
                );
                return navigate("/admin/Customer/customer");
                dispatch(setAddLoading(false))
            }
        }).catch((error) => {
            dispatch(setAddLoading(false))
        })
    }, [id]);

    useEffect(() => {
        getCustomerData();
    }, [id]);

    return (
        <>
            <title>{"Edit Customer " + (data.firstname ? "| " + data.firstname + " " + data.lastName : "")}</title>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto pb-0">
                {/* Page header */}
                <div className="flex mb-8 justify-between">
                    <div className="flex items-center">
                        <NavLink
                            to={'/admin/Customer/customer'}
                            className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                        >
                            <span className="material-icons-outlined">west</span>
                        </NavLink>
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                            {data.firstname ? data.firstname + " " + data.lastName : "Edit Customer"}
                        </h1>
                    </div>
                </div>
                <Messages />
                {/* Form Part */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Information Part */}

                    <div className="col-span-full xl:col-span-9  min-h-screen relative">
                        <div className="w-full bg-white shadow-xxl rounded-md mb-8 pt-8">
                            <Tabs
                                options={customerEditTabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                onTabClick={onTabClick}
                            />
                            {
                                customerEditTabs.map((value, index) => {
                                    let Component = components[value.componentname];
                                    if (activeTab === value.id) {
                                        return (
                                            <div key={index} className="px-5">
                                                <Component customerInfo={data} getCustomerData={getCustomerData} setShowEdit={setShowEdit} />
                                            </div>
                                        );
                                    }
                                })
                            }

                        </div>
                    </div>
                    <SideBar customerInfo={data} getCustomerData={getCustomerData} setShowEdit={setShowEdit} />

                </div>
            </div>
            <EditModal showEdit={showEdit} setShowEdit={setShowEdit} customerInfo={data} getCustomerData={getCustomerData} />

        </>
    );
};

export default Edit;

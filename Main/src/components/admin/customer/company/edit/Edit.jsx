/*Component Name: Edit
Component Functional Details: User can create or update Edit master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: Chandan
Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from 'react';
import Tabs from 'components/common/Tabs';
import { companyEditTabs } from 'global/Enum';
import { useDispatch } from 'react-redux';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Messages from "components/common/alerts/messages/Index";
import CompanyDetails from "./tabsPages/CompanyDetails"
import Orders from "./tabsPages/Orders"
import Products from '../../company/edit/product/Products';
import Notes from "./tabsPages/Notes"
import CustomLogo from "./tabsPages/CustomLogo"
import Users from "./tabsPages/Users"
import LifeCycle from "./tabsPages/LifeCycle"
import { ValidationMsgs } from "global/ValidationMessages";
import CompanyService from "services/admin/companyInformation/CompanyInformationServices"
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Edit = () => {
    const [activeTab, setActiveTab] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState({});

    const onTabClick = (e, index) => {
        e.preventDefault();
        setActiveTab(index);
    };

    const components = {
        Messages: Messages,
        CompanyDetails: CompanyDetails,
        Orders: Orders,
        Products: Products,
        Notes: Notes,
        CustomLogo: CustomLogo,
        Users: Users,
        LifeCycle: LifeCycle,
    };

    const getCompanyData = useCallback(() => {
        dispatch(setAddLoading(true))

        CompanyService.getCompanyById(id).then((response) => {
            if (response.data.data) {
                setData(response.data.data);
            } else {
                dispatch(
                    setAlertMessage({
                        message: ValidationMsgs.company.companyNotFound,
                        type: "danger",
                    })
                );
                return navigate("/admin/Customer/company");
            }
            dispatch(setAddLoading(false))

        }).catch((error) => {
            dispatch(setAddLoading(false))

        })
    }, [id]);
    useEffect(() => {
        getCompanyData();
    }, [id]);

    return (
        <>
            <title>{"Edit Company"}</title>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                    <div className="flex items-center text-2xl md:text-3xl text-gray-800 font-bold">
                        <NavLink
                            to={'/admin/Customer/company'}
                            className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                        >
                            <span className="material-icons-outlined">west</span>
                        </NavLink>
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                            {"Edit Company"}
                        </h1>
                    </div>
                </div>
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                </div>
                <Messages />
                {/* Form Part */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Information Part */}
                    <div className="bg-white shadow-xxl rounded-md pt-6 mb-6 col-span-12">
                        {/* Tabs Row */}
                        <div className='flex flex-nowrap border-b border-gray-200 w-full'>
                            <Tabs
                                options={companyEditTabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                onTabClick={onTabClick}
                                pClassName={`flex flex-wrap`}
                                cClassName={`mr-0.5 md:mr-0 md:mb-0.5`}
                            />
                        </div>

                        {companyEditTabs.map((value, index) => {
                            let Component = components[value.componentName];
                            if (activeTab === value.id) {
                                return (
                                    <div key={index} className="px-5">
                                        <Component CompanyInfo={data} getCompanyData={getCompanyData} PageName={value.label} />
                                    </div>
                                );
                            }
                        })
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;

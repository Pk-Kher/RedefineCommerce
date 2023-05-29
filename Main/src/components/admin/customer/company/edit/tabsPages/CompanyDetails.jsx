/*Component Name: CompanyDetails
Component Functional CompanyDetails: User can create or update CompanyDetails master CompanyDetails from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import CompanyService from "services/admin/companyInformation/CompanyInformationServices"
import StoreCustomerService from 'services/front/StoreCustomerService';

const CompanyDetails = ({ CompanyInfo, PageName }) => {

    const dispatch = useDispatch();
    const [Data, setData] = useState({});

    const getCustomerByCompanyData = useCallback(() => {
        dispatch(setAddLoading(true))
        CompanyService.getcustomerdetailsbycompanyid(CompanyInfo.companyId).then((response) => {
            if (response.data.success) {
                setData(response?.data?.data);
            } else {
                dispatch(
                    setAlertMessage({
                        message: ValidationMsgs.company.companyNotFound,
                        type: "danger",
                    })
                );
            }
            dispatch(setAddLoading(false))

        }).catch((error) => {
            dispatch(setAddLoading(false))

        })
    }, [CompanyInfo.companyId]);

    const PasswordReset = (storeId, Email) => {
        dispatch(setAddLoading(true))
        StoreCustomerService.sendResetPasswordLink(storeId, Email).then((response) => {
            if (response?.data?.data?.issend) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.CompanyResetPassword.ResetPasswordSuccess,
                    type: 'success'
                }));
            } else {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.CompanyResetPassword.ResetPasswordNotSuccess,
                    type: 'danger'
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));

        })
    }

    useEffect(() => {
        getCustomerByCompanyData();
    }, [CompanyInfo.companyId]);

    return (
        <>
            <div >
                <h2 className="text-2xl text-gray-800 font-bold my-6">{PageName}</h2>
                {/* Panel body */}
                <div className="pb-6">
                    <div >
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="sm:col-span-1 mb-5">
                                    <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                                    <dd className="mt-1 text-sm font-bold text-gray-900">{CompanyInfo.corporateName}</dd>
                                </div>
                                <div className="sm:col-span-1 mb-5">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm font-bold text-gray-900">
                                        {CompanyInfo.email}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1 mb-5">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm font-bold text-gray-900">{CompanyInfo.recStatus === 'A' ? "Active" : "Inactive"}</dd>
                                </div>
                            </div>
                            <div className=''>
                                <table className='table-auto w-full text-sm text-[#191919] font-semibold'>
                                    <thead className='text-sm font-bold uppercase text-[#b3b3b3] '>
                                        <tr >
                                            <th className='px-2 first:pl-5 py-4 text-left'>Customer Email</th>
                                            <th className='px-2 first:pl-5 py-4 text-left'>Password</th>
                                            <th className='px-2 first:pl-5 py-4 text-left'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Data.length > 0 && Data.map((CustomerDetails, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className='px-2 first:pl-5 py-3 group text-left'>{CustomerDetails?.email}</td>
                                                    <td className='px-2 first:pl-5 py-3 group text-left'>****************</td>
                                                    <td className='px-2 first:pl-5 py-3 group text-left'>
                                                        <button className="text-indigo-500 text-sm" onClick={() => PasswordReset(CustomerDetails?.storeId, CustomerDetails?.email)}>Reset password</button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default CompanyDetails;

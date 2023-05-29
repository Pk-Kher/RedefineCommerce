/*Component Name: PersonalDetails
Component Functional Details:  PersonalDetails .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import AddressModal from './AddressModal';
import Address from './Address';
import Toggle from 'components/common/formComponent/Toggle';
import ResetPasswordModal from './ResetPasswordModal';
import { useSelector } from 'react-redux';

const PersonalDetails = ({ customerInfo, getCustomerData, setShowEdit }) => {
    const permission = useSelector(store => store?.permission)
    const [showShippingAddressModal, setShippingAddressModal] = useState(false);
    const [showBillingAddressModal, setBillingAddressModal] = useState(false);
    const [ShowResetPassword, SetShowResetPassword] = useState(false);

    return (
        <>
            <div className='grow'>
                <div className="pt-6">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-2xl text-gray-800 font-bold mb-5">Customer Details</h2>
                        {(permission?.isEdit || permission?.isDelete) &&
                            <div ><button type='button' className="text-indigo-500 text-sm" onClick={() => { setShowEdit(prev => !prev) }} >Edit</button></div>}
                    </div>
                    <div className="py-5">
                        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Store Name</dt>
                                <dd className="mt-1 text-sm font-bold text-gray-900">{customerInfo.storeName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                <dd className="mt-1 text-sm font-bold text-gray-900">{customerInfo.firstname}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                <dd className="mt-1 text-sm font-bold text-gray-900">{customerInfo.lastName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm font-bold text-gray-900">{customerInfo.email}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                                <dd className="mt-1 text-sm font-bold text-gray-900">{customerInfo.companyName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Password</dt>
                                <div className="flex gap-2 justify-between">
                                    <dd className="mt-1 text-sm font-bold text-gray-900">*********** </dd>
                                    {(permission?.isEdit || permission?.isDelete) &&
                                        <div >
                                            <button type='button' title="" className="inline-block text-indigo-500 text-sm cursor-pointer" aria-controls="basic-modal14" onClick={() => SetShowResetPassword(prev => !prev)}>Reset password</button>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Customer NAV ID</dt>
                                <dd className="mt-1 text-sm font-bold text-gray-900">{customerInfo.navCustomerId ? customerInfo.navCustomerId : ""}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="mt-1 text-sm font-bold text-gray-900">{customerInfo.recStatus === 'A' ? "Active" : "Inactive"}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Is Super User</dt>
                                <dd className="mt-1 text-sm font-bold text-gray-900">
                                    <div className="flex items-center" >
                                        <div className="w-16 relative">
                                            <Toggle name="isSuperuser1" defaultValue={customerInfo.isSuperuser ? customerInfo.isSuperuser : ''} id={'disable_isSuperAdmin'} disabled={true} />
                                        </div>
                                    </div>
                                </dd>
                            </div>

                        </div>
                    </div>
                </div>
                <Address customerInfo={customerInfo} setShippingAddressModal={setShippingAddressModal} setBillingAddressModal={setBillingAddressModal} getCustomerData={getCustomerData} />
            </div>
            <AddressModal showAddressModal={showShippingAddressModal} setAddressModal={setShippingAddressModal} addressType={'S'} customerInfo={customerInfo} getCustomerData={getCustomerData} />
            <AddressModal showAddressModal={showBillingAddressModal} setAddressModal={setBillingAddressModal} addressType={'B'} customerInfo={customerInfo} getCustomerData={getCustomerData} />

            <ResetPasswordModal SetShowResetPassword={SetShowResetPassword} ShowResetPassword={ShowResetPassword} customerInfo={customerInfo} />
        </>
    );
};

export default PersonalDetails;

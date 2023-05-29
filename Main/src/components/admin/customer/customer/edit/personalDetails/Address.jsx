/*Component Name: Address
Component Functional Details:  Address .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import AddressTile from 'components/admin/customer/customer/edit/personalDetails/AddressTile';
import React from 'react';
import { useSelector } from 'react-redux';

const Address = ({ customerInfo, setShippingAddressModal, setBillingAddressModal, getCustomerData }) => {
    const permission = useSelector(store => store?.permission)

    return (
        <>
            <div className='py-6'>
                <div className='flex items-center justify-between mb-4 gap-2'>
                    <div className="text-base font-bold">Shipping Address</div>
                    {(permission?.isEdit || permission?.isDelete) &&
                        <div className='relative'>
                            <button type='button' title="" className="inline-block text-indigo-500 text-sm cursor-pointer" aria-controls="basic-modal14" onClick={() => setShippingAddressModal(prev => !prev)}>Add Shipping Address</button>
                        </div>
                    }
                </div>
                <div className="grid grid-cols-12 gap-6 mb-6">
                    {customerInfo?.customerAddress &&
                        customerInfo.customerAddress.map((address, index) => {
                            if (address.addressType === 'S') {
                                return (
                                    <AddressTile details={address} key={index} customerId={customerInfo.id} getCustomerData={getCustomerData} />
                                );
                            }
                        })
                    }
                </div>
            </div>
            <div className='py-6'>
                <div className='flex items-center justify-between mb-4 gap-2'>
                    <div className="text-base font-bold">Billing Address</div>
                    {(permission?.isEdit || permission?.isDelete) &&
                        <div className='relative'>
                            <button type='button' title="" className="inline-block text-indigo-500 text-sm cursor-pointer" aria-controls="basic-modal14" onClick={() => setBillingAddressModal(prev => !prev)}> Add Billing Address</button>
                        </div>
                    }
                </div>
                <div className="grid grid-cols-12 gap-6 mb-6">
                    {customerInfo?.customerAddress &&
                        customerInfo.customerAddress.map((address, index) => {
                            if (address.addressType === 'B') {
                                return (
                                    <AddressTile details={address} key={index} customerId={customerInfo.id} getCustomerData={getCustomerData} />
                                );
                            }
                        })
                    }
                </div>
            </div>

        </>
    );
};

export default Address;

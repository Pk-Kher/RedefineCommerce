/*Component Name: AddressTile
Component Functional Details:  AddressTile .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import Toggle from 'components/common/formComponent/Toggle';
import { ValidationMsgs } from 'global/ValidationMessages';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import CustomerService from 'services/admin/customer/CustomerService';
import { serverError } from 'services/common/helper/Helper';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const AddressTile = ({ details, customerId, getCustomerData }) => {
    const [defaultValue, setDefaultValue] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setDefaultValue(details.isDefault);
    }, [details]);

    const onChangeHandler = (e) => {
        dispatch(setAddLoading(true))

        setDefaultValue(e.target.checked);
        CustomerService.updateCustomerDefaultAddress({
            isDefault: e.target.checked,
            addressId: details.id,
            customerId: customerId,
            addressType: details.addressType
        }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.customer.defaultAddress,
                    })
                );
                getCustomerData();
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
                dispatch(setAddLoading(false))
            }
        }).catch((errors) => {
            dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.customer.defaultNotAddress }));
            dispatch(setAddLoading(false))
        });
    }
    return (
        <>
            <div className="col-span-full xl:col-span-6 2xl:col-span-4 flex" /* id={`div_${details.id}`} */>
                <div className={`w-full inline-block bg-white shadow-md rounded-lg  ${!details.isDefault ? 'border-slate-200' : 'border-green-500'}`} style={{ borderWidth: '1px' }} htmlFor="address1">
                    <div className="text-sm text-gray-600 p-5">
                        <div className="mb-3 flex justify-between items-center">
                            <h3 className="text-lg text-slate-800 font-semibold">{details?.firstname} {details?.lastName} {/* {details.id} */}</h3>
                            <div className="flex items-center" x-data="{ checked: true }">
                                <div className="mr-1 text-sm">Default</div>
                                <div className="w-16 relative">
                                    <Toggle name={`default_${details.id}`} id={`default_${details.id}`} defaultValue={defaultValue} onChange={onChangeHandler} disabled={defaultValue} />
                                </div>
                            </div>
                        </div>
                        <div >
                            {details?.address1}<br />
                            {details?.address2}<br />
                            {details?.city} {details.state} {details.postalCode} {details.countryCode}<br />
                            {details.countryName}
                        </div>
                        <div className="mt-3 flex items-center">
                            <div className="mr-5">Mobile : </div>
                            <div >{details.phone}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddressTile;

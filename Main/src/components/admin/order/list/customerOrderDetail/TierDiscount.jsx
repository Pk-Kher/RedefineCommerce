/*Component Name: TierDiscount
Component Functional Details:  TierDiscount .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import Select from 'components/common/formComponent/Select';
import React from 'react';
import { useState, useEffect } from 'react';
import TierService from 'services/admin/tier/TierService';
const TierDiscount = ({ orderDetails, customerData }) => {
    const [tier, setTier] = useState([]);
    useEffect(() => {
        if (orderDetails?.customerId) {
            TierService.getTiersByCustomerID(orderDetails.customerId).then(response => {
                if (response.data.data) {
                    setTier(() => {
                        return response.data.data.map((value, index) => {
                            return {
                                label: value?.tierName,
                                value: value?.id
                            }
                        })
                    })
                }
            }).catch(error => { });
        }

    }, [orderDetails]);
    return (
        <>
            <div className="p-6">
                <div className="overflow-visible">
                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Tier <span className="text-rose-500 text-2xl leading-none">*</span></label>
                    <Select
                        defaultValue={customerData?.tierId || ''}
                        options={tier}
                        isDisabled={true}
                    />
                </div>
            </div>
        </>
    );
};

export default TierDiscount;

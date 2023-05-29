/*Component Name: SideBar
Component Functional Details:  SideBar .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import Toggle from 'components/common/formComponent/Toggle';
import { ValidationMsgs } from 'global/ValidationMessages';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import CustomerService from 'services/admin/customer/CustomerService';
import { serverError } from 'services/common/helper/Helper';
import Tag from './Tag';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const SideBar = ({ customerInfo, setShowEdit }) => {
    const dispatch = useDispatch();
    const permission = useSelector(store => store?.permission)

    const taxChangeHandler = (e) => {
        dispatch(setAddLoading(true))

        CustomerService.changeCustomerTaxStatus({
            isTaxable: e.target.checked,
            customerId: customerInfo.id
        }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.customer.taxChange,
                    })
                );
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            dispatch(setAddLoading(false))
        }).catch((errors) => {
            dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.customer.taxNotChange }));
            dispatch(setAddLoading(false))
        });
    }
    return (
        <>
            <div className='col-span-3'>
                <div className='w-full justify-between bg-white py-3 mb-4 rounded-md shadow-lg'>
                    <div className='w-full mb-4 last:mb-0'>
                        <div className="px-5 flex flex-wrap justify-between">
                            <div className="text-lg font-bold text-gray-500 text-left leading-10">{customerInfo.firstname} {customerInfo.lastname}</div>
                            {(permission?.isEdit || permission?.isDelete) &&
                                <div >
                                    <button title="" className="inline-block" onClick={() => setShowEdit(prev => !prev)} >
                                        <span className="material-icons-outlined leading-10">edit</span>
                                    </button>
                                </div>
                            }
                        </div>
                        <div className="px-5">
                            <div className="mb-2">
                                <a href={`mailto:${customerInfo.email}`} title="" className="inline-block text-indigo-500">{customerInfo.email}</a>
                            </div>
                            {/* <div >No account</div> */}
                        </div>
                    </div>
                </div >
                <div className="w-full justify-between bg-white py-3 mb-4 rounded-md shadow-lg">
                    <div className="w-full px-3">
                        <div className="w-full flex mb-2 items-center justify-between"><div className="text-lg font-bold text-gray-500 text-left px-2 leading-10">Tax Settings</div></div>
                        <div className="px-2 mb-2">
                            <div className="flex items-center" >
                                <div className="w-16 relative">
                                    <Toggle name={`isTaxableuser`} id={`isTaxableuser`} defaultValue={customerInfo.isTaxableuser ? customerInfo.isTaxableuser : ''} onChange={taxChangeHandler} disabled={(permission?.isEdit || permission?.isDelete ? false : true)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="w-full justify-between bg-white px-5 py-3 mb-4 rounded-md shadow-lg">
                    <div className="w-full flex justify-between mb-2 last:mb-0">
                        <div className="w-1/2 text-left"><div className="text-lg font-bold text-gray-500 text-left leading-10">Marketing Status</div></div>
                    </div>
                    <div className="w-full">
                        <div className="py-1">
                            <span title="" className="text-xs inline-flex font-medium border border-neutral-200 cursor-pointer bg-slate-100 text-gray-500 rounded-md text-center px-2.5 py-1">Email not subscribed</span>
                        </div>
                        <div className="py-1">
                            <span title="" className="text-xs inline-flex font-medium border border-neutral-200 bg-slate-100 cursor-pointer text-gray-500 rounded-md text-center px-2.5 py-1">SMS not subscribed</span>
                        </div>
                        <div className="py-1 text-xs">Last updated 3:55 am.</div>
                    </div>
                </div>
                <Tag customerInfo={customerInfo} />
            </div >
        </>
    );
};

export default SideBar;

/*Component Name: Actions
Component Functional Details:  Actions .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: Shrey Patel
Modified Date: 01/02/2023 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import CustomerService from 'services/admin/customer/CustomerService';
import { DateTimeFormat } from "services/common/helper/Helper";

const Actions = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [Actions, setActions] = useState([]);

    const getCustomerActionById = () => {
        dispatch(setAddLoading(true))
        if (id) {
            CustomerService.getCustomerActionById(id)
                .then((response) => {
                    if (response.data.success && response.data) {
                        setActions(response.data.data)
                        dispatch(setAddLoading(false))
                    }
                }).catch((errors) => {
                    dispatch(setAddLoading(false))
                });
        }
    }

    useEffect(() => {
        getCustomerActionById();
    }, [])

    return (
        <>
            {Actions?.length > 0 ? Actions?.map((action, index) => {
                return (
                    <div key={index}>
                        <div className='grow'>
                            <div className='pt-6 flex flex-wrap pb-8'>

                                <div className="w-1/3">
                                    <div className="text-base font-bold">{action?.day}, {DateTimeFormat(action?.date, "MMMM dd, yyyy").date}</div>
                                    <div>{DateTimeFormat(action?.date).time}</div>
                                    <div>IP: {action?.ipAddress}</div>
                                    <div className="w-full flex justify-start items-center"><span className="text-sm font-medium text-slate-400 -mt-0.5 mr-1"><img src="../images/united-states.png" alt="" className="w-5" /></span> <span className="text-md">US</span></div>
                                    <div>Website: {action?.website}</div>
                                </div>
                                <div className='w-1/3'>
                                    <div className='sm:flex sm:justify-between sm:items-center mb-4'>
                                        <div className='sm:mb-0'>
                                            <h2 className='text-2xl text-gray-800 font-bold'>
                                                {action?.action} Actions - {action?.hours} hours {action?.mins} min
                                            </h2>
                                        </div>
                                    </div>
                                    <div className='flow-root'>
                                        <ul className='-mb-8'>
                                            {action && action?.detail?.length > 0 && action?.detail.map((DetailsData, index) => {
                                                return (
                                                    <>
                                                        <li>
                                                            <div className="relative pb-8">
                                                                {action?.detail?.length - 1 !== index &&
                                                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                                                                }
                                                                <div className="relative flex space-x-3">
                                                                    <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                                        <span className="material-icons-outlined text-white">folder</span>
                                                                        {/* <span className="material-icons-outlined -rotate-45 text-white">texture</span> */}
                                                                        {/* <span className="material-icons-outlined text-white">remove_shopping_cart</span> */}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                                        <div>
                                                                            <p className="text-sm text-gray-500">{DetailsData?.pageName} - <button className="font-medium text-gray-900 cursor-pointer">{DetailsData?.storeName}e</button></p>
                                                                            <button className="text-indigo-500 cursor-pointer">{DetailsData?.pageURL} </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        {/* {action?.detail?.length - 1 === index &&
                                                            <ul className="ml-5">
                                                                <li>
                                                                    <div className="flex items-center px-2.5 py-2 rounded whitespace-nowrap" href="customer-actions.html">
                                                                        <span className="material-icons-outlined">content_paste</span>
                                                                        <span className="w-full text-sm font-medium text-gray-600 hover:text-gray-700">interacted with form <a href="#" className="font-medium text-gray-900">Checkout Frem</a></span>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        } */}
                                                    </>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
                :
                <label className='text-red-400 text-center text-lg' >No Data Found! As of Now</label>
            }
        </>
    );
};

export default Actions;

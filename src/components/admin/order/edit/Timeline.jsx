/*Component Name: Timeline
Component Functional Details:  Timeline .
Created By: PK Kher
Created Date: 7-25-2022
Modified By: PK Kher
Modified Date: 7-25-2022 */

import React, { Fragment, useState } from 'react';
import Input from 'components/common/formComponent/Input';
import CheckBox from 'components/common/table/CheckBox';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { ValidationMsgs } from 'global/ValidationMessages';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import OrderTimelineService from 'services/admin/order/OrderTimelineService';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
const Timeline = ({ orderDetail }) => {
    const permission = useSelector(store => store?.permission);
    const location = useSelector(store => store?.location);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [showComments, setShowComments] = useState(true);
    const submitHandler = (values, { resetForm }) => {
        dispatch(setAddLoading(true))
        OrderTimelineService.createOrderTimeline({
            orderTimeLineModel: {
                ...values,
                ...location
            }
        }).then((response) => {
            if (response?.data?.success) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.postStore,
                    type: 'success'
                }));
                resetForm({});
                getData();
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
            dispatch(setAlertMessage({
                message: ValidationMsgs.order.postNotStore,
                type: 'success'
            }));
        })
    }
    const getData = useCallback(() => {
        OrderTimelineService.getOrderTimelinesList({
            orderNumber: orderDetail?.orderNumber
        }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                setData(response.data.data);
            }
        }).catch(() => { })
    }, [orderDetail]);
    useEffect(() => {
        if (orderDetail?.orderNumber) {
            getData();
        }
    }, [orderDetail]);
    return (
        <>
            <div className="w-full bg-white shadow-lg rounded-md px-2 py-2 mb-6">
                <div className="flex px-2 border-b border-neutral-200 justify-between items-center">
                    <div className="text-lg font-bold text-gray-500 text-left leading-10">Timeline</div>
                    <div>
                        <label className="flex items-center">
                            <CheckBox className="form-checkbox" onChange={(e) => setShowComments(e.target.checked)} checked={showComments} />
                            <span className="ml-2 cursor-pointer select-none">Show comments</span>
                        </label>
                    </div>
                </div>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        id: 0,
                        rowVersion: "",
                        orderNumber: orderDetail.orderNumber,
                        title: "",
                        description: "",
                        isCreatedByCustomerUser: false,
                        recStatus: "A",
                        isSystemGenerated: false,
                    }}
                    onSubmit={submitHandler}
                    validationSchema={Yup.object().shape({
                        title: Yup.string().required(ValidationMsgs.order.postTitle),
                        description: Yup.string().required(ValidationMsgs.order.postTitle)
                    })}
                >
                    {({ errors, setFieldValue, values }) => {
                        return (
                            <FormikForm>
                                <div className='w-full py-3 px-3 my-2' >
                                    <div className='flow-root'>
                                        <ul className='mb-8'>
                                            {(permission?.isEdit || permission?.isDelete) && <Step isLastStep={data.length <= 0 || !showComments}>
                                                <div className="min-w-0 flex-1 flex justify-between space-x-4">
                                                    <div className='flex justify-start w-full'>
                                                        <div className="">
                                                            <div className='flex justify-start w-full'>
                                                                <div className='w-72'>
                                                                    <Input className={'min-w-44'} name={'title'} placeholder="Title" />
                                                                </div>
                                                                <div className='ml-3 w-72'>
                                                                    <Input name={'description'} placeholder="Description" />
                                                                </div>
                                                            </div>
                                                            <p className="text-left text-sm text-gray-500">Only you and other staff can see comments</p>
                                                        </div>
                                                        <div>
                                                            <button className={`inset-0 left-auto group btn bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer`}> Post</button>
                                                        </div>
                                                        {/* <span title="" className="absolute inset-0 left-auto top-2 right-[140px]"><span className="material-icons-outlined">emoji_emotions</span></span>
                                                        <span title="" className="absolute inset-0 left-auto top-2 right-[110px]"><span className="material-icons-outlined">alternate_email</span></span>
                                                        <span title="" className="absolute inset-0 left-auto top-1 right-[90px]"><span className="material-icons-outlined text-bold">#</span></span>
                                                    <span title="" className="absolute inset-0 left-auto top-2 right-[60px]"><span className="material-icons-outlined">attach_file</span></span> */}
                                                    </div>
                                                </div>
                                            </Step>}
                                            {(data.length > 0 && showComments) &&
                                                data?.map((value, index1) => {
                                                    return (
                                                        <Fragment key={index1}>
                                                            {
                                                                value?.subRows?.map((post, index) => {
                                                                    return (
                                                                        <Step key={index} isLastStep={(value?.subRows?.length === index + 1) && (data?.length === index1 + 1)}>
                                                                            {({ showDescription, setShowDescription }) => {
                                                                                return (
                                                                                    <div className='min-w-0 flex-1 pt-1.5'>
                                                                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                                                            <div>
                                                                                                {index == 0 && <p className="text-sm text-gray-500 font-bold py-2">{post.createdDateDisplay}</p>}
                                                                                                <div className="relative">
                                                                                                    <button type='button' onClick={() => setShowDescription(prev => !prev)} className="flex w-full flex-wrap justify-between items-center text-sm py-2 px-0 bg-white border-0" aria-haspopup="true" aria-expanded="false">
                                                                                                        <span className="ml-1 text-sm text-gray-500">{post.title}</span>
                                                                                                        <span className="material-icons-outlined">{showDescription ? 'expand_more' : 'expand_less'}</span>
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="text-right text-sm whitespace-nowrap text-gray-500"><time dateTime="2020-09-20">{post?.createdTime}</time></div>
                                                                                        </div>
                                                                                        {showDescription && <div className="bg-white overflow-hidden ml-1">
                                                                                            {post?.description}
                                                                                        </div>}
                                                                                    </div>
                                                                                );
                                                                            }}
                                                                        </Step>
                                                                    );
                                                                })
                                                            }
                                                        </Fragment>
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div >
                                </div >
                            </FormikForm>
                        )
                    }}
                </Formik>
            </div>
        </>
    );
};

const Step = ({ isLastStep, children }) => {
    const [showDescription, setShowDescription] = useState(false);
    return (
        <li>
            <div className="relative pb-8">
                {!isLastStep && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>}
                <div className="relative flex space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white mt-2">
                        <span className="material-icons-outlined text-white">radio_button_checked</span>
                    </div>
                    {children instanceof Function ? children({ showDescription, setShowDescription }) : children}
                </div>
            </div>
        </li>
    );
}
export default Timeline;

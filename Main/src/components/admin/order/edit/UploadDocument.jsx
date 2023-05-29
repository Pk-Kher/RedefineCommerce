/*Component Name: UploadDocument
Component Functional Details:  UploadDocument .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import File from 'components/common/formComponent/File';
import { Formik, Form as FormikForm } from "formik";
import { RecStatusValuebyName } from 'global/Enum';
import { ValidationMsgs } from 'global/ValidationMessages';
import * as Yup from "yup";
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import OrderService from 'services/admin/order/OrderService';
import { useState } from 'react';
import { useEffect } from 'react';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
const UploadDocument = ({ orderDetail }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const [orderDocs, setOrderDocs] = useState([])
    const getOrderDoc = () => {
        dispatch(setAddLoading(true));
        OrderService.getOrderDocument(orderDetail?.orderNumber).then((response) => {
            if (response.data.data) {
                setOrderDocs(response.data.data);
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        })
    }
    useEffect(() => {
        if (orderDetail?.orderNumber) {
            getOrderDoc();
        }
    }, [orderDetail?.orderNumber])
    const saveDocument = (values, { resetForm }) => {
        OrderService.insertOrderDocument({
            orderDocumentsModel: [
                {
                    id: 0,
                    rowVersion: "",
                    orderId: orderDetail?.orderNumber,
                    imagePath: values.imagePath,
                    originalImageName: values.originalImageName,
                    imageDisplayOrder: 0,
                    recStatus: RecStatusValuebyName.Active,
                    ...location,
                }
            ]
        }
        ).then((response) => {
            if (response.data.success && response?.data?.data && response?.data?.data?.length > 0) {
                dispatch(setAlertMessage({
                    type: "success",
                    message: ValidationMsgs.order.docAdded
                }));
                getOrderDoc();
                resetForm({});
            } else {
                dispatch(setAlertMessage({
                    type: "danger",
                    message: serverError(response)
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
            dispatch(setAlertMessage({
                type: "success",
                message: ValidationMsgs.order.docNotAdded
            }));
        })
    }
    const validationSchema = Yup.object({
        imagePath: Yup.string().required(ValidationMsgs.order.fileRequired),
    });
    const updateStatusOrderDocument = (id, rowVersion) => {
        dispatch(setAddLoading(true));
        OrderService.updateStatusOrderDocument({
            args: {
                idsRowVersion: [
                    {
                        item1: id,
                        item2: rowVersion
                    }
                ],
                status: RecStatusValuebyName.Archived,
                ...location
            }
        }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(setAlertMessage({
                    type: "success",
                    message: ValidationMsgs.order.docDeleted
                }));
                getOrderDoc();
            } else {
                dispatch(setAlertMessage({
                    type: "danger",
                    message: serverError(response)
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        })
    }
    return (
        <>
            <div className="w-full justify-between bg-white px-5 py-3 pb-6 rounded-md shadow-lg">
                <div className="w-full mb-2 last:mb-0">
                    <div className="text-lg font-bold text-gray-500 text-left leading-10">Upload Documents</div>
                </div>
                {(permission?.isEdit || permission?.isDelete) && <Formik
                    enableReinitialize={true}
                    initialValues={{
                        id: 0,
                        rowVersion: "",
                        orderId: 0,
                        imagePath: "",
                        originalImageName: "",
                        recStatus: RecStatusValuebyName.Active,
                    }}
                    onSubmit={saveDocument}
                    validationSchema={validationSchema}
                >
                    {({ errors, setFieldValue, values }) => {
                        return (
                            <FormikForm>

                                <div className="w-full mb-2 last:mb-0">
                                    <File type="file" name="imagePath" value={values?.imagePath} folderpath={'Orders'} onChange={(path, currentFile) => { setFieldValue('imagePath', path); setFieldValue('originalImageName', currentFile) }} />
                                    <div className="text-xs mt-1">Only Accept PDF, JPEG, JPG and PNG Files</div>
                                </div>
                                <div className="w-full mb-2 last:mb-0">
                                    <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Upload</button>
                                </div>
                            </FormikForm>
                        )
                    }}
                </Formik>}
                <div className='px-5 pt-3'>
                    {orderDocs?.length > 0 && orderDocs.map((value, index) => {
                        return (
                            <Fragment key={index}>
                                <div className="w-full flex mb-2 mt-5 py-2 shadow-sm px-2 border bg-white items-center text-sm justify-between">
                                    <span>{value?.originalImageName}</span>
                                    <div>
                                        <a
                                            className="material-icons-outlined cursor-pointer inline-block text-indigo-500"
                                            href={process.env.REACT_APP_API_BLOB + value.imagePath}
                                            title={value?.originalImageName}
                                            target="_blank"
                                        >download</a>
                                        {(permission?.isDelete) && <span
                                            className="material-icons-outlined cursor-pointer inline-block text-red-500"
                                            onClick={() => {
                                                updateStatusOrderDocument(value.id, value.rowVersion)
                                            }}
                                        >delete</span>}
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
                {orderDocs?.length === 0 && <span>Document not available.</span>}
            </div>
        </>
    );
};

export default UploadDocument;

/*Component Name: Tag
Component Functional Details:  Tag .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useEffect } from 'react';
import { Form as FormikForm, Formik } from "formik";
import Input from 'components/common/formComponent/Input';
import { RecStatusValuebyName } from 'global/Enum';
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
import { useSelector } from 'react-redux';
import { Fragment } from 'react';
import { useCallback } from 'react';
import BasicModal from "components/common/modals/Basic";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import OrderTagService from 'services/admin/order/OrderTagService';
import * as Yup from 'yup'

const Tag = ({ orderDetail }) => {
    const permission = useSelector(store => store?.permission);
    const dispatch = useDispatch();
    const location = useSelector(store => store.location)
    const [tags, setTags] = useState([]);
    const [openBasicModal, setOpenBasicModal] = useState(false);
    const [tagInfo, setTagInfo] = useState(null);

    const onSubmit = (values, { resetForm }) => {
        dispatch(setAddLoading(true));
        OrderTagService.createOrderTag({ orderTagsModel: { ...values, ...location } }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.customer.tagCreated,
                    })
                );
                resetForm({});
                getTags();
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            dispatch(setAddLoading(false));
        }).catch((errors) => {
            dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.customer.tagNotCreated }));
            dispatch(setAddLoading(false));
        });
    }
    const getTags = useCallback(() => {
        dispatch(setAddLoading(true))

        OrderTagService.getOrderTags(orderDetail.orderNumber).then(response => {
            setTags(response.data.data);

            dispatch(setAddLoading(false))
        }).catch(errors => {
            dispatch(setAddLoading(false))
        });
    }, [orderDetail]);

    useEffect(() => {
        if (orderDetail.orderNumber) {
            getTags();
        }
    }, [orderDetail]);

    const changeTagStatus = (tagInfo) => {
        dispatch(setAddLoading(true))

        OrderTagService.updateStatus({
            args: {
                id: tagInfo.id,
                status: RecStatusValuebyName.Archived,
                rowVersion: tagInfo.rowVersion,
                ...location
            },
        })
            .then((response) => {
                if (response.data.success) {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "success",
                            message: ValidationMsgs.customer.tagDeleted,
                        })
                    );
                    getTags();
                } else {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "danger",
                            message: serverError(response)
                        })
                    );
                    dispatch(setAddLoading(false));
                }
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "danger",
                        message: ValidationMsgs.customer.tagNotDeleted
                    })
                );
                dispatch(setAddLoading(false));
            });
        setOpenBasicModal(false);
    }
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    orderNumber: orderDetail.orderNumber,
                    tagName: "",
                    recStatus: RecStatusValuebyName.Active,
                    rowVersion: "",
                }}
                onSubmit={onSubmit}
                validationSchema={Yup.object().shape({
                    tagName: Yup.string().required(ValidationMsgs.order.tagName)
                })}
            >
                {({ setFieldValue, errors, values }) => {
                    // console.log(errors);
                    return (
                        <FormikForm>
                            {/* <div className="w-full justify-between bg-white mb-4 rounded-md shadow-lg max-h-[30em] overflow-auto"> */}
                            <div className='w-full sticky top-0 bg-white px-5 py-3 shadow-md'>
                                <div className="w-full flex mb-2 justify-between items-center">
                                    <div className="text-lg font-bold text-gray-500 text-left leading-10">Tags</div>
                                </div>
                                {(permission?.isEdit || permission?.isDelete) && <div className="w-full mb-2 ">
                                    <Input type="text" name={'tagName'} />
                                </div>}
                                <div className=''>
                                    {tags.length > 0 ? tags.map((tag, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <div className="w-full flex mb-2 mt-5 py-2 shadow-sm px-2 border items-center text-sm justify-between bg-slate-100 rounded-lg">
                                                    <span>{tag.tagName}</span>
                                                    {(permission?.isDelete) && <span
                                                        className="material-icons-outlined cursor-pointer inline-block text-red-500"
                                                        onClick={() => {
                                                            setTagInfo(tag);
                                                            setOpenBasicModal(true);
                                                        }}
                                                    >delete</span>}
                                                </div>
                                            </Fragment>
                                        );
                                    }) : <span className='text-center'>Tag is not available</span>}
                                </div>
                            </div>
                            {/* </div> */}
                        </FormikForm>
                    )
                }}
            </Formik>
            <BasicModal
                handleConfirmation={changeTagStatus}
                openModal={openBasicModal}
                setOpenModal={setOpenBasicModal}
                title={"Delete Tag"}
                message={'Are you sure you want to delete this Tag?'}
                data={tagInfo}
                ButtonName={'Yes'}
            />
        </>
    );
};

export default Tag;

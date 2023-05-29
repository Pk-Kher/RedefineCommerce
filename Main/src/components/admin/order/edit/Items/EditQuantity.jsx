/*Component Name: EditQuantity
Component Functional Details:  EditQuantity .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import { useDispatch } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import OrderService from 'services/admin/order/OrderService';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
import { ValidationMsgs } from 'global/ValidationMessages';
import InputNumber from 'components/common/formComponent/InputNumber';
import { useSelector } from 'react-redux';
import FormErrorMessage from 'components/common/alerts/FormErrorMessage';
import * as Yup from "yup";

const EditQuantity = ({ setEditQtyModal, editQtyModal, getData, orderDetail }) => {
    // const [searchParams] = useSearchParams();
    // console.log(searchParams.get('pk'));
    const location = useSelector(store => store.location);
    const [variation, setVariation] = useState([]);
    const dispatch = useDispatch();
    const { id } = useParams();
    const getItemVariation = useCallback(() => {
        dispatch(setAddLoading(true));
        OrderService.getOrderItemVariations(editQtyModal?.orderItem?.id).then(response => {
            if (response?.data?.success && response?.data?.data) {
                setVariation(response.data.data);
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
        })
    }, [editQtyModal?.orderItem?.id])
    useEffect(() => {
        if (editQtyModal?.orderItem?.id) {
            getItemVariation(editQtyModal?.orderItem?.id);
        }
    }, [editQtyModal?.orderItem?.id])
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!editQtyModal?.show || keyCode !== 27) return;
            setEditQtyModal(prev => ({ ...prev, show: false }));
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });
    const submitHandler = (values, { resetForm }) => {
        dispatch(setAddLoading(true));
        OrderService.editOrderItemQuantity({
            orderedShoppingCartItemsId: editQtyModal?.orderItem?.id,
            ...values,
            orderId: orderDetail?.orderNumber,
            ...location
        }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                dispatch(setAlertMessage({
                    message: ValidationMsgs.order.updateQty,
                    type: 'success'
                }));
                getData();
                setEditQtyModal(prev => ({ ...prev, show: false }));
            } else {
                dispatch(setAlertMessage({
                    message: serverError(response),
                    type: 'dander'
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAddLoading(false));
            dispatch(setAlertMessage({
                message: ValidationMsgs.order.updateNotQty,
                type: 'dander'
            }));
        })
    }
    return (
        <>
            <div
                className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-30 transition-opacity ${!editQtyModal?.show && 'hidden'}`}
                onClick={() => setEditQtyModal(prev => ({ ...prev, show: false }))}
            />
            <div
                className={`fixed inset-0 z-30 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6 ${!editQtyModal?.show && 'hidden'}`}
            >
                <div className="relative bg-white rounded shadow-lg overflow-auto max-w-4xl w-full max-h-full z-30" >
                    <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl"> Order History </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="customerModal"
                            onClick={() => setEditQtyModal(prev => ({ ...prev, show: false }))}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path className="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                            </svg>
                        </button>
                    </div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            details: variation || []
                        }}
                        onSubmit={submitHandler}
                        validationSchema={Yup.object({
                            details: Yup.array()
                                .of(
                                    Yup.object({
                                        qty: Yup.number().required("Quantity is required."),
                                    })
                                )
                        })}
                    >
                        {({ errors, setFieldValue, values, setFieldError }) => {
                            return (
                                <FormikForm>
                                    <div className="col-span-full xl:col-span-9">
                                        <div className="w-full bg-white rounded-md mb-6">
                                            <div className="p-6 divide-y divide-gray-300">
                                                {
                                                    values?.details?.map((value, index) => {
                                                        // // value = { ...value, minQuantity: 4, multipleQuantity: 4, inventory: 4 };
                                                        value = { ...value, /* minQuantity: 5, multipleQuantity: 3, */ inventory: (value?.qty ? value?.qty : 0) + value?.inventory };
                                                        return (
                                                            <div className="flex items-center flex-wrap justify-between gap-2 py-2" key={index}>
                                                                <div className="">Size : {value?.sizeName}</div>
                                                                <div className="flex items-center flex-wrap gap-2">
                                                                    <div className=""><label className="block uppercase tracking-wide text-gray-500 text-xs font-bold" htmlFor="grid-first-name">Quantity</label></div>
                                                                    <QtyInput value={value} setFieldValue={setFieldValue} index={index} setFieldError={setFieldError} />
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                                                <button type={Object.keys(errors).length > 0 ? 'button' : 'submit'} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Save</button>
                                                <button onClick={() => {
                                                    setEditQtyModal(prev => ({ ...prev, show: false }))
                                                }} type="button" className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </FormikForm>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default EditQuantity;

const QtyInput = ({ value, setFieldValue, setFieldError, index }) => {
    const [outOfStock, setOutOfStock] = useState(false);
    const checkQuantity = (currentQty, setValue = false) => {
        if (value?.multipleQuantity && value?.multipleQuantity > 0) {
            let qty = parseInt((currentQty && currentQty < value.minQuantity) ? value.minQuantity : currentQty);
            let inventory = value?.inventory - (parseInt(value?.inventory) % value?.multipleQuantity);
            if (qty <= value?.multipleQuantity && qty <= inventory) {
                if (setValue) {
                    setFieldValue(`details[${index}].qty`, value?.multipleQuantity);
                }
            } else {
                let temp = parseInt(qty) % value?.multipleQuantity;
                if (temp !== 0) {
                    qty = ((qty - temp) + value?.multipleQuantity);
                }
                if (qty > inventory) {
                    qty = inventory;
                }
                if (value?.minQuantity > inventory) {
                    setOutOfStock('Product is out of stock.');
                    setFieldError(`details[${index}].qty`, 'Product is out of stock.');
                } else {
                    if (setValue) {
                        setFieldValue(`details[${index}].qty`, qty);
                    }
                }
            }
        } else {
            if (setValue) {
                setFieldValue(`details[${index}].qty`, currentQty);
            }
        }
    }
    useEffect(() => {
        checkQuantity(value?.qty);
    }, [value?.qty]);
    return (
        <div className="">
            <InputNumber name={`details[${index}].qty`} allowNegative={false} value={value?.qty} displayError={true} onChange={(e) => {
                setFieldValue(`details[${index}].qty`, e.target.value);
            }} maxLength={10} onBlur={(e) => {
                setOutOfStock(false);
                checkQuantity(e.target.value, true);
            }} />
            <ErrorMessage name={`details[${index}].qty`} component={FormErrorMessage} />
            {outOfStock && <FormErrorMessage >{outOfStock}</FormErrorMessage>}
        </div>
    )
}

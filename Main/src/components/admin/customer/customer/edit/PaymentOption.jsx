/*Component Name: PaymentOption
Component Functional Details:  PaymentOption .
Created By: PK Kher
Created Date: <Creation Date>
Modified By:chandan
Modified Date: <Modified Date> */

import CreditCardInfoTile from 'components/common/CreditCardInfoTile';
import React, { useEffect, useState } from 'react';
import { Form as FormikForm, Formik } from "formik";
import ToggleButton from 'components/common/formComponent/ToggleButton';
import Input from 'components/common/formComponent/Input';
import { ValidationMsgs } from 'global/ValidationMessages';
import { useParams } from 'react-router-dom';
import * as Yup from "yup"
import { useDispatch, useSelector } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
import CustomerService from 'services/admin/customer/CustomerService';
import InputNumber from 'components/common/formComponent/InputNumber';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const PaymentOption = ({ customerInfo }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const location = useSelector(store => store.location);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    const [CreditCardInfo, setCreditCardInfo] = useState([]);

    const onSubmit = (values, { resetForm }) => {
        dispatch(setAddLoading(true))

        CustomerService.createPO({ customerPONumberModel: values }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.customer.poCreated,
                    })
                );
                getCustomerCreditCardsById()
                resetForm({});
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            dispatch(setAddLoading(false))
        }).catch((errors) => {
            dispatch(
                setAlertMessage({ type: "danger", message: ValidationMsgs.customer.poNotCreated })
            );
            dispatch(setAddLoading(false))
        });
    };

    const getCustomerCreditCardsById = () => {
        dispatch(setAddLoading(true))
        if (id) {
            CustomerService.getCustomerCreditCardsById(id, 0)
                .then((response) => {
                    if (response?.data?.success && response?.data) {
                        setCreditCardInfo(response?.data?.data)
                        dispatch(setAddLoading(false))
                    }
                }).catch((errors) => {
                    dispatch(setAddLoading(false))
                });
        }
    }

    const validationSchema = Yup.object({
        poNumber: Yup.string().when("isGeneralPo", {
            is: false,
            then: Yup.string().required(ValidationMsgs.customer.poNumberRequired)
        }),
        amount: Yup.number(ValidationMsgs.customer.notValidAmount).when("isGeneralPo", {
            is: false,
            then: Yup.number(ValidationMsgs.customer.notValidAmount).required(ValidationMsgs.customer.amount)
        }),
    });

    useEffect(() => {
        getCustomerCreditCardsById()
    }, [])


    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    customerId: customerInfo.id,
                    isGeneralPo: CreditCardInfo?.poDetail?.isGeneralPo || false,
                    poNumber: CreditCardInfo?.poDetail?.poNumber || '',
                    amount: CreditCardInfo?.poDetail?.amount || '',
                    ...location,
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({ setFieldValue, errors, values }) => {
                    return (
                        <FormikForm>
                            <div className='grow'>
                                <div className='p-6 space-y-6'>
                                    <div>
                                        <div className="w-full text-base font-bold mb-4">Credit card information</div>
                                        <div className='grid grid-cols-12 gap-6 mb-6'>
                                            {CreditCardInfo?.creditCards?.length > 0 ? CreditCardInfo?.creditCards?.map((CreditCardData) => {
                                                return (
                                                    <CreditCardInfoTile CreditCardData={CreditCardData} />
                                                )
                                            })
                                                : <label className='flex text-red-400'>No Data Found!</label>
                                            }
                                        </div>
                                        <div className="w-full text-base font-bold mb-4">PO Information</div>
                                        <div className="grid grid-cols-12 gap-6" >
                                            <div className="col-span-4">
                                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">General PO <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                <div className="flex items-center">
                                                    <div className="w-16 relative">
                                                        <input type="checkbox" id="default-bill-1" className="sr-only" />
                                                        <ToggleButton
                                                            id={"isGeneralPo"}
                                                            name={"isGeneralPo"}
                                                            defaultValue={values.isGeneralPo}
                                                            onChange={(e) => {
                                                                setFieldValue('isGeneralPo', e.target.checked)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {!values.isGeneralPo && <>
                                                <div className="col-span-4" >
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">PO Number <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                    <Input name={'poNumber'} type="text" placeholder="" />
                                                </div>
                                                <div className="col-span-4" >
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Amount <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                    <InputNumber value={values.amount} name={'amount'} displayError={true} onChange={(e) => {
                                                        setFieldValue('amount', e.target.value);
                                                    }} />
                                                    {/* <Input name={'amount'} type="text" placeholder="" /> */}
                                                </div>

                                                <div className="col-span-12 flex flex-wrap justify-center space-x-2">
                                                    <button className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700">Cancel</button>
                                                    <button
                                                        disabled={GlobalLoading}
                                                        className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? " bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}>
                                                        <div className={`w-full flex justify-center align-middle `}>
                                                            {GlobalLoading && (
                                                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                                            )}
                                                            Save
                                                        </div>
                                                    </button>
                                                </div></>}
                                        </div>
                                    </div >

                                </div >
                            </div >
                        </FormikForm>
                    )
                }}
            </Formik>
        </>
    );
};

export default PaymentOption;

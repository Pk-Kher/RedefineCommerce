/*Component Name: CreditInfo
Component Functional Details:  CreditInfo .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useCallback } from 'react';
import { Form as FormikForm, Formik } from "formik";
import { paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat, serverError } from 'services/common/helper/Helper';
import * as Yup from "yup";
import InputNumber from 'components/common/formComponent/InputNumber';
import Input from 'components/common/formComponent/Input';
import CustomerCreditService from 'services/admin/customerCreadit/CustomerCreditService';
import { useSelector, useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { ValidationMsgs } from 'global/ValidationMessages';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const CreditInfo = ({ customerInfo }) => {
    const dispatch = useDispatch();
    const location = useSelector(store => store.location);
    const [availableCredit, setAvailableCredit] = useState(0);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    const permission = useSelector(store => store?.permission)

    const COLUMNS = [
        {
            id: "balanceAmount",
            Header: "Allowance Balance",
            accessor: "balanceAmount",
            column_name: "balanceAmount",
        },
        {
            id: "creditAmount",
            Header: "credit",
            accessor: "creditAmount",
            column_name: "creditAmount",
        },
        {
            id: "reason",
            Header: "Reason",
            accessor: "reason",
            column_name: "reason",
        },
        {
            id: "createdBy",
            Header: "Given By",
            accessor: "createdBy",
            column_name: "createdBy",
        },
        {
            id: "Date",
            Header: "date",
            accessor: "createdDate",
            column_name: "Date",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    "-"
                );
            },
        },
    ];
    const [Data, setData] = useState([]);
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "name",
            direction: 0,
            priority: 0,
        },
    ]);
    const [paginationData, setPaginationData] = useState({
        ...paginationDetails,
    });
    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const setSortingOptionHandler = (column, direction) => {
        setSortingOptions([
            {
                field: column,
                direction: direction,
                priority: 0,
            },
        ]);
    };
    const [filteringOptions, setColumnFilteringOptions] = useState([]);

    const getCreditInfo = useCallback(
        (pageIndex = 1) => {
            dispatch(setAddLoading(true))

            CustomerCreditService.getCustomerCreditList({
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions,
                },
                customerid: customerInfo.id
            }).then((response) => {
                let responseData = response.data.data;
                setData(responseData?.items);
                getAvailableBalance();
                setPaginationData((prevState) => ({
                    ...prevState,
                    pageIndex: responseData.pageIndex,
                    pageSize: responseData.pageSize,
                    totalCount: responseData.totalCount,
                    totalPages: responseData.totalPages,
                    hasPreviousPage: responseData.hasPreviousPage,
                    hasNextPage: responseData.hasNextPage,
                }));
            }).catch(() => {
                dispatch(setAddLoading(false))
            })
        },
        [
            filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex,
        ]
    );
    const getAvailableBalance = useCallback(() => {
        dispatch(setAddLoading(true))

        CustomerCreditService.getCustomerCreditById(customerInfo.id).then(response => {
            if (response.data.data) {
                setAvailableCredit(response.data.data);
            }
            dispatch(setAddLoading(false))
        }).catch(() => {
            dispatch(setAddLoading(false))
        })
    }, []);

    const onSubmit = (values, { resetForm }) => {
        dispatch(setAddLoading(false))

        CustomerCreditService.createCustomerCredit({
            customerCreditModel: {
                ...values,
                ...location
            }
        })
            .then((response) => {
                if (response.data.success && response.data.data) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.tier.tierCreated,
                        })
                    );
                    getCreditInfo();
                    resetForm({})
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    );
                    dispatch(setAddLoading(false))
                }
            }).catch((errors) => {
                dispatch(
                    setAlertMessage({ type: "danger", message: ValidationMsgs.tier.tierNotCreated })
                );
                dispatch(setAddLoading(false))
            });
    }
    const validationSchema = Yup.object({
        creditAmount: Yup.number(ValidationMsgs.customer.notValidAmount).min(0.1, ValidationMsgs.customer.creditAmountRequired),
        reason: Yup.string().required(ValidationMsgs.customer.reasonRequired),
    });
    return (
        <>
            <div className='grow'>
                <div className='p-6 space-y-6'>
                    <div>

                        <div className='grid grid-cols-1 gap-6'>
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    id: 0,
                                    customerId: customerInfo.id,
                                    creditAmount: 0,
                                    reason: "",
                                    recStatus: "A",
                                    rowVersion: '',
                                    isCredit: "C"
                                }}
                                onSubmit={onSubmit}
                                validationSchema={validationSchema}
                            >
                                {({ setFieldValue, errors, values, setValues, resetForm }) => {
                                    return (
                                        <FormikForm>
                                            <div className="flex flex-wrap justify-start items-center">
                                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Available Cedit: </label>
                                                <span className="block uppercase tracking-wide text-gray-500 text-base ml-5 font-bold mb-2">$ {availableCredit}</span>
                                            </div>
                                            {(permission?.isEdit || permission?.isDelete) &&
                                                <>
                                                    <div>
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Credit Amount <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <InputNumber name={'creditAmount'} allowNegative={false} placeholder="" value={values.creditAmount} displayError={true} onChange={(e) => { setFieldValue('creditAmount', e.target.value) }} />
                                                    </div>
                                                    <div>
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Reason <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input type="text" placeholder="" name={'reason'} />
                                                    </div>
                                                    <div className="flex flex-wrap justify-center space-x-2 mt-2">
                                                        <button type='button' className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700">Cancel</button>
                                                        <button
                                                            disabled={GlobalLoading}
                                                            type='submit' className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}>
                                                            <div className={`w-full flex justify-center align-middle `}>
                                                                {GlobalLoading && (
                                                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                                                )}
                                                                Save
                                                            </div>
                                                        </button>
                                                    </div>
                                                </>
                                            }
                                        </FormikForm>
                                    )
                                }}
                            </Formik>
                            <div>
                                <ReactTableServerSide
                                    COLUMNS={COLUMNS}
                                    DATA={Data}
                                    {...paginationData}
                                    setTablePageSize={(value) =>
                                        setPaginationDataFunc("pageSize", value)
                                    }
                                    fetchData={getCreditInfo}
                                    sortingOptions={sortingOptions}
                                    filteringOptions={filteringOptions}
                                    setColumnFilteringOptions={setColumnFilteringOptions}
                                    setSortingOptions={setSortingOptionHandler}
                                    hiddenColumns={['rowSelection']}
                                    tablePadding={'px-4 pb-4'}

                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default CreditInfo;

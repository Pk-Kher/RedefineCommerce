/*Component Name: AdvancedSearchModal
Component Functional Details: User can create or update AdvancedSearchModal master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useEffect } from 'react';
import { Formik, Form as FormikForm } from "formik";
import Input from 'components/common/formComponent/Input';
import Dropdown from 'components/common/formComponent/Dropdown';
const AdvancedSearchModal = ({ setAdvancedSearch, Countries }) => {

    const onSubmit = (fields, { resetForm }) => {
        console.log(fields);
    };

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    refOrderNo: "",
                    PONo: "",
                    custEmail: "",
                    paymentMethod: "",
                    zipCode: "",
                    transactionStatus: "",
                    compName: "",
                    state: "",
                    couponCode: "",
                    country: "",
                    custId: "",
                    creditCardNo: "",
                    productName: "",
                    SKU: "",
                    salesAgent: "",
                }}
                onSubmit={onSubmit}
            >
                {({ resetForm, errors, values }) => {
                    return (
                        <FormikForm>
                            <div id="advancedSearchModal" aria-hidden="true" className={`overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0`}
                            >
                                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="relative px-4 w-full max-w-7xl h-full md:h-auto">
                                        <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                                            <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                                                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                                                    Advance Search
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => { setAdvancedSearch(false); resetForm() }}
                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                                    data-modal-toggle="advancedSearchModal"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="px-5 pt-4 pb-1">
                                                <div className="w-full flex items-center justify-center">
                                                    <div className="w-full">
                                                        <div className="grid grid-cols-12 gap-6 mb-6">
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Ref. Order No</label>
                                                                    <Input
                                                                        type="text"
                                                                        name="refOrderNo"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">P.O. Number</label>
                                                                    <Input
                                                                        type="text"
                                                                        name="PONo"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Customer E-Mail</label>
                                                                    <Input
                                                                        type="text"
                                                                        name="custEmail"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Payment Method</label>
                                                                    <Dropdown
                                                                        label="Payment Method"
                                                                        isMulti={false}
                                                                        name="paymentMethod"
                                                                        options={{ 0: "All", 1: "Cash", 2: "Credit Card", 3: "PayPal", 4: "Other" }}
                                                                        defaultValue={values.paymentMethod}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">ZIP Code</label>
                                                                    <Input
                                                                        type="text"
                                                                        name="zipCode"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Transaction Status</label>
                                                                    <Dropdown

                                                                        isMulti={false}
                                                                        name="transactionStatus"
                                                                        options={{ 0: "All", 1: "Authorized", 2: "Captured", 3: "Refunded", 4: "Partially Refunded", 5: "Fraud" }}
                                                                        defaultValue={values.transactionStatus}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Company Name</label>
                                                                    <Input
                                                                        type="text"
                                                                        name="compName"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">State</label>
                                                                    <Dropdown
                                                                        isMulti={false}
                                                                        name="state"
                                                                        options={{}}
                                                                        defaultValue={values.state}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Coupon Code</label>
                                                                    <Dropdown
                                                                        isMulti={false}
                                                                        name="couponCode"
                                                                        options={{}}
                                                                        defaultValue={values.couponCode}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Country</label>
                                                                    <Dropdown

                                                                        isMulti={false}
                                                                        name="country"
                                                                        options={{}}
                                                                        defaultValue={values.country}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Customer ID</label>
                                                                    <Input
                                                                        type="text"
                                                                        name="custId"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Credit Card Number</label>
                                                                    <Input
                                                                        type="text"
                                                                        name="creditCardNo"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Product Name</label>
                                                                    <Input
                                                                        type="text"
                                                                        name="ProductName"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">SKU</label>
                                                                    <Input
                                                                        type="text"
                                                                        name="SKU"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex-col col-span-full sm:col-span-6 xl:col-span-4">
                                                                <div className="w-full mb-6">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Sales Agent</label>
                                                                    <Dropdown
                                                                        isMulti={false}
                                                                        name="salesAgent"
                                                                        options={{}}
                                                                        defaultValue={values.salesAgent}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                                                <button
                                                    data-modal-toggle="advancedSearchModal"
                                                    type="button"
                                                    onClick={() => { setAdvancedSearch(false); resetForm() }}
                                                    className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    data-modal-toggle="advancedSearchModal"
                                                    type="submit"
                                                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </FormikForm>
                    );
                }}
            </Formik>
        </>

    )
};

export default AdvancedSearchModal;

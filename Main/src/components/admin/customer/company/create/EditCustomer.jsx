/*Component Name: EditCustomer
Component Functional Details:  EditCustomer .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import Select from 'components/common/formComponent/Select';
import React, { useState } from 'react';
import { Formik, Form as FormikForm } from "formik";
import { RecStatusValuebyName } from 'global/Enum';
import * as Yup from 'yup';
import { ValidationMsgs } from 'global/ValidationMessages';
import { useSelector } from "react-redux";

const EditCustomer = ({ setShowEditCustomer }) => {
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    const [data, setData] = useState({});
    const schema = Yup.object().shape({
        store: Yup.string().required(ValidationMsgs.company.name),
        firstName: Yup.string().required(ValidationMsgs.company.state),
        lastName: Yup.string().required(ValidationMsgs.company.city),
        postal_code: Yup.string().required(ValidationMsgs.company.postal_code),
        country: Yup.string().required(ValidationMsgs.company.country),
        email: Yup.string().required(ValidationMsgs.company.email),
        recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
    });
    const submitHandler = (values, { resetForm }) => {

    }

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    id: data?.id || 0,
                    name: data?.name || "",
                    departmentName: data?.departmentName || "",
                    address1: data?.address1 || "",
                    address2: data?.address2 || "",
                    apt_suite: data?.apt_suite || '',
                    city: data?.city || '',
                    state: data?.state || '',
                    postal_code: data?.postal_code || '',
                    country: data?.country || '',
                    country_code: data?.country_code || '',
                    webSite: data?.webSite || '',
                    email: data?.email || '',
                    phone: data?.phone || '',
                    fax: data?.fax || '',
                    tax: data?.tax || false,
                    tags: data?.tags || '',
                    recStatus: data?.recStatus || RecStatusValuebyName.Active,
                    rowVersion: data?.rowVersion || null,
                }}
                onSubmit={submitHandler}
                validationSchema={schema}
            >
                {({ errors, setFieldValue, values }) => {
                    return (
                        <FormikForm>
                            <div id="editcustomerModal" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0">
                                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="relative px-4 w-full max-w-4xl h-full md:h-auto">
                                        <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                                            <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                                                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">Edit Customer</h3>
                                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={() => setShowEditCustomer(prev => !prev)}>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Store <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Select options={[]} name={'store'} />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> NAV ID <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <input
                                                            className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                                                            type="text"
                                                            placeholder="First Name"
                                                            disabled="disabled"
                                                        />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> First Name <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <input
                                                            className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                                                            type="text"
                                                            placeholder="First Name"
                                                        />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Last Name <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <input
                                                            className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                                                            type="text"
                                                            placeholder="Last Name"
                                                        />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Email <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <input
                                                            className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                                                            type="email"
                                                            placeholder="Email"
                                                        />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Status <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <div className="flex items-center" x-data="{ checked: true }">
                                                            <div className="w-16 relative">
                                                                <input type="checkbox" id="edit-customer-status" className="sr-only" x-model="checked" />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Is Super User <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <div className="flex items-center" x-data="{ checked: true }">
                                                            <div className="w-16 relative">
                                                                <input type="checkbox" id="edit-customer-super-user" className="sr-only" x-model="checked" />

                                                            </div>
                                                        </div>
                                                    </div >
                                                </div >
                                            </div >
                                            <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                                                <button data-modal-toggle="editcustomerModal" type="button" className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={() => setShowEditCustomer(prev => !prev)}>Cancel</button>
                                                <button
                                                    disabled={GlobalLoading}
                                                    data-modal-toggle="editcustomerModal" type="button" className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                                                >
                                                    <div className={`w-full flex justify-center align-middle `}>
                                                        {GlobalLoading && (
                                                            <span className="spinner-border spinner-border-sm mr-2"></span>
                                                        )}
                                                        Save
                                                    </div>
                                                </button>
                                            </div>
                                        </div >
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

export default EditCustomer;

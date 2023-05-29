/*Component Name: StepTwo
Component Functional Details:  StepTwo .
Created By: Shrey Patel
Created Date: 14-02-2023
Modified By: <Modified By>
Modified Date: <Modified Date> */

import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { blobFolder } from "global/Enum";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ValidationMsgs } from "global/ValidationMessages";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Transition from "utils/Transition";
import ProductService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import ImportExportService from "services/admin/masterCatalog/masterCatalog/products/ImportExportService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { serverError } from "services/common/helper/Helper";
import CustomerCreditService from "services/admin/customerCreadit/CustomerCreditService";
import DropdownService from "services/common/dropdown/DropdownService";
import Dropdown from "components/common/formComponent/Dropdown";

const data = [
    { name: "Anom", age: 19, gender: "Male" },
    { name: "Megha", age: 19, gender: "Female" },
    { name: "Subham", age: 25, gender: "Male" },
]

const StepTwo = ({ openModal, setOpenModal }) => {
    const location = useSelector((store) => store?.location);
    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id);
    const dispatch = useDispatch()
    const AdminId = useSelector((store) => store?.user?.id);
    const [storeOptions, setStoreOptions] = useState([]);
    const [StoreFilter, setStoreFilter] = useState(0);
    const [Data, setData] = useState([]);
    const [seDetailsData, setDetailsData] = useState([]);

    useEffect(() => {
        DropdownService.getDropdownValues('store').then((response) => {
            setStoreOptions(response.data.data);
        }).catch(() => {
        });
    }, [])

    const validationSchema = Yup.object({
        file: Yup.string().required(ValidationMsgs.common.importFileRequired),
        storeId: Yup.number().required("Store is Required"),
    });

    const onSubmit = (fields, { resetForm }) => {
        dispatch(setAddLoading(true))

        const formData = new FormData();
        formData.append("UserId", AdminId);
        formData.append("StoreId", StoreFilter);
        formData.append("file", fields.file);
        formData.append("other.ExportType", 34);
        formData.append("other.Browser", location.browser);
        formData.append("other.Location", location.location);
        formData.append("other.IPAddress", location.ipAddress);
        formData.append("other.MACAddress", location.macAddress);
        CustomerCreditService.ImportCreditData(formData)
            .then((response) => {
                if (response.data.success) {
                    setData(response?.data?.data?.subRows)
                    setDetailsData(response?.data?.data?.subRows?.creditDetails)
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: "Data Imported Successfully",
                        })
                    );
                    resetForm({})
                    setOpenModal(true)
                } else {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: serverError(response),
                        })
                    );
                }
                dispatch(setAddLoading(false))
            })
            .catch(() => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.product.export.importFailed,
                    })
                );
                setOpenModal(false)
                dispatch(setAddLoading(false))
            });
    };

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{ storeId: 0, file: "" }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({ setFieldValue, values, resetForm }) => {
                    setStoreFilter(values.storeId || 0)
                    return (
                        <FormikForm>
                            <Transition
                                className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
                                show={openModal}
                                tag="div"
                                enter="transition ease-out duration-200 transform"
                                enterStart="opacity-0 -translate-y-2"
                                enterEnd="opacity-100 translate-y-0"
                                leave="transition ease-out duration-200"
                                leaveStart="opacity-100"
                                leaveEnd="opacity-0"
                            ></Transition>
                            <Transition
                                className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                                show={openModal}
                                tag="div"
                                id="basic-modal"
                                enter="transition ease-out duration-200 transform"
                                enterStart="opacity-0 -translate-y-2"
                                enterEnd="opacity-100 translate-y-0"
                                leave="transition ease-out duration-200"
                                leaveStart="opacity-100"
                                leaveEnd="opacity-0"
                            >
                                <div className="bg-white rounded shadow-lg overflow-auto md:overflow-visible max-w-lg w-full max-h-full">
                                    <div>
                                        <div className="px-5 py-3 border-b border-neutral-300">
                                            <div className="flex justify-between items-center">
                                                <div className="font-semibold text-gray-800">
                                                    Import CSV document
                                                </div>
                                                <button
                                                    className="text-gray-400 hover:text-gray-500"
                                                    type="button"
                                                    onClick={() => {
                                                        setData([]);
                                                        setOpenModal(false);
                                                        resetForm({});
                                                    }}
                                                >
                                                    <div className="sr-only">Close</div>
                                                    <svg className="w-4 h-4 fill-current">
                                                        <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div >
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Store <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                    <Dropdown options={storeOptions} name={'storeId'} defaultValue={values.storeId} />
                                                </div>
                                            </div >
                                        </div >
                                        <div className="p-4">
                                            <div className="mb-6">
                                                <label htmlFor="" className="block uppercase tracking-wide text-xs font-bold mb-2"> File :</label>
                                                <input type="file" name="file" id='file' onChange={(event) => { setFieldValue("file", event.currentTarget.files[0]); }}
                                                    className="w-full px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                                />
                                                <div div className="text-xs mt-1">
                                                    <div className="">The file must be under 20MBytes.</div>
                                                    <div className="">
                                                        You can import 25000 items at once.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {Data && Data.length > 0 && Data.map((CreditData, index) => {
                                            return (
                                                <>
                                                    <div className={`bg-white flex overflow-auto ml-14`} key={index}>
                                                        <div className={`w-full py-2`}>
                                                            <label className="font-semibold" >{CreditData.type} </label>
                                                            <table className={`w-96 table-auto border-2`}>
                                                                <thead className={`text-xs font-semibold uppercase text-gray-500 bg-slate-50 border-t border-b border-neutral-200`} >
                                                                    <tr>
                                                                        <th className={`px-2 first:pl-5 py-3 whitespace-nowrap`} >
                                                                            <div className={`font-semibold text-left w-52`}>{`E-Mail`}</div>
                                                                        </th>
                                                                        <th className={`px-2 first:pl-5 py-3 whitespace-nowrap`} >
                                                                            <div className={`font-semibold text-left`}>{`Credit`}</div>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className={`text-sm divide-y divide-slate-200`}>
                                                                    {console.log("abcd", CreditData.creditDetails)}
                                                                    {CreditData && CreditData.creditDetails && CreditData.creditDetails.length ? CreditData.creditDetails.map((creditDetailsData, index) => {
                                                                        return (
                                                                            <>
                                                                                <tr key={index}>
                                                                                    <td className={`px-2 first:pl-5 py-3 whitespace-nowrap`} >
                                                                                        <div className={`font-medium text-gray-800`}>{creditDetailsData?.email}</div>
                                                                                    </td>
                                                                                    <td className={`px-2 first:pl-5 py-3 whitespace-nowrap`} >
                                                                                        <div className={`font-medium text-gray-800`}>{creditDetailsData?.credit}</div>
                                                                                    </td>
                                                                                </tr>
                                                                            </>
                                                                        );
                                                                    }) :
                                                                        <label className="text-red-500 text-center">No Data Found!</label>
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}

                                        <div className="p-4 flex items-center justify-end space-x-2 border-t-2 border-neutral-200">
                                            <button
                                                className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                                                type="button"
                                                onClick={() => {
                                                    setData([]);
                                                    setOpenModal(false);
                                                    resetForm();
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="cursor-pointer btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
                                            // onClick={() => {
                                            //     resetForm();
                                            // }}
                                            >
                                                Import
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

export default StepTwo;

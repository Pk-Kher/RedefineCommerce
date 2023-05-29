/*Component Name: EditModal
Component Functional Details:  EditModal .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */
import { Form as FormikForm, Formik } from "formik";
import { useState, useEffect } from 'react';
import Dropdown from 'components/common/formComponent/Dropdown';
import DropdownService from 'services/common/dropdown/DropdownService';
import Input from 'components/common/formComponent/Input';
import ToggleButton from 'components/common/formComponent/ToggleButton';
import { RecStatusValuebyName } from 'global/Enum';
import { ValidationMsgs } from 'global/ValidationMessages';
import * as Yup from 'yup'
import CustomerService from 'services/admin/customer/CustomerService';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { serverError } from 'services/common/helper/Helper';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const EditModal = ({ showEdit, setShowEdit, customerInfo, getCustomerData }) => {
    const [stores, setStores] = useState([]);
    const location = useSelector((store) => store.location);
    const dispatch = useDispatch();
    useEffect(() => {
        DropdownService.getDropdownValues("store").then((res) => {
            if (res.data.success) {
                setStores(() => {
                    return res.data.data;
                });
            }
        });
    }, [setStores]);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    const validationSchema = Yup.object({
        storeId: Yup.string().required(ValidationMsgs.common.storeIdRequired),
        firstname: Yup.string().required(ValidationMsgs.common.firstNameRequired),
        lastName: Yup.string().required(ValidationMsgs.common.lastNameRequired),
        companyName: Yup.string().required(ValidationMsgs.customer.companyNameRequired),
        email: Yup.string().email(ValidationMsgs.common.Email),
        recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
    });
    const onSubmit = (values, { resetForm }) => {
        dispatch(setAddLoading(true))

        CustomerService.updateCustomer({ customerModel: { ...values, recStatus: (values.recStatus ? 'A' : 'I'), ...location } }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.customer.personalDetailUpdate,
                    })
                );
                getCustomerData();
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
                dispatch(setAddLoading(false))

            }
        }).catch((errors) => {
            dispatch(
                setAlertMessage({ type: "danger", message: ValidationMsgs.customer.personalDetailNotUpdate })
            );
            dispatch(setAddLoading(false))

        });
        setShowEdit(false);
    }
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    id: customerInfo.id || 0,
                    storeId: customerInfo.storeId || "",
                    firstname: customerInfo.firstname || "",
                    lastName: customerInfo.lastName || "",
                    email: customerInfo.email || "",
                    companyName: customerInfo.companyName || "",
                    isRegistered: customerInfo.isRegistered || true,
                    sharedCustomerId: customerInfo.sharedCustomerId || 0,
                    isLocked: customerInfo.isLocked || false,
                    navCustomerId: customerInfo.navCustomerId || "",
                    customerType: customerInfo.customerType || "credit",
                    isTaxableuser: customerInfo.isTaxableuser || false,
                    recStatus: customerInfo.recStatus || RecStatusValuebyName.Active,
                    rowVersion: customerInfo.rowVersion || "",
                    isSuperuser: customerInfo.isSuperuser || false,
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            //     validateOnChange={true}
            //     validateOnBlur={false}
            >
                {({ setFieldValue, errors, values }) => {
                    return (
                        <FormikForm>
                            <div id="editcustomerModal" className={`overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0 ${!showEdit && 'hidden'}`}>
                                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center" id="editCustomer" onClick={(e) => {
                                    if (e.target.id === 'editCustomer') {
                                        setShowEdit(false)
                                    }
                                }}>
                                    <div className="relative px-4 w-full max-w-4xl h-full md:h-auto">
                                        <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                                            <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                                                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">Edit Customer</h3>
                                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={() => { setShowEdit(prev => !prev) }}>
                                                    <span className="material-icons-outlined leading-10">close</span>
                                                </button>
                                            </div>
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Store <span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Dropdown options={stores} name={'storeId'} defaultValue={values.storeId} />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> NAV ID <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <Input
                                                            name={'navCustomerId'}
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> First Name <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <Input
                                                            name={'firstname'}
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Last Name <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <Input
                                                            type="text"
                                                            name="lastName"
                                                        />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Email <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <Input
                                                            type="email"
                                                            name={'email'}
                                                        />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Company Name <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <Input
                                                            type="companyName"
                                                            name={'companyName'}
                                                        />
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Status <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <div className="flex items-center" x-data="{ checked: true }">
                                                            <div className="w-16 relative">
                                                                <ToggleButton id={'recStatus'} name={'recStatus'} defaultValue={values.recStatus == 'A' ? true : false} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"> Is Super User <span className="text-rose-500 text-2xl leading-none"></span></label>
                                                        <div className="flex items-center" x-data="{ checked: true }">
                                                            <div className="w-16 relative">
                                                                <ToggleButton id={'isSuperuser'} name={'isSuperuser'} defaultValue={values.isSuperuser} />
                                                            </div>
                                                        </div>
                                                    </div >
                                                </div >
                                            </div >
                                            <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                                                <button type="button" className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={() => { setShowEdit(prev => !prev) }}>Cancel</button>
                                                <button
                                                    disabled={GlobalLoading}
                                                    type="submit" className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}>
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
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>

        </>
    );
};

export default EditModal;

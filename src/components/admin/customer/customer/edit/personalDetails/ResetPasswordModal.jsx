/*Component Name: Address
Component Functional Details:  Address .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import Transition from "utils/Transition";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import CustomerService from "services/admin/customer/CustomerService";

const ResetPasswordModal = ({ SetShowResetPassword, ShowResetPassword, customerInfo }) => {
    const [showPassword, setShowPassword] = useState(true);
    const dispatch = useDispatch();

    const ChangePassWordValidations = Yup.object().shape({
        currentPassword: Yup.string().required(ValidationMsgs.profile.myAccount.currentPasswordRequired),
        newPassword: Yup.string()
            .test(
                "setpassword",
                ValidationMsgs.profile.myAccount.newPasswordRequired,
                function (value) {
                    if (showPassword && value === undefined) return false;
                    return true;
                }
            )
            .min(8, ValidationMsgs.profile.myAccount.newPasswordMin).max(25, ValidationMsgs.profile.myAccount.newPasswordMax),
        confirm_password: Yup.string()
            .test(
                "setpassword",
                ValidationMsgs.profile.myAccount.confirm_passwordRequired,
                function (value) {
                    if (showPassword && value === undefined) return false;
                    return true;
                }
            )
            .when("newPassword", {
                is: (val) => (val && val.length > 0 ? true : false),
                then: Yup.string().oneOf(
                    [Yup.ref("newPassword")],
                    ValidationMsgs.profile.myAccount.confirm_passwordMatches
                ),
            }),
    });

    const ChangePasswordHandler = (values, { resetForm }) => {
        CustomerService.UpdatePassword({
            args: {
                id: customerInfo.id,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            },
        })
            .then((response) => {
                if (response.data.data) {
                    dispatch(
                        setAlertMessage({
                            message: ValidationMsgs.profile.myAccount.passwordChanged,
                            type: "success",
                        })
                    );
                } else {
                    dispatch(
                        setAlertMessage({
                            message: ValidationMsgs.profile.myAccount.validPassword,
                            type: "danger",
                        })
                    );
                }
            })
            .catch(() => { });
        SetShowResetPassword(false)
        resetForm({});
    };

    return (
        <>
            <Transition
                className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
                show={ShowResetPassword}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
                onClick={() => SetShowResetPassword(false)}
            />
            <Transition
                className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                show={ShowResetPassword}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div className="bg-white rounded shadow-lg overflow-auto max-w-[560px] w-full max-h-full" >
                    <div className="px-5 py-3 border-b border-neutral-200">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-gray-800">Reset Password</div>
                            <button className="text-gray-400 hover:text-gray-500" onClick={() => SetShowResetPassword(prev => !prev)}>
                                <div className="sr-only">Close</div>
                                <svg className="w-4 h-4 fill-current">
                                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"> </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <Formik
                        Formik
                        enableReinitialize={true}
                        initialValues={{
                            id: customerInfo.id,
                            currentPassword: "",
                            newPassword: "",
                            confirm_password: "",
                        }}
                        onSubmit={ChangePasswordHandler}
                        validationSchema={ChangePassWordValidations}
                        validateOnMount={true}
                    >
                        {({ errors, touched, setFieldValue, values, handleSubmit }) => {
                            return (
                                <>
                                    <Form>
                                        <div className="px-5">
                                            <div className="text-sm flex flex-wrap justify-start text-left -mx-4">
                                                <div className="w-full p-4">
                                                    <div className="col-span-12 md:col-span-6 mt-2">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Current Password<span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input
                                                            id="currentPassword"
                                                            disabled={!showPassword}
                                                            name="currentPassword"
                                                            className="form-input w-full"
                                                            type="password"
                                                            placeholder="Current Password"
                                                        />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6 mt-2">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">New Password<span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input
                                                            id="newPassword"
                                                            disabled={!showPassword}
                                                            name="newPassword"
                                                            className="form-input w-full"
                                                            type="password"
                                                            placeholder="New Password"
                                                        />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6 mt-2">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Re-enter New Password<span className="text-rose-500 text-2xl leading-none">*</span></label>
                                                        <Input
                                                            id="confirm_password"
                                                            disabled={!showPassword}
                                                            name="confirm_password"
                                                            className="form-input w-full"
                                                            type="password"
                                                            placeholder="Re-enter New Password"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-5 py-4">
                                            <div className="flex flex-wrap justify-end space-x-2">
                                                <button
                                                    className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}                                            >
                                                    <div className={`w-full flex justify-center align-middle `}>
                                                        Save
                                                    </div>
                                                </button>
                                                <button type='button' className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={() => SetShowResetPassword(prev => !prev)}>Cancel</button>
                                            </div>
                                        </div >

                                    </Form>
                                </>
                            );
                        }}
                    </Formik>
                </div >
            </Transition >
        </>
    );
};

export default ResetPasswordModal;




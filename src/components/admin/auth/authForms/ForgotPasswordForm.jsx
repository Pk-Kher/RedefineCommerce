/*Component Name: ForgotPasswordForm
Component Functional Details: User can create or update ForgotPasswordForm master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Messages from "components/common/alerts/messages/Index";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import AuthService from "services/admin/auth/AuthService";
import { ValidationMsgs } from "global/ValidationMessages";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companyInfo = useSelector(store => store?.CompanyConfiguration);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(ValidationMsgs.common.emailRequired)
      .email(ValidationMsgs.common.Email),
  });
  const onSubmit = (values) => {
    setLoading(true);
    AuthService.sendResetPasswordLink(values.email)
      .then((response) => {
        if (response.data.data.issend) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.profile.myAccount.forgotPasswordLink,
            })
          );
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: ValidationMsgs.profile.myAccount.emailNotSend,
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  return (
    <>
      <div className="relative items-center ">
        <div className="items-center z-10">
          <div className="min-h-screen h-full flex justify-center items-center w-full">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="sm:mx-auto sm:w-full sm:max-w-md -6 text-center justify-center mb-10">
                  <h1 className="text-3xl text-gray-800 font-bold mb-6 items-center text-center">
                    <img
                      src={companyInfo?.headerLogo}
                      alt="Redefine Commerce"
                      className="w-60 items-center mx-auto"
                    />
                  </h1>
                </div>
                <Messages />
                <Formik
                  initialValues={{ email: "" }}
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                >
                  <FormikForm className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >

                        Email address
                      </label>
                      <div className="mt-1">
                        <Field type="text" name="email" id="email" className={"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"} />
                        <ErrorMessage
                          name={"email"}
                          component={FormErrorMessage}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <button
                        type="submit"
                        className="w-full flex  justify-center align-middle"
                        disabled={loading}
                      >
                        <div
                          className={`w-full flex justify-center align-middle py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading
                            ? "bg-indigo-200 hover:bg-indigo-200"
                            : "cursor-pointer"
                            }`}
                        >
                          {loading === true && (
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                          )}
                          Send Reset Link
                        </div>
                      </button>
                    </div>
                    <div className="text-center">
                      <NavLink
                        to={"/login"}
                        className="w-full text-sm font-medium text-indigo-500 hover:text-indigo-600"
                      >
                        Back to Login
                      </NavLink>
                    </div>
                  </FormikForm>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordForm;

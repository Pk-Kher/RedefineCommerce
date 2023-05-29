/*Component Name: ChangePasswordForm
Component Functional Details: User can create or update ChangePasswordForm master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ValidationMsgs } from "global/ValidationMessages";
import AuthService from "services/admin/auth/AuthService";
import Messages from "components/common/alerts/messages/Index";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";

const ChangePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const companyInfo = useSelector(store => store?.CompanyConfiguration);

  const ChangePassWordValidations = Yup.object().shape({
    currentPassword: Yup.string().required(
      ValidationMsgs.profile.myAccount.currentPasswordRequired
    ),
    newPassword: Yup.string()
      .test(
        "setpassword",
        ValidationMsgs.profile.myAccount.newPasswordRequired,
        function (value) {
          if (value === undefined) return false;
          return true;
        }
      )
      .min(8, ValidationMsgs.profile.myAccount.newPasswordMin).max(25, ValidationMsgs.profile.myAccount.newPasswordMax),
    reEnterPassword: Yup.string()
      .test(
        "setpassword",
        ValidationMsgs.profile.myAccount.confirm_passwordRequired,
        function (value) {
          if (value === undefined) return false;
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
  useEffect(() => {
    AuthService.checkExpirePassword(id)
      .then((response) => {
        if (!response.data.data) {
          navigate("/login");
        }
      })
      .catch((error) => { });
  }, []);
  const onSubmit = useCallback((values) => {
    setLoading(true);
    AuthService.changeExpirePassword(values)
      .then((response) => {
        if (response.data.data.flag) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: response.data.data.msg,
            })
          );
          navigate("/login");
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: response.data.data.msg,
            })
          );
        }
        setLoading(false);
      })
      .catch((errors) => {
        setLoading(false);
      });
  });
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
                  initialValues={{
                    id: id,
                    currentPassword: "",
                    newPassword: "",
                    reEnterPassword: "",
                  }}
                  onSubmit={onSubmit}
                  validationSchema={ChangePassWordValidations}
                >
                  <FormikForm className="space-y-6">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <div className="mt-1">
                        <Field
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          className={"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"}
                        />
                        <ErrorMessage
                          name={"currentPassword"}
                          component={FormErrorMessage}
                        />
                      </div>
                    </div>
                    <div >
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="mt-1">
                        <Field
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          className={"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"}
                        />
                        <ErrorMessage
                          name={"newPassword"}
                          component={FormErrorMessage}
                        />
                      </div>
                    </div>
                    <div >
                      <label
                        htmlFor="reEnterPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Re-enter New Password
                      </label>
                      <div className="mt-1">
                        <Field
                          type="password"
                          name="reEnterPassword"
                          id="reEnterPassword"
                          className={"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"}
                        />
                        <ErrorMessage
                          name={"reEnterPassword"}
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
                          Save
                        </div>
                      </button>
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

export default ChangePasswordForm;

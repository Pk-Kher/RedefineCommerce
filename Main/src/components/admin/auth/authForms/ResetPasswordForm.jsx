/*Component Name: ResetPasswordForm
Component Functional Details: User can create or update ResetPasswordForm master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { ValidationMsgs } from "global/ValidationMessages";
import AuthService from "services/admin/auth/AuthService";
import Messages from "components/common/alerts/messages/Index";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, code } = useParams();
  const companyInfo = useSelector(store => store?.CompanyConfiguration);
  const validationSchema = Yup.object({
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
  const onSubmit = (values) => {
    setLoading(true);
    AuthService.resetPassword({ args: values })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.profile.myAccount.passwordChanged,
            })
          );
          navigate("/login");
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: ValidationMsgs.common.serverError,
            })
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.Errors) {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: err.response.data.Errors.Error,
            })
          );
        }
      });
  };

  useEffect(()=>{
    AuthService.checkPaswordLinkExpired({
      args:{
        id: id,
        code: code,
      }
    }).then((response)=>{
      if(response.data.data)
      {
         navigate("/login");
      }
    })
  },[])
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

                <Formik
                  initialValues={{
                    id: id,
                    code: code,
                    newPassword: "",
                    reEnterPassword: "",
                  }}
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                >
                  <FormikForm className="space-y-6">
                    <div className="text-center">
                      To make your account secure, please create a new Password
                      to replace the old Password.
                    </div>
                    <Messages />
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
                          className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md dropDownElem_unique`}
                          maxLength="25"
                        />
                        <ErrorMessage
                          name={"newPassword"}
                          component={FormErrorMessage}
                        />
                      </div>
                    </div>
                    <div >
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Re-enter New Password
                      </label>
                      <div className="mt-1">
                        <Field
                          type="password"
                          name="reEnterPassword"
                          id="reEnterPassword"
                          className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md dropDownElem_unique`}
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
                      >
                        <div
                          className={`w-full flex justify-center align-middle py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading
                            ? "bg-indigo-200 hover:bg-indigo-200"
                            : "cursor-pointer"
                            }`}
                        >
                          {loading && (
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

export default ResetPasswordForm;

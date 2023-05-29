/*Component Name: TwoFactorAuthenticationForm
Component Functional Details: User can create or update TwoFactorAuthenticationForm master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: Pradip Kher
Modified Date: 7/4/2022 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AuthService from "services/admin/auth/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { login } from "redux/auth/AuthAction";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import OTPInput, { ResendOTP } from "otp-input-react";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";


const TwoFactorAuthenticationForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [timerComplete, setTimerComplete] = useState(false);
  const [otpExpireTime, setOtpExpireTime] = useState(localStorage.getItem('pto_xe'));
  const [isDisplayed, setIsDisplayed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/Dashboard"
  const userId = useSelector((store) => store?.user?.id);
  const companyInfo = useSelector(store => store.CompanyConfiguration);
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, []);
  const [loading, setLoading] = useState(false);
  const setOptHandler = (value) => {
    setOtp(value);
  }
  const reSendOtp = () => {
    dispatch(setAddLoading(true));
    setTimerComplete(false);
    AuthService.getOtpTimeout(id).then((response) => {
      if (response.data.data.result) {
        dispatch(setAlertMessage(
          {
            type: 'success',
            message: ValidationMsgs.common.otpSend
          }

        ))
        setOtpExpireTime(response.data.data.otpExpirySeconds);
        setInterval(() => {
          setIsDisplayed(false);
        }, 8000);
      }
      dispatch(setAddLoading(false))
    }).catch(() => {
      dispatch(setAddLoading(false));
    })
  }
  const verifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    AuthService.verifyOtp(otp, id).then((response) => {
      if (response.data.data.result) {
        dispatch(login(response?.data.data));
        return navigate(from, { replace: true });
      } else if (response.data.data.msg) {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: response.data.data.msg,
          })
        );
        setLoading(false);
      } else {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.common.serverError,
          })
        );
        setLoading(false);
      }
      // dispatch(setAddLoading(false))
    }).catch(() => {
      setLoading(false);
    });
  }
  return (
    <>
      <div className="relative items-center">
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
                <form onSubmit={verifyOtp}>
                  <div className="space-y-6">
                    <div className="text-center">Two-Factor Authentication</div>
                    <div className="flex items-center justify-center">
                      <OTPInput inputStyles={{ marginRight: '0.5em', width: '3.438rem', height: '2.438rem' }} inputClassName="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center" value={otp} onChange={setOptHandler} autoFocus OTPLength={6} otpType="number" disabled={false} />
                    </div>

                    <div className="text-center">
                      A message with a verification code has been sent to your
                      devices. Enter the code to continue.
                    </div>
                    <div >
                      {/* {isDisplayed && <div className="text-center text-green-500 text-sm mb-1">
                        Verification code has been sent to your devices. Enter the
                        code to continue.
                      </div>} */}
                      <div className="text-center">
                        <ResendOTP onResendClick={reSendOtp} renderTime={renderTime} renderButton={({ remainingTime, ...props }) => <ResendButton {...props} timerComplete={timerComplete} remainingtime={remainingTime} setOptHandler={setOptHandler} />} maxTime={otpExpireTime} onTimerComplete={() => { setTimerComplete(true) }} />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center align-middle"
                        disabled={loading || otp.length !== 6}
                      >
                        <div
                          className={`w-full flex justify-center align-middle py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(loading || otp.length !== 6)
                            ? "bg-indigo-200 hover:bg-indigo-200"
                            : "cursor-pointer bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        >
                          {loading && (
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                          )}
                          Continue
                        </div>
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TwoFactorAuthenticationForm;
const ResendButton = ({ timerComplete, setOptHandler, ...rest }) => {
  return (
    <button type="button" disabled={!timerComplete} {...rest} onClick={(e) => {
      if (rest?.onClick instanceof Function) {
        rest.onClick(e);
      }
      setOptHandler('');
    }} className={`cursor-pointer inline-block text-sm font-medium ${timerComplete ? 'text-indigo-500 hover:text-indigo-600' : 'text-[#c7d2fe]'}`}>
      {/* Didn't get a verification code? */}Resend
    </button>
  );
}
const renderTime = (remainingTime) => {
  var minutes = Math.floor(remainingTime / 60);
  var seconds = remainingTime - minutes * 60;
  return <span>{(minutes <= 9 ? `0${minutes}` : minutes) + ' : ' + (seconds <= 9 ? `0${seconds}` : seconds)}</span>;
};

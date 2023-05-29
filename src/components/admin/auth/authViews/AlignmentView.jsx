/*Component Name: AlignmentView
Component Functional Details: Used to set central alignment styles for all Auth Forms.
Created By: Keval
Created Date: 13th July 2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ChangePasswordForm from "../authForms/ChangePasswordForm";
import ForgotPasswordForm from "../authForms/ForgotPasswordForm";
import LoginForm from "../authForms/LoginForm";
import ResetPasswordForm from "../authForms/ResetPasswordForm";
import TwoFactorAuthenticationForm from "../authForms/TwoFactorAuthenticationForm";

import { RIGHT, LEFT, CENTER } from 'global/Enum';
import ThemeConfigurationService from "services/admin/themeConfiguration/ThemeConfigurationService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch } from "react-redux";
import { useLayoutEffect } from "react";

const AlignmentView = ({ children }) => {
    let currentUser = useSelector((store) => store?.auth?.token);
    const navigate = useNavigate();
    const [themeData, setThemeData] = useState([]);
    const dispatch = useDispatch();
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);


    const location = useLocation();
    const { pathname } = location;

    useEffect(() => {
        if (currentUser) {
            navigate("/admin/dashboard");
            return;
        }
    }, [currentUser, navigate]);
    useLayoutEffect(() => {
        dispatch(setAddLoading(true));
        ThemeConfigurationService.getThemeConfiguration()
            .then((res) => {
                var response = res.data;
                if (response.success) {
                    setThemeData({
                        loginPageStyle: response.data.loginPageStyle,
                        AuthImage: response.data.loginBackgroundUrl,
                    });
                }
                dispatch(setAddLoading(false));
            })
            .catch((err) => {
                dispatch(setAddLoading(false));
            });
    }, [])

    const backgroundImage = `url(${process.env.REACT_APP_API_BLOB}${themeData?.AuthImage})`;
    const loginPageStyle = themeData?.loginPageStyle;
    const LoginPageImage = <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: backgroundImage }}></div>

    const AlignmentAttributes = useMemo(() => {
        return ({
            [LEFT]: {
                mainAttribute: {
                    className: "flex h-screen overflow-hidden"
                },
                subAttributes: {
                    className: "w-full md:w-1/2 overflow-y-auto"
                }
            },
            [RIGHT]: {
                mainAttribute: {
                    className: "flex h-screen overflow-hidden"
                },
                subAttributes: {
                    className: "w-full md:w-1/2 overflow-y-auto"
                }
            },
            [CENTER]: {
                mainAttribute: {
                    className: "bg-white bg-cover bg-center",
                    style: { backgroundImage: backgroundImage }
                }
            }
        })
    }, [backgroundImage]);

    if (GlobalLoading) {
        return "";
    }

    return (
        <>
            <main {...AlignmentAttributes[loginPageStyle]?.mainAttribute}>
                {loginPageStyle === RIGHT && LoginPageImage}

                <div {...AlignmentAttributes[loginPageStyle]?.subAttributes}>
                    {children}
                </div>

                {loginPageStyle === LEFT && LoginPageImage}
            </main>
        </>
    );
};

export default AlignmentView;

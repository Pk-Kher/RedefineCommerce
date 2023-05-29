import jwtDecode from "jwt-decode";
import React, { useCallback, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "redux/auth/AuthAction";
import { API } from "helpers/API";
import authHeader from "services/admin/auth/AuthHeader";
import RoleServices from "services/admin/role/RoleServices";
import { useState } from "react";
import { setPermission as setReduxPermission } from "redux/permission/PermissionActions"
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Unauthorize from "error/Unauthorize";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { user, auth, CompanyConfiguration } = useSelector((store) => store);
  const [permission, setPermission] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


  // determine if authorized, from context or however you're doing it
  // we need a api here to check if logged in user is correct or not {we need a end point as verify user which can verify our user }
  // return genuineUser =  verifyUser(auth)
  const logoutHandler = useCallback(() => {
    dispatch(logout());
    return navigate("/login", { replace: true });
  }, [dispatch, navigate]);
  useEffect(() => {
    try {
      if (auth?.token && auth?.isAuthorized) {
        const jwtToken = jwtDecode(String(auth?.token));
        if (Date.now() >= jwtToken.exp * 1000 || !jwtToken?.UserId) {
          return logoutHandler();
        }
      } else {
        return logoutHandler();
      }
    } catch (e) {
      return logoutHandler();
    }
  }, [auth?.isAuthorized, auth?.token]);

  useEffect(() => {
    if (user?.id && CompanyConfiguration?.id) {
      dispatch(setAddLoading(true))
      RoleServices.getUserPermission({
        userId: user.id,
        companyConfigurationId: CompanyConfiguration?.id,
        isSuperUser: user?.isSuperUser || false,
      }).then((response) => {
        if (response?.data?.data && response?.data?.data) {
          setPermission((response.data.data));
        }
        dispatch(setAddLoading(false))
      }).catch(() => {
        dispatch(setAddLoading(false))
      });
    }
  }, [user, CompanyConfiguration?.id]);

  useEffect(() => {
    if (permission) {
      var redirectUrl = permission?.length > 0 ? null : 'unauthorized';
      var UserPermission = null;
      let allPermission = {};
      for (var value of permission) {
        // allPermission = { ...allPermission, [value.navigationUrl]: value }
        if (location.pathname.toLocaleLowerCase().includes(value.navigationUrl.toLocaleLowerCase())) {
          if (((location.pathname.includes('create') || location.pathname.includes('edit')) && value.isEdit) ||
            (!location.pathname.includes('create') && (value.isView || value.isEdit)) ||
            value.isDelete) {
            UserPermission = value;
          } else {
            redirectUrl = "unauthorized";
          }
          break;
        } else {
          redirectUrl = "404"
        }
      }
      permission.map((value, index) => {
        allPermission = { ...allPermission, [value.navigationUrl.toLowerCase()]: value };
        return;
      });
      if (!UserPermission) {
        navigate(redirectUrl, { replace: true });
      } else {
        dispatch(setReduxPermission({ ...UserPermission, allPermission: allPermission }));
      }
    }
  }, [location.pathname, permission]);
  // console.log(permission, 'pkk');

  try {
    API.interceptors.response.use(function (response) {
      // dispatch(setAddLoading(false));
      return response;
    }, function (error) {
      if (error?.response?.status === 401) {
        logoutHandler();
      } else if (error?.response?.status === 404) {
        // navigate('/404');
      } else if (error?.Error) {
        dispatch(setAlertMessage({ type: "danger", message: error.Error }));
        dispatch(setAddLoading(false));
      } else {
        dispatch(setAddLoading(false));
      }
      return Promise.reject(error);
    });
    API.interceptors.request.use(function (config) {
      // dispatch(setAddLoading(true));
      config.headers = { ...authHeader() }
      return config;
    });
  }
  catch (e) {
    logoutHandler();
  }

  return permission ? <Outlet /> : "";
};

export default PrivateRoute;
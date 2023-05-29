import React, { useEffect, useState } from "react";
import { History } from "helpers/History";
import AppRoutes from "./routes/AppRoutes";

import "./App.css";

import "assets/css/common.css";
import "assets/css/tab.css";
import ErrorBoundary from "error/ErrorBoundary";
import { useDispatch, useSelector } from "react-redux";
import LocationServices from "services/common/location/LocationServices";
import { storeUserLocation } from "redux/location/LocationActions"
import { storeCompanyConfigurationData } from "redux/CompanyConfiguration/CompanyConfigurationActions"
import CompanyConfigurationService from "services/admin/companyConfiguration/CompanyConfigurationService";
import ThemeVariables from "components/admin/configurator/ThemeVariables";
import axios from "axios";
import jwtDecode from "jwt-decode";
import UserService from "services/admin/user/UserService";
import { setUser } from "redux/user/UserActions";
import GlobalLoader from "components/common/GlobalLoader";
import ThemeConfigurationService from "services/admin/themeConfiguration/ThemeConfigurationService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const App = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState({})
  const isAuthorized = useSelector((store) => store?.auth?.isAuthorized);
  const token = useSelector((store) => store?.auth?.token);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  useEffect(() => {
    LocationServices.getLocation().then((response) => {
      if (response?.data) {
        dispatch(storeUserLocation({
          location: (response?.data ? response?.data.city + ' ' + response?.data.region + ' ' + response?.data.country_name + ' ' + response?.data.postal : ''),
          ipAddress: (response?.data ? response?.data.ip : ''),
        }));
        // dispatch(setAddLoading(false));
      }
    }).catch((err) => {
      console.log("err ", err.message)
      // dispatch(setAddLoading(false));

    });
  }, []);

  useEffect(() => {
    // if (token && isAuthorized) {
    CompanyConfigurationService.getCompanyConfiguration({
      args: {
        pageIndex: 1,
        pageSize: 1,
      }
    })
      .then((res) => {
        var response = res.data;
        if (response.success && response?.data?.items[0]) {
          dispatch(storeCompanyConfigurationData(response.data.items[0]));
        }
      })
      .catch((err) => {
        console.log("err ", err.message)
      });

    ThemeConfigurationService.getThemeConfiguration()
      .then((res) => {
        var response = res.data;
        if (response.success) {
          setData(response.data);
        }
      })
      .catch((err) => { });
    // }
  }, [/* isAuthorized, token */]);

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    try {
      if (token && isAuthorized) {
        const jwtToken = jwtDecode(String(token));
        UserService.getUserById(jwtToken?.UserId)
          .then((response) => {
            if (!unmounted) {
              if (response.data.data) {
                dispatch(
                  setUser({ ...response.data.data, role: jwtToken?.role })
                );
              } else {
                localStorage.clear();
              }
            }
            dispatch(setAddLoading(false));
          })
          .catch((error) => {
            dispatch(setAddLoading(false));
          });
      }
    } catch (e) {
      localStorage.clear();
    }
    return () => {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, [token]);

  // useEffect(() => {
  // if (GlobalLoading) {
  //   setTimeout(() => {
  //     dispatch(setAddLoading(false))
  //   }, 30000);
  // }
  // }, [GlobalLoading]);

  return (
    <ErrorBoundary>
      {GlobalLoading && <GlobalLoader />}
      <AppRoutes history={History} />
      <ThemeVariables reRender={data} />
    </ErrorBoundary>
  );
};

export default App;

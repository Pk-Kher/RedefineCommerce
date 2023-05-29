import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import { Route, useNavigate } from "react-router-dom";
import Routes from "routes/Routes";
import Dashboard from "components/admin/dashbord/Dashboard";
import Configurator from "components/admin/configurator/Routes";
import Promotions from "components/admin/promotions/Routes";
import Customer from "components/admin/customer/Routes";
import Content from "components/admin/content/Routes";
import MasterCatalog from "components/admin/masterCatalog/Routes";
import Settings from "components/admin/settings/Routes";
import Order from "components/admin/order/Routes";
import StoreBuilder from "components/admin/storeBuilder/Routes"
import ReportsRoutes from "components/admin/reports/Routes";
import ProtectedRoute from "routes/ProtectedRoute";
import IdleTimerContainer from "components/common/IdleTimer"
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "redux/auth/AuthAction";
import "../../assets/css/tailwind/admin/output.css";
import { scrollTop } from "services/common/helper/Helper";
import { useEffect } from "react";


const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const company = useSelector((store) => store?.CompanyConfiguration);
  const logoutHandler = useCallback(() => {
    dispatch(logout());
    return navigate("/login", { replace: true });
  }, [dispatch, navigate]);
  useEffect(() => {
    scrollTop();
  }, [navigate]);
  return (
    <>
      <div className="flex h-screen overflow-hidden pk">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div
          id="contentbody"
          className="relative w-full max-h-[calc(100%-4rem)] flex flex-col flex-1 overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300 language-html top-16"
        >

          {(company?.logoutTime && localStorage.getItem('rememberMe') === 'false') && <IdleTimerContainer timeout={company?.logoutTime || 15} logout={logoutHandler} />}
          <main>
            <Routes>
              <Route exact path="/" element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="Settings/*" element={<Settings />} />
                <Route exact path="Customer/*" element={<Customer />} />
                <Route exact path="promotions/*" element={<Promotions />} />
                <Route exact path="Content/*" element={<Content />} />
                <Route exact path="MasterCatalog/*" element={<MasterCatalog />} />
                <Route exact path="configurator/*" element={<Configurator />} />
                <Route exact path="Order/*" element={<Order />} />
                <Route exact path="StoreBuilder/*" element={<StoreBuilder />} />
                <Route exact path="/store-setup/*" element={<Content />} />
                <Route exact path="/reports/*" element={<ReportsRoutes />} />
              </Route>
            </Routes>
          </main>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};
export default MainLayout;

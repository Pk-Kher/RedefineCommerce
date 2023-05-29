import React from "react";
import { Route } from "react-router-dom";
import Login from "components/admin/auth/Login";
import MainLayout from "layouts/admin/MainLayout";
import StoreMainLayout from "layouts/stores/MainLayout";

import ProtectedRoute from "./ProtectedRoute";
import TwoFactorAuthentication from "components/admin/auth/TwoFactorAuthentication";
import ForgotPassword from "components/admin/auth/ForgotPassword";
import ResetPassword from "components/admin/auth/ResetPassword";
import Routes from "./Routes";
import TemplateEdit from "components/admin/content/template/create/Create";
import TemplatePreview from "components/admin/content/template/create/Preview";

import ChangePassword from "components/admin/auth/ChangePassword";
import PageSettingsEdit from "components/admin/content/page/edit/setting/Settings";
import PublishOptions from "components/admin/content/page/edit/publishOptions/PublishOptions";
import PageOptimize from "components/admin/content/page/edit/optimize/Optimize"
import FrontCms from "components/front/cms/FrontCms";
import HeaderConfig from "components/admin/content/template/create/HeaderConfig";

export default function AppRoutes() {
        return (
                <Routes>
                        <Route exact path="/" element={<Login />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/forgot-password" element={<ForgotPassword />} />
                        <Route exact path="/reset-password/:id/:code" element={<ResetPassword />} />
                        <Route exact path="/reset-password/:id" element={<ChangePassword />} />
                        <Route exact path="/two-factor/authentication/:id" element={<TwoFactorAuthentication />} />
                        {/* <Route exact path="/register" element={<Register />} /> */}
                        {/* <Route exact path="/admin/*" element={<MainLayout />} /> */}

                        {/* What ever route you want to serve after authentication, will go inside this Route */}
                        {/* here like: <Route path="/admin/*" element={<MainLayout />} /> */}
                        <Route path="/admin/Content/config/Header/:id" element={<HeaderConfig />} />
                        {/* What ever route you want to serve after authentication, will go inside this Route */}
                        {/* here like: <Route path="/admin/*" element={<MainLayout />} /> */}
                        <Route exact path="/" element={<ProtectedRoute />}>
                                <Route path="/admin/MasterCatalog/Store/configuration/*" element={<StoreMainLayout />} />
                                <Route path="/admin/*" element={<MainLayout />} />
                                <Route path="/admin/Content/Template/edit/:id" element={<TemplateEdit />} />
                                <Route path="/admin/Content/Page/edit/:id" element={<TemplateEdit />} />
                                <Route path="/admin/Content/Page/preview/:id" element={<TemplatePreview />} />
                                <Route path="/admin/Content/Template/preview/:id" element={<TemplatePreview />} />
                                <Route path="/admin/Content/Page/edit/setting/:id" element={<PageSettingsEdit />} />
                                <Route path="/admin/Content/Page/edit/optimize/:id" element={<PageOptimize />} />
                                <Route path="/admin/Content/Page/edit/publish/:id" element={<PublishOptions />} />

                                <Route path="/resource/:slug" element={<FrontCms />} />
                                {/* This is going to serve our stores (client side stores) and its pages */}
                        </Route>


                </Routes>
        );
}

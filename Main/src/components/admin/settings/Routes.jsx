import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Profile from "components/admin/settings/profile/Profile";
import Role from "components/admin/settings/role/Routes";
import Users from "components/admin/settings/user/Routes";
import AccoutnActivity from "components/admin/settings/accountActivity/Routes"
import SystemLog from "components/admin/settings/systemLog/Routes"

const InternalRouting = () => {

    return (
        <>
            <Routes>
                <Route path="/user/*" element={<Users />} />
                <Route exact path="/profile/*" element={<Profile />} />
                <Route path="/roles/*" element={<Role />} />
                <Route path="/account/activity/*" element={<AccoutnActivity />} />
                <Route path="/system/log/*" element={<SystemLog />} />
            </Routes>
        </>
    );
};

export default InternalRouting;

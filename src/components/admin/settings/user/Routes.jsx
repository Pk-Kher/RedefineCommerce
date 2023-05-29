import React from "react";
import { Route } from "react-router-dom";
import Routes from "routes/Routes";
import Users from "components/admin/settings/user/list/List";
import InviteUsers from "components/admin/settings/user/create/InviteUsers";
import Profile from "components/admin/settings/profile/Profile";



const InternalRouting = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Users />} />
                <Route path="/create" element={<InviteUsers />} />
                <Route exact path="/profile/*" element={<Profile />} />
            </Routes>
        </>
    );
};

export default InternalRouting;

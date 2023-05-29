import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "../../../../layouts/admin/sidebar/SidebarLinkGroup";

export default function Sidebar({ userId }) {
  const location = useLocation();
  const { pathname } = location;
  const url = pathname.includes("Settings/user/profile") ? '/admin/Settings/user/profile' : '/admin/Settings/profile';

  return (
    <>
      <div className="flex flex-nowrap overflow-x-scroll md:block md:overflow-auto px-3 py-6 border-b md:border-b-0 md:border-r border-gray-200 min-w-60 md:space-y-3">
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase mb-3">
            User Settings
          </div>
          <ul className="flex flex-nowrap md:block mr-3 md:mr-0">
            <SidebarLinkGroup
              activecondition={pathname.includes(url)}
            >
              {(handleClick, open) => {
                return (
                  <React.Fragment>
                    <div className="lg:sidebar-expanded:block 2xl:block">
                      <ul className={`flex flex-nowrap md:block mr-3 md:mr-0 ${!open && "hidden"}`}>
                        <li
                          className={`mr-0.5 md:mr-0 md:mb-0.5 ${location.pathname.includes(
                            url + "/myAccount"
                          )
                            ? "bg-red-500 rounded-md text-white"
                            : "#b8b8bc rounded-md text-lightpurple-500 hover:text-lightpurple-700"
                            }`}
                        >
                          <NavLink
                            to={
                              url + "/myAccount/" +
                              userId
                            }
                            className="flex items-center px-2.5 py-2 rounded whitespace-nowrap"
                          >
                            <div className="flex items-center ">
                              <span className="material-icons-outlined mr-2">
                                perm_identity
                              </span>
                              <span className="text-sm font-medium">
                                My Account
                              </span>
                            </div>
                          </NavLink>
                        </li>
                        <li
                          className={`mr-0.5 md:mr-0 md:mb-0.5 ${location.pathname.includes(
                            url + "/myNotification"
                          )
                            ? "bg-red-500 rounded-md text-white"
                            : "#b8b8bc rounded-md text-lightpurple-500 hover:text-lightpurple-700"
                            }`}
                        >
                          <NavLink
                            to={
                              url + "/myNotification/" +
                              userId
                            }
                            className="flex items-center px-2.5 py-2 rounded whitespace-nowrap"
                          >
                            <div className="flex items-center ">
                              <span className="material-icons-outlined mr-2">
                                notifications
                              </span>
                              <span className="text-sm font-medium">
                                My Notification
                              </span>
                            </div>
                          </NavLink>
                        </li>
                        <li
                          className={`mr-0.5 md:mr-0 md:mb-0.5 ${location.pathname.includes(
                            url + "/activity"
                          )
                            ? "bg-red-500 rounded-md text-white"
                            : "#b8b8bc rounded-md text-lightpurple-500 hover:text-lightpurple-700"
                            }`}
                        >
                          <NavLink
                            to={
                              url + "/activity/" +
                              userId
                            }
                            className="flex items-center px-2.5 py-2 rounded whitespace-nowrap"
                          >
                            <div className="flex items-center ">
                              <span className="material-icons-outlined mr-2">
                                article
                              </span>
                              <span className="text-sm font-medium">
                                System Log
                              </span>
                            </div>
                          </NavLink>
                        </li>
                        <li
                          className={`mr-0.5 md:mr-0 md:mb-0.5 ${location.pathname.includes(
                            url + "/permission"
                          )
                            ? "bg-red-500 rounded-md text-white "
                            : "#b8b8bc rounded-md text-lightpurple-500 hover:text-lightpurple-700"
                            }`}
                        >
                          <NavLink
                            to={url + "/permission/" + userId}
                            className="flex items-center px-2.5 py-2 rounded whitespace-nowrap"
                          >
                            <div className="flex items-center ">
                              <span className="material-icons-outlined mr-2">
                                vpn_key
                              </span>
                              <span className="text-sm font-medium">
                                User Permission
                              </span>
                            </div>
                          </NavLink>
                        </li>
                        <li
                          className={`mr-0.5 md:mr-0 md:mb-0.5 ${location.pathname.includes(
                            url + "/account/activity"
                          )
                            ? "bg-red-500 rounded-md text-white"
                            : "#b8b8bc rounded-md text-lightpurple-500 hover:text-lightpurple-700"
                            }`}
                        >
                          <NavLink
                            to={
                              url + "/account/activity/" +
                              userId
                            }
                            className="flex items-center px-2.5 py-2 rounded whitespace-nowrap"
                          >
                            <div className="flex items-center ">
                              <span className="material-icons-outlined mr-2">
                                article
                              </span>
                              <span className="text-sm font-medium">
                                Acount Activity
                              </span>
                            </div>
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </React.Fragment>
                );
              }}
            </SidebarLinkGroup>
          </ul>
        </div>
      </div>
    </>
  );
}

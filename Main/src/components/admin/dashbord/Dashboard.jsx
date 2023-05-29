import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import OrderByState from "./OrderByState";
import DashboardOrders from "./DashboardOrders";
import OrdersByStore from "./OrdersByStore";
import TopStore from "./TopStore";
import UserService from "services/admin/user/UserService";
import { useSelector, useDispatch } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Dashboard = () => {
  const [Data, setData] = useState();
  const CompanyId = useSelector((store) => store?.CompanyConfiguration?.id);
  const CurrentUserObject = useSelector((store) => store?.user);
  const dispatch = useDispatch();
  const userId = useSelector((store) => store?.user?.id);
  const permission = useSelector((store) => store?.permission);
  useEffect(() => {
    if (userId && CompanyId) {
      dispatch(setAddLoading(true));

      UserService.getAdminUserRolePermission({
        companyconfigurationid: CompanyId,
        userId,
        isSuperUser: CurrentUserObject?.isSuperUser || false,
      })
        .then((response) => {
          if (response.data.data) {
            setData(response.data.data);
          }
          dispatch(setAddLoading(false));
        })
        .catch((error) => {
          dispatch(setAddLoading(false));
        });
    }
  }, [userId, CompanyId]);

  const tilesVisible = (url) => {
    url = '/' + url.replace(/^\/+|\/+$/g, '');
    if (permission && permission?.allPermission?.[url?.toLowerCase()]) {
      return permission?.allPermission?.[url?.toLowerCase()];
    }
  };

  // useEffect(() => {
  //   document.addEventListener("click", (e) => {
  //     if (
  //       e &&
  //       e?.target?.className &&
  //       !e?.target?.className.includes("CurrentItem")
  //     ) {
  //       setHidden((prevValue) => ({
  //         ...prevValue,
  //         dashboardOrdersDropdown: false,
  //         ordersbystoreDropdown: false,
  //       }));
  //     }
  //   });
  // }, [document]);

  return (
    <>
      <title>Dashboard</title>

      <main>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
          {/* <!-- Cards --> */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            <Cards tilesVisible={tilesVisible} />
          </div>

          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* <!-- Order By State --> */}
            {tilesVisible("/admin/Order/orders") && (
              <OrderByState tilesVisible={tilesVisible} />
            )}

            {/* <!-- topstore --> */}
            {/* {tilesVisible("/admin/Order/orders") && ( */}
            <TopStore tilesVisible={tilesVisible} />
            {/* )} */}
          </div>

          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* <!-- orders --> */}

            {tilesVisible("/admin/Order/orders") && (
              <DashboardOrders tilesVisible={tilesVisible} />
            )}

            {/* <!-- orderbysite --> */}
            {tilesVisible("/admin/Order/orders") && (
              <OrdersByStore tilesVisible={tilesVisible} />
            )}
          </div>
        </div>
      </main>
    </>
  );
};
export default Dashboard;

// done

import { combineReducers } from "redux";
import auth from "./auth/AuthReducer";
import message from "./common/MessageReducer";
import alertMessage from "./alertMessage/AlertMessageReducers";
import user from "./user/UserReducers";
import location from "./location/LocationReducers";
import CompanyConfiguration from "./CompanyConfiguration/CompanyConfigurationReducers";
import permission from "./permission/PermissionReducers";
import MenuListByUserRoleReducers from "./GetMenuListByUserRole/MenuListByUserRoleReducers";
import SearchQueryReducers from "./searchQueryForMGS/SearchQueryReducers";
import GlobalLoaderReducer from "./globalLoader/GlobalLoaderReducer";

export default combineReducers({
  auth,
  message,
  alertMessage,
  user,
  location,
  CompanyConfiguration,
  permission,
  MenuListByUserRoleReducers,
  SearchQueryReducers,
  GlobalLoaderReducer
}); 

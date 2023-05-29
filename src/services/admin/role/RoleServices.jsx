import { API } from "helpers/API";

class AdminRoleService {
  getAdminModules(AdminModulesOptions) {
    return API.post(`/ModuleNavigation/modulelist.json`, AdminModulesOptions);
  }

  getAdminRolePermission(AdminRolePermissionOptions) {
    return API.post(
      `/AdminRolePermission/list.json`,
      AdminRolePermissionOptions
    );
  }

  getAdminRolePermissionByRoleId(roleId, companyId) {
    return API.get(
      `/AdminRolePermission/getpermissionmodulewisebyroleid/${roleId}/${companyId}.json`,
    );
  }


  getAdminRoles(adminRoleOptions) {
    return API.post(`AdminRole/list.json`, adminRoleOptions);
  }

  getAdminRolesById(adminRoleId) {
    return API.get(`AdminRole/get/${adminRoleId}.json`);
  }

  createRolePermission(RoleOptions) {
    return API.post(`AdminRolePermission/create.json`, RoleOptions);
  }

  updateRolePermission(RoleOptions) {
    return API.post(`AdminRolePermission/update.json`, RoleOptions);
  }

  updateRolePermissionById(RoleOptions) {
    return API.post(`AdminRolePermission/updatestatusbyid.json`, RoleOptions);
  }

  cloneRolePermission(RoleOptions) {
    return API.post(`AdminRolePermission/clone.json`, RoleOptions);
  }

  getUserPermission(RoleOptions) {
    return API.post(`/AdminUserRolePermission/getlistextensionspermission.json`, RoleOptions);
  }


}
export default new AdminRoleService();

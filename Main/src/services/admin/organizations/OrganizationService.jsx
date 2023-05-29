import { PHPAPI } from "helpers/API";

class OrganizationService {
  getOrganizations(OrganizationsObj) {
    const pageIndex = OrganizationsObj.args.pageIndex;
    return PHPAPI().post(`organization/list/paginate?page=${pageIndex}`, OrganizationsObj);
  }
  createOrganization(OrganizationsObj) {
    return PHPAPI().post(`organization/create`, OrganizationsObj);
  }

  getOrganizationByID(id) {
    return PHPAPI().post(`organization/list?id=${id}`);
  }
  
  updateOrganization(OrganizationsObj) {
    return PHPAPI().post(`organization/update`, OrganizationsObj);
  }

  updateStatus(OrganizationsObj) {
    return PHPAPI().post(`organization/update/status`, OrganizationsObj);
  }
}

export default new OrganizationService();

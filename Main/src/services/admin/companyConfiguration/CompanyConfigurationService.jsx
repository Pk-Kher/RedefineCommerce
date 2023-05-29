import { API, PublicAPI } from "helpers/API";

class CompanyConfigurationService {
  createCompanyConfiguration(CompanyConfigurationObj) {
    return API.post(
      `CompanyConfiguration/create.json`,
      CompanyConfigurationObj
    );
  }

  createCompanyConfigurationModuleRights(CompanyConfigurationModuleObj) {
    return API.post(
      `CompanyConfiguration/updatecompanyconfigurationmodule.json`,
      CompanyConfigurationModuleObj
    );
  }

  getCompanyConfiguration(CompanyConfigurationObj) {
    return PublicAPI.post(
      `CompanyConfiguration/list.json`,
      CompanyConfigurationObj
    );
  }

  getCompanyConfigurationById(id) {
    return API.get(`CompanyConfiguration/get/${id}.json`);
  }

  updateCompanyConfiguration(CompanyConfigurationObj) {
    return API.post(
      `CompanyConfiguration/update.json`,
      CompanyConfigurationObj
    );
  }
  deleteCompanyConfiguration(id) {
    return API.post(
      `/CompanyConfiguration/deleteCompanyconfigurationbyid.json`,
      id
    );
  }
}

export default new CompanyConfigurationService();

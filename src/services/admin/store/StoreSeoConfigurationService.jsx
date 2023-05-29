/*Component Name: StoreSeoConfigurationService
Component Functional Details: User can create or update General master details from here.
Created By: Divyesh 
Created Date: <Creation Date>
Modified By: <Modified By>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class StoreSeoConfigurationService {
  createSeoConfigurationService(SeoStoreSetupServiceObj) {
    return API.post(
      `SEOStoreSetup/create.json`,
      SeoStoreSetupServiceObj
    );
  }
  createSeoStoreSoicalSetupService(SeoStoreSetupServiceObj) {
    return API.post(
      `SEOStoreSetup/socialcreate.json`,
      SeoStoreSetupServiceObj
    );
  }

  getSeoStoreSetupService(id) {
    return API.get(`SEOStoreSetup/list/${id}.json`);
  }

  getSeoSocialSetup(id) {
    return API.get(`SEOStoreSetup/listsocialseoconfig/${id}.json`);
  }


  updateSeoStoreSetupService(SeoStoreSetupServiceObj) {
    return API.post(
      `SEOStoreSetup/update.json`,
      SeoStoreSetupServiceObj
    );
  }

  updateSeoStoreSoicalSetupService(SeoStoreSetupServiceObj) {
    return API.post(
      `SEOStoreSetup/socialupdate.json`,
      SeoStoreSetupServiceObj
    );
  }

}

export default new StoreSeoConfigurationService();

import { API } from "helpers/API";

class SeoConfigurationService {
  createSeoConfigurationService(SeoConfigurationServiceObj) {
    return API.post(
      `SEOConfiguration/create.json`,
      SeoConfigurationServiceObj
    );
  }

  getSeoConfigurationService() {
    return API.get(`SEOConfiguration/list.json`);
  }

  getSocialDataList() {
    return API.get(`SEOConfiguration/listsocialseoconfig.json`);
  }

  createSeoSocialConfigurationService(SeoConfigurationServiceObj) {
    return API.post(
      `SEOConfiguration/socialcreate.json`,
      SeoConfigurationServiceObj
    );
  }

  updateSeoConfigurationService(SeoConfigurationServiceObj) {
    return API.post(
      `SEOConfiguration/update.json`,
      SeoConfigurationServiceObj
    );
  }

  updateSeoSoicalConfigurationService(SeoConfigurationServiceObj) {
    return API.post(
      `SEOConfiguration/socialupdate.json`,
      SeoConfigurationServiceObj
    );
  }


}

export default new SeoConfigurationService();

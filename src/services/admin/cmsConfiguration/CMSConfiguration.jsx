import { PHPAPI, API } from "helpers/API";

class CMSConfiguration {
  getConfiguration(storeId, configName) {
    if (configName !== undefined) {
      return API.get(`CmsStoreThemeConfigsController/getstorethemeconfigs/${storeId}/${configName}.json`);

    }
  }

  updateConfiguration(paramObj) {
    if (paramObj.id > 0) {
      return API.post(`CmsStoreThemeConfigsController/update.json`, { "cmsStoreThemeConfigsModel": paramObj });
    }
    else {
      return API.post(`CmsStoreThemeConfigsController/create.json`, { "cmsStoreThemeConfigsModel": paramObj });
    }
  }

  setThemeConfigVariableFile(paramObj) {
    return API.post(`Blob/dumpcssclass.json`, paramObj);
  }

  getMenuConfigData(storeId) {
    return API.get(`/CmsStoreThemeConfigsController/getMenuConfig/${storeId}.json`);
  }

  updateMenuConfigData(paramObj) {
    return API.post(`CmsStoreThemeConfigsController/updateMenuConfig.json`, { 'menuConfigModel': paramObj });
  }
}

export default new CMSConfiguration();

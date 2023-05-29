import { API, PublicAPI } from "helpers/API";

class ThemeConfigurationService {
  createThemeConfiguration(themeConfigurationObj) {
    return API.post(`ThemeConfiguration/create.json`, themeConfigurationObj);
  }

  getThemeConfiguration() {
    return PublicAPI.post(`ThemeConfiguration/get.json`);
  }

  updateThemeConfiguration(themeConfigurationObj) {
    return API.post(`ThemeConfiguration/update.json`, themeConfigurationObj);
  }
  deleteThemeConfiguration(id) {
    return API.post(
      `/ThemeConfiguration/deletethemeconfigurationbyid.json`,
      id
    );
  }
}

export default new ThemeConfigurationService();

import { API } from "helpers/API";

class SystemLogService {
    getSystemLog(storeObj) {
        return API.post(`/SystemLog/systemloglist.json`, storeObj);
    }
    ChangeloglistSystemLog(storeObj) {
        return API.post(`/SystemLog/systemchangeloglist.json`, storeObj);
    }
    ChangeloglistrowSystemLog(storeObj) {
        return API.post(`/SystemLog/systemchangeloglistforRow.json`, storeObj);
    }
    GetIPAddressDropDownData() {
        return API.get(`/SystemLog/GetIPAddress.json`);
    }
    GetPageNamesDropDownData() {
        return API.get(`/SystemLog/GetPageNames.json`);
    }
    Export(Obj){
        return API.post(`/SystemLog/Export.json`, Obj);
    }
}

export default new SystemLogService();

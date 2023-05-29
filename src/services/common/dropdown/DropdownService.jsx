import { API } from "helpers/API";
class DropdownService {
  getDropdownValues(tableName, isFetchAll = false, storeId = 0) {
    // isFetchAll = typeof isFetchAll === "boolean" ? isFetchAll : false

    return API.post(
      `/dropdown/table.json`, {
      table: tableName,
      isFetchAll,
      storeId
    }
    );
  }
}
export default new DropdownService();

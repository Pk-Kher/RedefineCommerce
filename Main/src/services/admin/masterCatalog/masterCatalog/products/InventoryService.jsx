import { API } from "helpers/API";

class InventoryService {

    getInventory(productid, vendorid) {
        return API.get(`/MasterProductFutureInventory/getfutureinventory/${productid}/${vendorid}.json`);
    }
    addUpdateInventory(inventoryObj) {
        return API.post(`/MasterProductFutureInventory/addupdatefutureinventory.json`, inventoryObj)
    }

}

export default new InventoryService();

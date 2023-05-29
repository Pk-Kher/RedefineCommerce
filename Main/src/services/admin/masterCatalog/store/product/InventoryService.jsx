import { API } from "helpers/API";

class InventoryService {

    getInventory(productid, vendorid) {
        return API.get(`/StoreProductFutureInventory/getfutureinventory/${productid}/${vendorid}.json`);
    }
    addUpdateInventory(inventoryObj) {
        return API.post(`/StoreProductFutureInventory/addupdatefutureinventory.json`, inventoryObj)
    }
}

export default new InventoryService();

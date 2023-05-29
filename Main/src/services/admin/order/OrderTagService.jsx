const { API } = require("helpers/API");

class OrderTagService {
    getOrderTags(orderId) {
        return API.get(`/OrderTags/get/${orderId}.json`);
    }
    createOrderTag(orderObject) {
        return API.post(`/OrderTags/create.json`, orderObject);
    }
    updateOrderTag(orderObject) {
        return API.post(`/OrderTags/update.json`, orderObject);
    }
    updateStatus(orderObject) {
        return API.post(`/OrderTags/updatestatusbyid.json`, orderObject);
    }


}
export default new OrderTagService();
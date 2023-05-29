import { API } from "helpers/API";

class PromotionsService {
    getPromotions(PromotionObj) {
        return API.post(`Promotion/list.json`, PromotionObj);
    }

    getPromotionByID(id) {
        return API.get(`Promotion/get/${id}.json`);
    }

    createPromotions(PromotionObj) {
        return API.post(`Promotion/create.json`, PromotionObj);
    }

    createPromotionsDetails(PromotionObj) {
        return API.post(`Promotion/createandupdatepromotiondetail.json`, PromotionObj);
    }

    updatePromotion(PromotionObj) {
        return API.post(`Promotion/update.json`, PromotionObj);
    }

    createAndUpdatePromotionDetail(PromotionObj) {
        return API.post(`Promotion/createandupdatepromotiondetail.json`, PromotionObj);
    }

    CreateAndUpdatePromotionRange(PromotionObj) {
        return API.post(`Promotion/createandupdatepromotionrange.json`, PromotionObj);
    }

    getlistpromotiondetail(PromotionObj) {
        return API.get(`Promotion/getlistpromotiondetail.json`, PromotionObj);
    }

    getpromotiondetailbyparentid(ParentId, PromotionObj) {
        return API.get(
            `Promotion/getpromotiondetailbyparentid/${ParentId}.json`,
            PromotionObj
        );
    }

    multipleupdatestatusbyids(PromotionObj) {
        return API.post(`Promotion/multipleupdatestatusbyids.json`, PromotionObj);
    }

    MultipleUpdatePromotionStatusByIds(PromotionObj) {
        return API.post(`Promotion/MultipleUpdatePromotionStatusByIds.json`, PromotionObj);
    }
    getDiscountReport(PromotionObj) {
        return API.post("/Promotion/GetSalesByDiscountReport.json", PromotionObj);
    }
}

export default new PromotionsService();
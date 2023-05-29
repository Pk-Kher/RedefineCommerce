import { PHPAPI } from "helpers/API";
import { API } from "helpers/API";
class StoreBuilderService {
  getStoreBuilderList(paramObj) {
    return API.post(`/StoreInformation/GetStoreList.json`, paramObj);
  }

  getPaymentDeliveryOptions() {
    return API.get(`/StorePayBusinessMethod/GetPayBusinessMethod.json`);
  }

  getDomains() {
    return API.get(``);
  }

  getOrganization() {
    return PHPAPI().post(`organization/list`);
  }

  createOrganization(storeObj) {
    return API.post(`/Organization/create.json`, storeObj);
  }

  getSports() {
    return PHPAPI().post(`sport/list`);
  }

  createSports(storeObj) {
    return API.post(`/SbCategory/CreateSbCategory.json`, storeObj);
  }

  getSalesPerson() {
    return API.get(`/SalesPerson/getlistofsalesperson.json`);
  }

  getCountries() {
    return PHPAPI().get(`countries`);
  }

  getStoreDetail(storeObj) {
    return PHPAPI().post(`storebuilder/get/general`, storeObj);
  }

  createStore(storeObj) {
    return API.post(
      `/StoreInformation/CreateMasterStoreInformation.json`,
      storeObj
    );
  }

  updateMasterStoreSetup(storeObj) {
    return API.post(`/StoreInformation/UpdateMasterStoreSetup.json`, storeObj);
  }

  udpateStoreGeneral(storeObj) {
    return API.post(
      `/StoreInformation/UpdateMasterStoreInformation.json`,
      storeObj
    );
  }

  deleteStore(storeObj) {
    return API.post(
      `/StoreInformation/multipleupdatestatusbyids.json`,
      storeObj
    );
  }

  getByStoreID(StoreId) {
    return API.get(`/StoreInformation/geteditstore/${StoreId}.json`);
  }

  getPaymentCustomField(storeObj) {
    return PHPAPI().post(`payment-custom-field/list`, storeObj);
  }

  createPaymentCustomField(storeObj) {
    return PHPAPI().post(`payment-custom-field/create`, storeObj);
  }

  deletePaymentCustomField(CustomFieldId) {
    return PHPAPI().post(`payment-custom-field/delete/${CustomFieldId}`);
  }

  getPaymentAccount(storeObj) {
    return PHPAPI().post(`payment-gateway/store-list`, storeObj);
  }

  getPaymentInfo(storeObj) {
    return PHPAPI().post(`storebuilder/get/paymentinfo`, storeObj);
  }

  updatePaymentInfo(storeObj) {
    return PHPAPI().post(`storebuilder/update/paymentinfo`, storeObj);
  }

  getMessages(storeId) {
    return API.get(
      `/SbStoreMessages/GetSbStoreMessagesByStore/${storeId}.json`
    );
  }

  createMessages(storeObj) {
    return API.post(`/SbStoreMessages/CreateSbStoreMessages.json`, storeObj);
  }

  updateMessages(storeObj) {
    return API.post(`/SbStoreMessages/UpdateSbStoreMessages.json`, storeObj);
  }

  deleteCouponInfo(storeObj) {
    return PHPAPI().post(`store-coupon/delete`, storeObj);
  }

  createTierInfo(storeObj) {
    return PHPAPI().post(`store-shipping/create`, storeObj);
  }

  deleteTierInfo(storeObj) {
    return PHPAPI().post(`store-shipping/delete`, storeObj);
  }
  getStoreCustomFieldById(id) {
    return API.get(`/StoreCustomField/get/${id}.json`);
  }
  createStoreCustomField(storeObj) {
    return API.post(`/StoreCustomField/create.json`, storeObj);
  }
  deleteStoreCustomField(storeObj) {
    return API.post(
      `/StoreCustomField/deletestorecustomfieldbyid.json`,
      storeObj
    );
  }

  getTierInfo(storeId) {
    return API.get(
      `/SbShippingMethods/GetSbShippingMethodsByStore/${storeId}.json`
    );
  }
  deleteTierShippingInfo(storeObj) {
    return API.post(
      `/SbShippingMethods/DeleteSbShippingMethodsById.json`,
      storeObj
    );
  }
  createStoreTierInfo(storeObj) {
    return API.post(
      `/SbShippingMethods/CreateSbShippingMethods.json`,
      storeObj
    );
  }

  createFeesInfo(storeObj) {
    return API.post(`/StoreFees/create.json`, storeObj);
  }
  getFeesInfo(storeId) {
    return API.get(`/StoreFees/get/${storeId}.json`);
  }
  updateFeesInfo(storeObj) {
    return API.post(`/StoreFees/updatefeesbyid.json`, storeObj);
  }
  getCouponInfo(storeId) {
    return API.get(
      `/SbCouponRebates/GetSbCouponRebatesByStore/${storeId}.json`
    );
  }

  updateCouponInfo(storeObj) {
    return API.post(`/SbCouponRebates/CreateSbCouponRebates.json`, storeObj);
  }
  updateCouponRebatesInfo(storeObj) {
    return API.post(`/SbCouponRebates/UpdateSbCouponRebates.json`, storeObj);
  }

  deleteCouponInfo(storeObj) {
    return API.post(
      `/SbCouponRebates/DeleteSbCouponRebatesById.json`,
      storeObj
    );
  }

  // Fees Services

  deleteFeesInfo(storeObj) {
    return API.post(`/StoreFees/deletefeesbyid.json`, storeObj);
  }
  getTaxesInfo(storeId) {
    return API.get(`/StoreFees/gettax/${storeId}.json`);
  }

 createTaxesInfo(storeObj) {
    return API.post(`/StoreFees/createfeestax.json`, storeObj);
  }
  updateTaxesInfo(storeObj) {
    return API.post(`/StoreFees/updatefeestaxbyid.json`, storeObj);
  }

  // store Clone Services

  createStoreClone(storeInfoId) {
    return API.post(`/StoreInformation/Clone/${storeInfoId}.json`);
  }
}

export default new StoreBuilderService();

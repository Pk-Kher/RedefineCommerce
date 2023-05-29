import { API } from "helpers/API";

class StoreService {
  getStores(storeObj) {
    return API.post(`/Store/list.json`, storeObj);
  }

  createStore(storeObj) {
    return API.post(`Store/create.json`, storeObj);
  }

  getStoreById(id) {
    return API.get(`Store/get/${id}.json`);
  }

  getPaymentOptions() {
    return API.get(`Store/getpaymentoption.json`);
  }

  updateStore(storeObj) {
    return API.post(`Store/update.json`, storeObj);
  }
  getStoresListByType(storeObj) {
    return API.post(`/Store/getstorelistbytype.json`, storeObj);
  }

  updateStatus(storeObj) {
    return API.post(`/Store/updatestatusbyid.json`, storeObj);
  }

  updateMultipleStatus(storeObj) {
    return API.post(`/Store/multipleupdatestatusstorebyids.json`, storeObj);
  }

  CreateAndUpdateStorePaymentOption(storeObj) {
    return API.post(`/Store/CreateAndUpdateStorePaymentOption.json`, storeObj);
  }
  getStoreByUserId(storeObj) {
    return API.post(`/Store/getstorelistbyuserpermission.json`, storeObj);
  }

  CreateShippingCharges(shippingObj) {
    return API.post(`ShippingCharges/create.json`, shippingObj);
  }

  UpdateShippingCharges(shippingObj) {
    return API.post(`/ShippingCharges/update.json`, shippingObj);
  }

  getShippingChargesById(id) {
    return API.get(`ShippingCharges/list/${id}.json`);
  }

  UpdateShippingStatus(shippingObj) {
    return API.post(`/ShippingCharges/multipleupdatestatusshippingchargesbyids.json`, shippingObj);
  }

  getTopStoreData(storeObj) {
    return API.post(`/Dashboard/gettopfivestore.json`, storeObj)
  }

  getStoreListByStoreTypeId(storeId, storeTypeId) {
    return API.get(`/Store/getstorebyid/${storeId}/${storeTypeId}.json`);
  }

  CreateUpdateChildStore(childObj) {
    return API.post(`StoreParentBrand/addupdate.json`, childObj);
  }

  getParentStoreById(id) {
    return API.post(`StoreParentBrand/getbystoreid/${id}.json`);
  }

  getShippingMethodByShippingServiceId(storeObj) {
    return API.post(`Store/getshippingmethodsbyshippingservice.json`, storeObj);
  }

}

export default new StoreService();

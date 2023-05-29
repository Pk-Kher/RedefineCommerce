import { API } from "helpers/API";

class TierService {
  getTiers(tierObj) {
    return API.post(`/TierMaster/list.json`, tierObj);
  }

  getTierById(tierId) {
    return API.get(`/TierMaster/get/${tierId}.json`);
  }

  createTier(tierObj) {
    return API.post(`/TierMaster/create.json`, {
      tierMasterModel: tierObj,
    });
  }

  getTiersByStoreID(storeId, tierObj) {
    return API.get(`/TierMaster/gettierbystorename/${storeId}.json`, {
      tierMasterModel: tierObj,
    });

  }

  getTiersByCustomerID(customerId) {
    return API.get(`/TierMaster/gettierbycustomerstoreid/${customerId}.json`, {
    });
  }

  updateTier(tierObj) {
    // return API.post(`/TierMaster/update.json`, tierObj);
    return API.post(`/TierMaster/update.json`, tierObj,
    );
  }

  updateTierById(args) {
    return API.post(`/TierMaster/updatestatusbyid.json`, {
      args,
    });
  }
}

export default new TierService();

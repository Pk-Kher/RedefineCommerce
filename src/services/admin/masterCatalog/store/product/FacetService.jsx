import { API } from "helpers/API";

class FacetService {

    getFacetById(productId) {
        return API.get(`/StoreProductFacetController/list/${productId}.json`);
    }
    createFacet(CustomerFaqsObj) {
        return API.post(`/StoreProductFacetController/create.json`, CustomerFaqsObj);
    }

    updateFacetStatus(CustomerFaqsObj) {
        return API.post(`/StoreProductFacetController/multipleupdatestatusfacetbyids.json`, CustomerFaqsObj);
    }

    fetchFacetByName(query) {
        return API.get(`/MasterProductFacetMasterValue/getfactemastervaluebyfactemastersearch/${query}.json`)
    }

}

export default new FacetService();

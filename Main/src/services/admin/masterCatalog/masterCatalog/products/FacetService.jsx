import { API } from "helpers/API";

class FacetService {

    getFacetById(productId) {
        return API.get(`/MasterProductFacet/list/${productId}.json`);
    }
    createFacet(FacetObj) {
        return API.post(`/MasterProductFacet/create.json`, FacetObj);
    }

    updateFacetStatus(CustomerFaqsObj) {
        return API.post(`/MasterProductFacet/multipleupdatestatusfacetbyids.json`, CustomerFaqsObj);
    }

    fetchFacetByName(query) {
        return API.get(`/MasterProductFacetMasterValue/getfactemastervaluebyfactemastersearch/${query}.json`)
    }

}

export default new FacetService();

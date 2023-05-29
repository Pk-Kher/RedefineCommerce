/*Component Name: SEOReadinessService
Component Functional Details: User can create or update SEOReadinessService master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class SEOReadinessService {

    getSEOReadiness(SEOReadyObj) {
        return API.post(`/SEOReady/list.json`, SEOReadyObj);
    }

    createSEOReady(SEOReadyObj) {
        return API.post(`/SEOReady/create.json`, SEOReadyObj);
    }

    getSEOReadyById(id) {
        return API.get(`/SEOReady/get/${id}.json`);
    }

    updateSEOReady(SEOReadyObj) {
        return API.post(`/SEOReady/update.json`, SEOReadyObj);
    }

    updateStatus(SEOReadyObj) {
        return API.post(`SEOReady/updatestatusbyid.json`, SEOReadyObj);
    }

    updateMultipleStatus(SEOReadyObj) {
        return API.post(`/SEOReady/multipleupdatestatusseoreadydetailbyids.json`, SEOReadyObj);
    }

    createOrUpdateSEOReadyDetails(detailsObj) {
        return API.post(`/SEOReady/updateandcreateseoreadyfield.json`, detailsObj);
    }


}

export default new SEOReadinessService();

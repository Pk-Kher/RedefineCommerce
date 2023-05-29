/*Component Name: ShippingService
Component Functional Details: User can create or update ShippingService master details from here.
Created By: Chandan
Created Date: 13/01/2023
Modified By: Chandan
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class ShippingService {
    getShippingMethods(seoFieldObj) {
        return API.post(`/SeoProductField/list.json`, seoFieldObj);
    }
}

export default new ShippingService();

/*Component Name: Fix Charges
Component Functional Details: User can create or update Fix Charges master details from here.
Created By: Bhargav
Created Date: 13/02/2023
Modified By: <Modified By>
Modified Date: <Modified Date> */

import { API } from "helpers/API";

class FixChargesComponent {
  getFixCharges(Obj) {
    return API.post(`/FixCharges/GetFixChargesList.json`, Obj);
  }
  getFixChargesById(id) {
    return API.get(`/FixCharges/GetFixchargesListById/${id}.json`);
  }
  createFixCharges(Obj) {
    return API.post(`/FixCharges/CreateFixCharges.josn`, Obj);
  }
  updateFixCharges(Obj) {
    return API.post(`/FixCharges/UpdateFixCharges.json`, Obj);
  }
  updateStatus(Obj) {
    return API.post(`/FixCharges/updatestatus.json`, Obj);
  }
  updateMultipleStatus(Obj) {
    return API.post(`/FixCharges/multipleupdatestatus.json`, Obj);
  }
}
export default new FixChargesComponent();

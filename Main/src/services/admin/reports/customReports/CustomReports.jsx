import { API } from "helpers/API";

class CustomReports {
  getInquiriesList(Obj) {
    return API.post(`/CustomReport/GetInquiriesList.json`, Obj);
  }
  exportInquiriesList(Obj) {
    return API.post(`/CustomReport/ExportInquiriesListReport.json`, Obj);
  }
  getMailLog(Obj) {
    return API.post(`/CustomReport/getmaillog.json`, Obj);
  }
  ExportMailLog(Obj) {
    return API.post(`/CustomReport/exportgetmaillog.json`, Obj);
  }
  InquiriesResendMail(Obj) {
    return API.post(`/CustomReport/inquiriesresendmail.json`, Obj);
  }
  InquiriesListGetById(id) {
    return API.get(`/CustomReport/GetInquiriesListById/${id}.json`);
  }
}

export default new CustomReports();

/*Component Name: CompanyService
Component Functional Details: User can create or update CompanyService master details from here.
Created By: chandan
Created Date: 06/06/22
Modified By: chandan,Divyesh
Modified Date: 06/06/22 */

import { API } from "helpers/API";

class CompanyService {
    getCompany(args) {
        return API.post(`/CompanyInformation/list.json`, args);
    }

    createCompanyInformation(companyInformationModel) {
        return API.post(`/CompanyInformation/create.json`, { companyInformationModel });
    }
    updateCompanyInformation(companyInformationModel) {
        return API.post(`/CompanyInformation/update.json`, companyInformationModel);
    }
    updateCompanyStatusById(companyInformationModel) {
        return API.post(`/CompanyInformation/updatestatusbyid.json`, companyInformationModel);
    }
    getCompanyById(CompanyID) {
        return API.get(`/CompanyInformation/get/${CompanyID}.json`);
    }
    getcustomerdetailsbycompanyid(CompanyID) {
        return API.get(`/CompanyInformation/getcustomerdetailsbycompanyid/${CompanyID}.json`);
    }

    getPurchaseProductList(args) {
        return API.post(`/CompanyInformation/getpurchasedproductlistbycomapnyid.json`, args);
    }

    getCartProduct(args) {
        return API.post(`/CompanyInformation/getaddedtocartproductlistbycomapnyid.json`, args);
    }

    getViewedList(args) {
        return API.post(`/CompanyInformation/getviewedproductlistbycompanyid.json`, args);
    }

    getAllProducts(args) {
        return API.post(`/CompanyInformation/getallproductlistbycompanyid.json`, args);
    }

    getWishListProduct(args) {
        return API.post(`/CompanyInformation/getwishlistproductlistbycompanyid.json`, args);
    }
    getcustomersendresetpasswordlink(customerEmail) {
        return API.get(`CompanyInformation/customersendresetpasswordlink/${customerEmail}.json`);
    }

    getCustomerDropDown(customerId) {
        return API.get(`/CompanyInformation/getcustomer/${customerId}.json`);
    }

}

export default new CompanyService();

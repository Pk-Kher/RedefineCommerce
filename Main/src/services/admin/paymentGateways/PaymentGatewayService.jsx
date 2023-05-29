import { PHPAPI } from "helpers/API";

class PaymentGatewayService {
  getPaymentGateways(PaymentGatewaysObj) {
    const pageIndex = PaymentGatewaysObj.args.pageIndex;
    return PHPAPI().post(`payment-gateway/list/paginate?page=${pageIndex}`, PaymentGatewaysObj);
  }
  
  createPaymentGateway(PaymentGatewaysObj) {
    return PHPAPI().post(`payment-gateway/create`, PaymentGatewaysObj);
  }

  getPaymentGatewayByID(id) {
    return PHPAPI().post(`payment-gateway/list?id=${id}`);
  }
  
  updatePaymentGateway(PaymentGatewaysObj) {
    return PHPAPI().post(`payment-gateway/update`, PaymentGatewaysObj);
  }

  updateStatus(PaymentGatewaysObj) {
    return PHPAPI().post(`payment-gateway/update/status`, PaymentGatewaysObj);
  }
}

export default new PaymentGatewayService();

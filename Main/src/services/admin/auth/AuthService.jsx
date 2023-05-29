import { API, PublicAPI } from "helpers/API";

class AuthService {
  login(userObj) {
    return PublicAPI.post("/login/token.json", userObj);
  }
  logout(userObj) {
    return API.post("/login/logout.json", userObj);
  }
  getOtpTimeout(userId) {
    return PublicAPI.get(`/login/SendAuthToken/${userId}.json`);
  }
  verifyOtp(otp, userId) {
    return PublicAPI.get(`/login/CheckAuthToken/${otp}/${userId}.json`)
  }
  sendResetPasswordLink(userEmail) {
    return PublicAPI.get(`/AdminUser/SendResetPasswordLink/${userEmail}.json`);
  }
  resetPassword(userObj) {
    return PublicAPI.post(`/AdminUser/CreatePassword.json`, userObj);
  }
  changeExpirePassword(userObj) {
    return PublicAPI.post("/AdminUser/CheckAndUpdatePasswordExpired.json", userObj);
  }
  checkExpirePassword(userId) {
    return PublicAPI.get(`/AdminUser/CheckUserPasswordExpired/${userId}.json`);
  }
  checkPaswordLinkExpired(userObj){
    return PublicAPI.post(`/AdminUser/CheckPasswordLinkExpired.json`,userObj)
  }
}

export default new AuthService();

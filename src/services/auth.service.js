import axios from "axios";
import authMarketingHeader from "./auth-marketing-header";
import authAdminHeader from "./auth-admin-header";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_BASE_URL;
const ttl = 1800000;

class AuthService {
  login(email, password) {
    var gameViewedList = JSON.parse(localStorage.getItem("gameViewed"));
    if(!gameViewedList) gameViewedList = [];
    return axios
      .post(API_URL + "authenticate/user/login", {
        "email":email,
        "password":password,
        "seenVideos":gameViewedList
      })
      .then(response => {
        if (response.data.token) {
          var userData = response.data;
          const now = new Date();
          userData['expiry'] = now.getTime() + ttl;
          localStorage.setItem("user", JSON.stringify(userData));
        }

        return response.data;
      });
  }

  logout() {
    return axios
      .post(API_URL + "authenticate/user/logout", {}, { headers: authHeader()})
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem("user"); 
          window.location.reload();
        }
      });
  }

  register(email, password) {
    return axios.post(API_URL + "register/user", {
      email,
      password
    });

  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user'));

    if(user){
      const now = new Date();
      if (now.getTime() > user.expiry) {
        localStorage.removeItem('user');
        return false;
      }
      return JSON.parse(localStorage.getItem('user'));
    }
    return false;
  }

  marketingLogin(email, password) {
    return axios
      .post(API_URL + "authenticate/marketing/login", {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          var marketingUserData = response.data;
          const now = new Date()
          marketingUserData['expiry'] = now.getTime() + ttl;
          localStorage.setItem("marketing_user", JSON.stringify(marketingUserData));
        }
        return response.data;
      });
  }

  marketingRegister(email, password) {
    return axios.post(API_URL + "register/marketing_user", {
      email,
      password
    });
  }

  getCurrentMarketingUser() {
    const marketingUser = JSON.parse(localStorage.getItem('marketing_user'));

    if(marketingUser){
      const now = new Date();
      if (now.getTime() > marketingUser.expiry) {
        localStorage.removeItem('marketing_user');
        return false;
      }
      return JSON.parse(localStorage.getItem('marketing_user'));
    }
    return false;
  }

  marketingLogout() {
    return axios
      .post(API_URL + "authenticate/marketing/logout", {}, { headers: authMarketingHeader()})
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem("marketing_user");
          return true;
        }
        return false;
      });
  }

  adminLogin(email, password) {
    return axios
      .post(API_URL + "authenticate/admin/login", {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          var adminUserData = response.data;
          const now = new Date()
          adminUserData['expiry'] = now.getTime() + ttl;
          localStorage.setItem("admin_user", JSON.stringify(adminUserData));
        }
        return response.data;
      });
  }

  getCurrentAdminUser() {
    const adminUser = JSON.parse(localStorage.getItem('admin_user'));

    if(adminUser){
      const now = new Date();
      if (now.getTime() > adminUser.expiry) {
        localStorage.removeItem('admin_user');
        return false;
      }
      return JSON.parse(localStorage.getItem('admin_user'));
    }
    return false;
  }

  adminLogout() {
    return axios
      .post(API_URL + "admin/logout", {}, { headers: authAdminHeader() })
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem("admin_user");
          return true;
        }
        return false;
      });
  }
  
}

export default new AuthService();

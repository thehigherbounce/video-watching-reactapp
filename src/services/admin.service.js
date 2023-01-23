import axios from "axios";
import authAdminHeader from "./auth-admin-header";

const API_URL =  process.env.REACT_APP_BASE_URL+"admin/";

class AdminService {
  search(filter) {
    var str = [];
    for (var fkey in filter)
      if (filter.hasOwnProperty(fkey)) {
        str.push(encodeURIComponent(fkey) + "=" + encodeURIComponent(filter[fkey]));
      }
    let filterQuery = str.join("&");
    return axios
      .get(API_URL + "searchGames?" + filterQuery, { headers: authAdminHeader()})
      .then(response => {
        return response.data;
      });
  }

  updateGameStatus(data) {
    return axios
      .post(API_URL + "admin/approveReject/", data, { headers: authAdminHeader()})
      .then(response => {
      });
  }

  getGameInfo(gid) {
    return axios
      .get(API_URL + "admin/game/" + gid, { headers: authAdminHeader()})
      .then(response => {

      });
  }
}

export default new AdminService();

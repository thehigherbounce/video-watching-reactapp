import axios from "axios";
import authMarketingHeader from "./auth-marketing-header";

const API_URL = process.env.REACT_APP_BASE_URL+"marketing/";

class MarketingService {
  myGames() {
    return axios
      .get(API_URL + "my_games", { headers: authMarketingHeader()})
      .then(response => {
        return response.data;
      });
  }

  getEditGameData(id) {
    return axios
      .get(API_URL + "edit_game/" + id, { headers: authMarketingHeader()})
      .then(response => {
        return response.data;
      });
  }

  hideGame(gid) {
    return axios
      .post(API_URL + "my_games/hide/" + gid, {}, { headers: authMarketingHeader()})
      .then(response => {
      });
  }

  unHideGame(gid) {
    return axios
      .post(API_URL + "my_games/unhide/" + gid, {}, { headers: authMarketingHeader()})
      .then(response => {

      });
  }

  addGame(gameData) { 
    return axios
      .post(API_URL + "add_game/", gameData, { headers: authMarketingHeader()})
      .then(response => {
        if (response.status === 200){
          return response.data;
        }
        return false;
      });
  }

  editGame(gameData) {
    return axios
      .post(API_URL + "edit_game/", gameData, { headers: authMarketingHeader()})
      .then(response => {
        if (response.status === 200){
          return response.data;
        }
        return false;
      });
  }

  uploadMediaFile(fileData) {
    return axios
      .post(API_URL + "upload_media_file/", fileData, { headers: authMarketingHeader()})
      .then(response => {
        if (response.status === 200){
          return response.data;
        }
        return false;
      });
  }


}

export default new MarketingService();

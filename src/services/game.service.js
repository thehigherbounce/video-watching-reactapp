import axios from "axios";
import authHeader from "./auth-header";
import ReactGA from 'react-ga';

const API_URL = process.env.REACT_APP_BASE_URL + "game/";

class GameService {
  search(filter) {
    var query = "?tags=";
    for(var tkey in filter.tags){
      query += filter.tags[tkey];
      if(filter.tags.length - 1 !== tkey) query += ","
    }

    var queryPlayers = "&players=";
    for (var key in filter.players){
      if(filter.players[key])
        queryPlayers += key + ",";
    }
    if(queryPlayers !== "&players="){
      queryPlayers = queryPlayers.substr(0, queryPlayers.length - 1);
      query += queryPlayers;
    }
      
    var queryPlatforms = "&platforms=";
    for (var qkk in filter.platforms){
      if(filter.platforms[qkk])
        queryPlatforms += qkk + ",";
    }
    if(queryPlatforms !== "&platforms="){
      queryPlatforms = queryPlatforms.substr(0, queryPlatforms.length - 1);
      query += queryPlatforms;
    }
    
    var queryOrientation = "&orientation=";
    for (var kk in filter.orientation){
      if(filter.orientation[kk]){
        var rkk = "";
        if(kk === "d2") rkk = "2d";
        if(kk === "d3") rkk = "3d";
        queryOrientation += rkk + ",";
      }
    }
    if(queryOrientation !== "&orientation="){
      queryOrientation = queryOrientation.substr(0, queryOrientation.length - 1);
      query += queryOrientation;
    }
    

    var queryRelease = "&release=";
    for (var rekk in filter.release){
      if(filter.release[rekk])
      queryRelease += rekk + ",";
    }
    if(queryRelease !== "&release="){
      queryRelease = queryRelease.substr(0, queryRelease.length - 1);
      query += queryRelease;
    }
    var querySeenVideo ="&seen_videos=";
    var viewedGameList = JSON.parse(localStorage.getItem("gameViewed"));
    if(viewedGameList){
      for(var i = 0 ; i < viewedGameList.length ; i++ ){
        querySeenVideo += viewedGameList[i].id.toString(10)+",";
      }
      if(querySeenVideo !=="&seen_videos="){
        querySeenVideo = querySeenVideo.substr(0,querySeenVideo.length - 1);
        query += querySeenVideo;
      }
    }
    return axios
      .get(API_URL + "public/search" + query, { headers: authHeader()})
      .then(response => {
        return response.data;
      });
  }

  viewed(vid) {
    return axios.post(API_URL + "view/" + vid, {}, { headers: authHeader()});
  }

  gameLike(vid) {
    ReactGA.event({
      action: "Like Video",
      data: vid
    });
    return axios.post(API_URL + "like/" + vid, {}, { headers: authHeader()})
  }

  gameDisLike(vid) {
    ReactGA.event({
      action: "Dislike Video",
      data: vid
    });
    return axios.post(API_URL + "dislike/" + vid, {}, { headers: authHeader()})
  }

  gameRemoveLikeDisLike(vid) {
    return axios.post(API_URL + "remove_like_dislike/" + vid, {}, { headers: authHeader()})
  }

  getLikedGames() {
    return axios
      .get(API_URL + "user_videos/liked", { headers: authHeader()})
      .then(response => {
        return response.data;
      });
  }

  getDislikedGames() {
    return axios
      .get(API_URL + "user_videos/disliked", { headers: authHeader()})
      .then(response => {
        return response.data;
      });
  }

  getWatchedGames() {
    return axios
      .get(API_URL + "user_videos/most_recent", { headers: authHeader()})
      .then(response => {
        return response.data;
      });
  }


}

export default new GameService();

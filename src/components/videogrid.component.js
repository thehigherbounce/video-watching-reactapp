import React, { Component } from "react";
import Video from "./video.component";
import VideoInfo from "./videoinfo.component";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import AuthService from "../services/auth.service";
import GameService from "../services/game.service";
import ReactGA from 'react-ga';

const refreshNum = 10;

export default class VideoGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridnum: this.props.grid,
      viewNumber: [],
      maxNumber : 3,
      fileprefix: this.props.games.s3FilesUrlPrefix,
      //fileprefix: "http://www.farcade.io/video/stream_with_game_name/xtisykkimrjddkvbfumxpmlogmkpgvva.mp4",
      games: this.props.games.games,
      dialogData: {},
      errorMessage: false,
      countNum:0,
      isPulling:false
    };
    this.gameViewed = this.gameViewed.bind(this);
    this.nextVideo = this.nextVideo.bind(this);
    this.likeVideo = this.likeVideo.bind(this);
    this.disLikeVideo = this.disLikeVideo.bind(this);
    this.soundStatus = this.soundStatus.bind(this);
    this.onMoreInfo = this.onMoreInfo.bind(this);
    this.onHide = this.onHide.bind(this);
    this.showError = this.showError.bind(this);
  }

initGameNumber(){
    var games = this.props.games.games;
    var vNumbers = [];
    for(var i=0;i<games.length;i++){
        vNumbers.push(i);
        if(vNumbers.length === this.props.grid)
            break;
    }
    this.setState({
        gridnum: this.props.grid,
        games: this.props.games.games,
        viewNumber:vNumbers,
        maxNumber : 3
    });
}

componentDidMount(){
    this.initGameNumber();
}

componentDidUpdate(prevProps){
    if(prevProps.games.games !== this.props.games.games){
        this.initGameNumber();
    }
}

gameViewed(vid) {
    //Service
    const user = AuthService.getCurrentUser();
    if(user){
        GameService.viewed(vid).then(res => {
        });
    } else {
        //localStorage
        var gameViewedList = JSON.parse(localStorage.getItem("gameViewed"));
        if(!gameViewedList) gameViewedList = [];
        const now = new Date();
        gameViewedList.push({id:vid,timestamp:now.getTime()});
        localStorage.setItem("gameViewed", JSON.stringify(gameViewedList));
    }
}

nextVideo(index) {
    //Set Viewed Games
    if(this.state.isPulling === true && this.state.maxNumber+1 >= this.state.games.length)
        return null;
    this.gameViewed(this.state.games[index].id);
    var vNumber = this.state.viewNumber;
    var arIndex = vNumber.indexOf(index);
    var maxNumber = this.state.maxNumber+1;
    if(maxNumber < this.state.games.length){
        vNumber[arIndex] = maxNumber;
    }else{
        vNumber.splice(arIndex, 1);
    }
    var countnum = this.state.countNum;
    this.setState({countNum:countnum+1});
    if(countnum === refreshNum){
        var filterData = JSON.parse(localStorage.getItem("watch_vidoe_filterdata"));
        this.setState({isPulling:true});
        GameService.search(filterData).then(data => {
            var prevGames=this.state.games,Games = data.games;
            var i,k,len = prevGames.length;
            for(i=0;i<Games.length;i++){
                for(k=0;k<len;k++){
                    if(Games[i].id===prevGames[k].id)
                        break;
                }
                if(k===len) prevGames.push(Games[i]);
            }
            this.setState({
                games: prevGames,
                countNum:0,
                isPulling:false
            });
        });
    }
    this.setState({
        viewNumber: vNumber,
        maxNumber: maxNumber
    }); 
    ReactGA.event({
        action: "Next Video",
        data: this.state.games[index].id
    });
}

likeVideo(index){

    const user = AuthService.getCurrentUser();
    if(!user){
        this.showError();
        return;
    }
    var games = this.state.games;
    
    if(games[index].mLike){
        GameService.gameRemoveLikeDisLike(this.state.games[index].id).then(res => {
        });
        games[index].mDisLike = false;
        games[index].mLike = false;
    }else{
        GameService.gameLike(this.state.games[index].id).then(res => {
        });
        games[index].mDisLike = false;
        games[index].mLike = true;
    }
    this.setState({games: games});
} 

disLikeVideo(index){

    const user = AuthService.getCurrentUser();
    if(!user){
        this.showError();
        return;
    }
    var games = this.state.games;
    
    if(games[index].mDisLike){
        GameService.gameRemoveLikeDisLike(this.state.games[index].id).then(res => {
        });
        games[index].mLike = false;
        games[index].mDisLike = false;
    }else{
        GameService.gameDisLike(this.state.games[index].id).then(res => {
        });
        games[index].mLike = false;
        games[index].mDisLike = true;
    }
    this.setState({games: games});
}

soundStatus(index, status) {
    var games = this.state.games;
    var gNumbers = this.state.viewNumber;
    if(status){
        for(var i = 0 ; i < gNumbers.length; i++){
            games[gNumbers[i]].unmuted = false;
        }
    }
    games[index].unmuted = status;
    this.setState({games: games});
    ReactGA.event({
        action: "Sound toggled",
        data: this.state.games[index].id
    });
}

onMoreInfo(index, name) {
    var games = this.state.games;
    var gNumbers = this.state.viewNumber;
    for(var i = 0 ; i < gNumbers.length; i++){
        games[gNumbers[i]].unmuted = false;
    }
    let state = {
        [`${name}`]: true,
        games: games
    };

    //Set Viewed Games
    this.gameViewed(this.state.games[index].id);
    state.dialogData = this.state.games[index];
    this.setState(state);
    ReactGA.event({
        action: "More info modal opened",
        data: this.state.games[index].id
    });
}   

onNotification(name, position) {
    let state = {
        [`${name}`]: true
    };

    if (position) {
        state = {
            ...state,
            position
        }
    }

    this.setState(state);
}

showError() {
    this.toast.show({severity:'error', summary: 'Error', detail:'You have to auth before liking / disliking videos.', life: 3000});
}

onHide(name) {
    this.setState({
        [`${name}`]: false
    });
}

  render() {
    return (
        <div className="video-grid-panel">
            <div className="p-grid">
                {this.state.viewNumber.map(
                    (nData, index) =>
                    <div key={index} className="p-col-12 p-md-6 p-lg-6 p-pb-0 p-pt-0">
                        <Video 
                            prefix={this.state.fileprefix} 
                            data={this.state.games[nData]} 
                            number={nData} 
                            nextVideo={this.nextVideo} 
                            likeVideo={this.likeVideo} 
                            disLikeVideo={this.disLikeVideo}
                            onMuted={this.soundStatus} 
                            onMoreInfo={this.onMoreInfo}
                        />
                    </div>
                )}
            </div>
            <Dialog header="Game Info Dialog" visible={this.state.displayBasic} style={{ width: '50vw' }} onHide={() => this.onHide('displayBasic')}>
                <VideoInfo info={this.state.dialogData} 
                prefix={this.state.fileprefix} />
           </Dialog>
           <Toast ref={(el) => this.toast = el} />
        </div>
    );
  }
}

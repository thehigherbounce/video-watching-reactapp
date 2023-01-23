import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Menu } from 'primereact/menu';
import AuthService from "../services/auth.service";
import Header from "./common/header";
import gameService from "../services/game.service";
import VideoInfo from "./videoinfo.component";
import GameService from "../services/game.service";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imgBaseUrl: 'https://games-bucket-generated.s3.eu-central-1.amazonaws.com/',
      redirect: null,
      userReady: false,
      games: [],
      gametstates:[],
      displayBasic: false,
      dialogData:{},
      title:''
    };

    this.items = [
      {
          label: 'Liked Videos',
          command:()=>{ this.getLikeGames() }
      },
      {
          label: 'Disliked Videos',
          command:()=>{ this.getDislikeGames() }
      },
      {
          label: 'Recently Watched',
          command:()=>{ this.getWatchedGames() }
      }
    ];
    this.getLikeGames = this.getLikeGames.bind(this);
    this.getDislikeGames = this.getDislikeGames.bind(this);
    this.getWatchedGames = this.getWatchedGames.bind(this);
    this.gameMoreInfo = this.gameMoreInfo.bind(this);
  }

  gameMoreInfo(index){
    let state = this.state.games[index];
    this.setState({
      dialogData:state,
      displayBasic:true
    });
  }

  getLikeGames() {
    gameService.getLikedGames().then(res => {
      let len = res.games.length,states=[];
      while(len--) states.push({
        watched:false,
        isMiddle:false,
        liked:true
      })
      this.setState({
        games:res.games,
        gametstates:states,
        title:'Liked Videos'
      })
      this.setState({gametstates:states})
    })
  }

  getDislikeGames() {
    gameService.getDislikedGames().then(res => {
      let len = res.games.length,states=[];
      while(len--) states.push({
        watched:false,
        isMiddle:false,
        liked:false
      })
      this.setState({
        games:res.games,
        gametstates:states,
        title:'Disliked Videos'
      })
    })
  }

  getWatchedGames() {
    gameService.getWatchedGames().then(res => {
      let len = res.games.length,states=[];
      while(len--) states.push({
        watched:true
      })
      this.setState({
        games:res.games,
        gametstates:states,
        title:'Recently Watched Videos'
      })
    })
  }
  likeVideo(index,islike){

    const user = AuthService.getCurrentUser();
    if(!user){
        this.showError();
        return;
    }
    let games = this.state.games,states=this.state.gametstates;
    if(states[index].liked===islike&&states[index].isMiddle===false){
      GameService.gameRemoveLikeDisLike(games[index].id).then(res => {});
      states[index].isMiddle = true;
    }
    else{
      if(islike === true){
        GameService.gameLike(games[index].id).then(res => {});
        states[index].liked = true;
      }
      else{
        GameService.gameDisLike(games[index].game_id).then(res => {});
        states[index].liked = false;
      }
      states[index].isMiddle = false;
    }
    this.setState({
      gametstates:states
    });
}

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      this.setState({ redirect: "/home" });
    }else {
      this.setState({ currentUser: currentUser, userReady: true })
    }
    if(!this.state.redirect)
      this.getDislikeGames();
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const {games} = this.state;

    return (
      <div>
        <Header/>
        <div className="layout-content">
          <div className="profile-container">
            <div className="p-grid">
                <div className="p-col-fixed" style={{ width: '200px'}}>
                  <Menu model={this.items} />
                </div>
                <div className="p-col">
                  <h4 className="p-knob-text">{this.state.title}</h4>
                  {this.state.title==='Disliked Videos'&&<p className="p-grey-text">Disliked videos will never show up again on the main page</p>}
                  <div className="marketing-list-content">
                      {
                        games.map((itemData, index) => {
                          const st = this.state.gametstates[index];
                          return (
                            <div key={index} className="marketing-video-item p-d-flex p-jc-between p-ai-center">
                              <div className="left-side p-d-flex p-ai-center"onClick={() => this.gameMoreInfo(index)}>
                                <div className="f-image p-mr-3">
                                  <img src={this.state.imgBaseUrl + itemData.featuredScreenshot.filename} alt={itemData.name}/>
                                </div>
                                <div className="game-name-platforms p-mr-3">
                                  <div className="game-name">{itemData.name}</div>
                                </div>
                              </div>
                              <div className="numbers p-d-flex">
                                {
                                  st.watched ?  
                                  <div className="icon-group p-mr-2">
                                      <i className="pi pi-eye" style={{'fontSize': '2em'}}></i>
                                  </div> :
                                  <React.Fragment>
                                    <Button 
                                      icon="pi pi-thumbs-up" 
                                      className={st.isMiddle===false&&st.liked ? "p-button-rounded p-button-info p-mx-4" : "p-button-rounded p-button-info p-mx-4 p-button-outlined"} 
                                      onClick={() => this.likeVideo(index,true)} />
                                    <Button 
                                        icon="pi pi-thumbs-down" 
                                        className={st.isMiddle===false&&!st.liked ? "p-button-rounded p-button-info p-mx-4" : "p-button-rounded p-button-info p-mx-4 p-button-outlined"} 
                                        onClick={() => this.likeVideo(index,false)} />
                                  </React.Fragment>
                                }
                              </div>
                            </div>
                          ) 
                        })
                      }
                    </div>
                  </div>
            </div>
          </div>
        </div>
        <Dialog header="Game Info Dialog" visible={this.state.displayBasic} style={{ width: '50vw' }} onHide={() => this.setState({displayBasic:false})}>
            <VideoInfo info={this.state.dialogData} 
            prefix={this.state.imgBaseUrl} />
        </Dialog>
      </div>
      
    );
  }
}

import React, { Component } from "react";
import ReactPlayer from "react-player";
import { Button } from "primereact/button";

// import AuthService from "../services/auth.service";

export default class VideoInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
        info: this.props.info,
        mainVideo: this.props.info.featuredVideoName,
        mainVideoFlag: "VIDEO"
    };
    this.onClickImg = this.onClickImg.bind(this);
    this.onClickVideo = this.onClickVideo.bind(this);
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  onClickImg(url) {
    this.setState({mainVideoFlag: "SCREENSHOT", mainVideo: url});
  }

  onClickVideo(url) {
    this.setState({mainVideoFlag: "VIDEO", mainVideo: url});
  }

  render() {
    var platformName ="" , tagName="";
    if(this.props.info.platformAndroid === true)
        platformName +=" Android";
    if(this.props.info.platformIOS === true)
        platformName +=" IOS";
    if(this.props.info.platformPC === true)
        platformName +=" PC";
    if(this.props.info.platformPlaystation === true)
        platformName +=" Playstation";
    if(this.props.info.platformXBox === true)
        platformName +=" XBox";
    if(this.props.info.tagAlien === true)
        tagName += " Alien";
    if(this.props.info.tagMMORPG === true)
        tagName += " MMORPG";
    if(this.props.info.tagMOBA === true)
        tagName += " MOBA";
    if(this.props.info.tagTowerDefense === true)
        tagName += " TowerDefense";
    return (
        <div className="vinfopanel">
            <div className="vinfopanel-main">
                <div className="p-grid">
                    <div className="p-col-12 p-md-10 p-lg-10 main-video-field">
                        { this.state.mainVideoFlag === "VIDEO" ? 
                            <ReactPlayer 
                                playing url={this.props.prefix + this.state.mainVideo} 
                                controls={true} loop width="100%" height="100%"
                                style={{zIndex:2, position:"relative"}}
                            />
                            :
                            <img 
                                src={this.props.prefix + this.state.mainVideo}
                                alt="No Screenshot"
                            />
                        }
                        
                    </div>
                    <div className="p-col-12 p-md-2 p-lg-2">
                        {/* <ScrollPanel style={{height: '500px'}}> */}
                            <div className="p-d-flex p-flex-column">
                                <div className="media-item">
                                    <Button 
                                        icon={"pi pi-play"} 
                                        className={"p-button-rounded p-button-primary sound-button"} 
                                        disabled = {true}
                                    />
                                    <ReactPlayer 
                                        url={this.props.prefix + this.props.info.featuredVideoName} 
                                        controls={false} loop 
                                        width="100%" height="100%"
                                        onClick={() =>this.onClickVideo(this.props.info.featuredVideoName)}
                                    />
                                </div>
                                {
                                    this.props.info.media.map((media, index) =>{
                                        if(media.mediaType === "VIDEO"){
                                            return (
                                                <div key={index} className="media-item">
                                                    <Button 
                                                        icon={"pi pi-play"} 
                                                        className={"p-button-rounded p-button-primary sound-button"} 
                                                        disabled = {true}
                                                    />
                                                    <ReactPlayer 
                                                        url={this.props.prefix + media.filename} 
                                                        controls={false} loop 
                                                        width="100%" height="100%"
                                                        onClick={() =>this.onClickVideo(media.filename)}
                                                    />
                                                </div>
                                            )
                                        } else if(media.mediaType === "SCREENSHOT"){
                                            return (
                                                <div key={index} className="media-item">
                                                    <img 
                                                        src={this.props.prefix + media.filename} 
                                                        onClick={() => this.onClickImg(media.filename)}
                                                        alt="No Screenshot"
                                                    />
                                                </div>
                                            )
                                        }
                                        return true;
                                    })
                                }
                            </div>
                        {/* </ScrollPanel> */}
                    </div>
                </div>
            </div>
            <div className="vinfopanel-details">
                <h5>Game Name: {this.props.info.name}</h5>
                <div className="p-d-flex">
                    <div className="p-col-3">Company logo image:</div>
                    <div className="f-image"><img className="companyLogoImg" src={this.props.prefix + this.props.info.owner.logo.filename} alt="load faild"/></div>
                </div>
                {this.props.info.gameWebsiteLink&&<div className="p-d-flex">
                    <div className="p-col-3">Game Link:</div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.gameWebsiteLink}>{this.props.info.gameWebsiteLink}</a></div>
                </div>}
                {this.props.info.owner.name&&<div className="p-d-flex">
                    <div className="p-col-3">Company Name:</div>
                    <div className="p-col-10">{this.props.info.owner.name}</div>
                </div>}
                {this.props.info.owner.website&&<div className="p-d-flex">
                    <div className="p-col-3">Company Link:</div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.owner.website}>{this.props.info.owner.website}</a></div>
                </div>}
                {this.props.info.gameWebsiteLink&&<div className="p-d-flex">
                    <div className="p-col-3">website:</div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.gameWebsiteLink}>{this.props.info.gameWebsiteLink}</a></div>
                </div>}
                <div className="p-d-flex">
                    <div className="p-col-3">platforms:</div>
                    <div className="p-col-10">{platformName}</div>
                </div>
                {this.props.info.description&&<div className="p-d-flex">
                    <div className="p-col-3">Description:</div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.description}>{this.props.info.description}</a></div>
                </div>}
                <div className="p-d-flex">
                    <div className="p-col-3">tags:</div>
                    <div className="p-col-10">{tagName}</div>
                </div>
                {this.props.info.iTunesLink&&<div className="p-d-flex">
                    <div className="p-col-3">app store link:</div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.iTunesLink}>{this.props.info.iTunesLink}</a></div>
                </div>}
                {this.props.info.googlePlayLink&&<div className="p-d-flex">
                    <div className="p-col-3">google play link:</div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.googlePlayLink}>{this.props.info.googlePlayLink}</a></div>
                </div>}
                {this.props.info.steamLink&&<div className="p-d-flex">
                    <div className="p-col-3">steam link:</div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.steamLink}>{this.props.info.steamLink}</a></div>
                </div>}
                {this.props.info.owner.twitterLink&&<div className="p-d-flex">
                    <div className="p-col-3">twitter link:</div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.owner.twitterLink}>{this.props.info.owner.twitterLink}</a></div>
                </div>}
                {this.props.info.playstationStoreLink&&<div className="p-d-flex">
                    <div className="p-col-3">playstation store link: </div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.playstationStoreLink}>{this.props.info.playstationStoreLink}</a></div>
                </div>}
                {this.props.info.xboxStoreLink&&<div className="p-d-flex">
                    <div className="p-col-3">xbox store link:</div>
                    <div className="p-col-10"><a target="_blank" rel="noopener noreferrer" href={this.props.info.xboxStoreLink}>{this.props.info.xboxStoreLink}</a></div>
                </div>}
                <div className="p-d-flex">
                    <div className="p-col-3">{this.props.info.hasBeenReleased?"Release Date: ":"Expected release: "}</div>
                    <div className="p-col-10">{this.formatDate(this.props.info.releaseDate)}</div>
                </div>
            </div>
        </div>
    );
  }
}

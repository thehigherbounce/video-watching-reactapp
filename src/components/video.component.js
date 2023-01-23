import React, { Component } from "react";
import ReactPlayer from "react-player";
import { Button } from "primereact/button";

// import AuthService from "../services/auth.service";


export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: this.props.number,
      gameinfo: this.props.data,
      prefix: this.props.prefix,
      firstVideo: this.props.data.featuredVideoName,
      secondVideo: this.props.data.featuredVideoName,
      fVideo : 1,
      fFlag: false,
      sFlag: false
    };

    
    this.props.data.mLike = this.props.data.likeDislikeValue;
    this.props.data.mDisLike = this.props.data.likeDislikeValue == null ? null : !this.props.data.likeDislikeValue;
  }

  static getDerivedStateFromProps(props, state) {
      if (state.fVideo === 1) {
        return {
            gameinfo: props.data,
            secondVideo: props.data.featuredVideoName,
            fFlag: true,
            sFlag: false,
            fVideo:2,
        } 
      } else {
        return {
            gameinfo: props.data,
            firstVideo: props.data.featuredVideoName,
            sFlag: true,
            fFlag: false,
            fVideo:1
        } 
      }
  }

  render() {
    return (
        <div className="vpanel">
            <div className="vpanel-head p-d-flex">
                <h3>{this.props.data.name}</h3>
                <Button label="More..." className="p-button-info more-button" onClick={() => this.props.onMoreInfo(this.props.number, "displayBasic")}/>
            </div>
            <div className="vpanel-main">
                <Button 
                    icon={!this.props.data.unmuted ? "pi pi-volume-off" : "pi pi-volume-up"} 
                    className={!this.props.data.unmuted ? "p-button-rounded p-button-danger sound-button" : "p-button-rounded p-button-info sound-button"} 
                    onClick={() => this.props.onMuted(this.props.number, !this.props.data.unmuted)}
                />
                <h5 className="no-video">No Video Available</h5>
                <ReactPlayer 
                    muted={!this.props.data.unmuted} 
                    playing url={this.props.prefix + this.state.firstVideo} 
                    controls={false} loop width="100%" height="100%"
                    style={this.state.fFlag ? {zIndex:2, position:"absolute", opacity: 0,  transition: "all 0.5s"} : {zIndex:2, opacity:1, position:"absolute",  transition: "all 0.5s"}}
                    config={{ file: { attributes: { disablePictureInPicture: true }}}}
                />
                <ReactPlayer 
                    muted={!this.props.data.unmuted} 
                    playing url={this.props.prefix + this.state.secondVideo} 
                    controls={false} loop width="100%" height="100%"
                    style={this.state.sFlag ? {zIndex:2, position:"relative", opacity: 0,  transition: "all 0.5s"} : {zIndex:2, opacity:1, position:"relative",  transition: "all 0.5s"}}
                    config={{ file: { attributes: { disablePictureInPicture: true }}}}
                />
            </div>
            <div className="vpanel-footer p-d-flex">
                <div>
                    <Button 
                        icon="pi pi-thumbs-up" 
                        className={this.props.data.mLike ? "p-button-rounded p-button-info p-mx-4" : "p-button-rounded p-button-info p-mx-4 p-button-outlined"} 
                        onClick={() => this.props.likeVideo(this.props.number)} />
                    <Button 
                        icon="pi pi-thumbs-down" 
                        className={this.props.data.mDisLike ? "p-button-rounded p-button-info p-mx-4" : "p-button-rounded p-button-info p-mx-4 p-button-outlined"} 
                        onClick={() => this.props.disLikeVideo(this.props.number)} />
                </div>
                <Button label="Next game" className="p-button-info next-button" onClick={() => this.props.nextVideo(this.props.number)} />
            </div>
        </div>
    );
  }
}

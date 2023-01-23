import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import ReactPlayer from "react-player";
import marketingService from "../../services/marketing.service";
import FilterService from "../../services/filter.service";
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import adminService from "../../services/admin.service";

const commentLimitLength = 10;

export default class AdminEditGameForm extends Component {
  constructor(props) {
    super(props);

    let data = this.props.gameData;
    let selectedTags = [];
    if (data.tagAlien) selectedTags.push('Aliens');
    if (data.tagMMORPG) selectedTags.push('MMORPG');
    if (data.tagMOBA) selectedTags.push('MOBA');
    if (data.tagTowerDefense) selectedTags.push('Tower Defense');
    let mediaFiles = [];
    data.media.map(eMedia => {
      return mediaFiles.push({
        id: eMedia.id,
        type: eMedia.mediaType,
        filename: eMedia.filename,
        arej: true,
        comment:''
      });
    });
    
    this.state = {
      redirect: null,
      gameId: data.id,
      imgBaseUrl: 'https://games-bucket-generated.s3.eu-central-1.amazonaws.com/',
      gameStatus: data.status,
      name: data.name,
      description: '',
      rjDescription_comment:'',
      describeArej: true,
      rjFeatureVideo_comment:'',
      featureVideoArej: true,
      platforms: {ios: data.platformIOS, android: data.platformAndroid, pc: data.platformPC, xbox: data.platformXBox},
      typeTags:[],
      selectedTags: selectedTags,
      filteredTypeTags: null,
      players: {singleplayer: data.singleplayer, multiplayer: data.multiplayer},
      orientation:{d2: data.orientation === 'o2D' ? true : false, d3: data.orientation === 'o3D' ? true : false},
      release: {released: data.hasBeenReleased ? true : false, upcoming: data.hasBeenReleased ? false : true},
      media_files: mediaFiles,
      featured_video: {id: data.featuredVideoID, filename: data.featuredVideoName},
      gameArej:true,
      rjGame_comment:''
    };

    this.videoUploader = this.videoUploader.bind(this);
    this.ScreenshotUploader =  this.ScreenshotUploader.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.SubmitValidation = this.SubmitValidation.bind(this);
  }

  componentDidMount() {
    FilterService.getTypeTags().then( data => {
      this.setState({ typeTags: data });
    });
    if (!this.props.gameData) this.setState({ redirect: '/admin'});
  }
  videoUploader(e) {
    let featured_video = this.state.featured_video;
    if (!featured_video) {
      const data = new FormData();
      data.append('file', e.files[0]);
      marketingService.uploadMediaFile(data).then(res => {
        this.featuredVideoFileUpload.clear();
        featured_video = {
          id: res.media_id,
          filename: res.filename,
        }
        this.setState({featured_video: featured_video});
      });
    } else {
      console.log("Featured Video Already Exist!");
    }
    
  }
  changeMediaItemArej(index, value){
    let mediaFiles = [...this.state.media_files];
    mediaFiles[index].arej = value;
    this.setState({media_files:mediaFiles});
  }
  changeMediaItemComment(e,index){
    let mediaFiles = [...this.state.media_files];
    mediaFiles[index].comment = e.target.value;
    this.setState({media_files:mediaFiles});
  }

  ScreenshotUploader(e) {
    let mediaFiles = this.state.media_files;
    if (mediaFiles.length < 6) {
      const data = new FormData();
      data.append('file', e.files[0]);
      marketingService.uploadMediaFile(data).then(res => {
        this.screenshotFileUpload.clear();
        let mediaFile = {
          id: res.media_id,
          type: "SCREENSHOT",
          filename: res.filename,
        }
        mediaFiles.push(mediaFile);
        this.setState({media_files: mediaFiles});
      });
    } else {
      console.log('Maximum Number of Media Files is 6');
    }
  }

  handleOnDragEnd(result) {
    let mediaFiles = this.state.media_files;
    const [reorderedItem] = mediaFiles.splice(result.source.index, 1);
    mediaFiles.splice(result.destination.index, 0, reorderedItem);
    this.setState({ media_files: mediaFiles });
  }

  onClickSubmit() {
    if((!this.state.describeArej&&this.state.rjDescription_comment.length<commentLimitLength)
    ||(!this.state.featureVideoArej&&this.state.rjFeatureVideo_comment<commentLimitLength)
    ||(!this.state.gameArej&&this.state.rjGame_comment<commentLimitLength)){
      this.SubmitValidation();
      return;
    }
    let mediaItemArej=[];
    for(var i=0;i<this.state.media_files.length;i++){
      var item = this.state.media_files[i];
      if(item.arej) continue;
      if(item.comment.length < commentLimitLength){
        this.SubmitValidation();
        return ;
      }
      mediaItemArej.push({
        id: item.id,
        comment: item.comment
      })
    }
    var submitData;
    if(mediaItemArej.length===0&&this.state.describeArej&&this.state.featureVideoArej&&this.state.gameArej){
      submitData ={id:this.state.gameId};
    }
    else{
      submitData ={
        id:this.state.gameId,
        reject_description_comment:this.state.rjDescription_comment,
        reject_featured_video_comment:this.state.rjFeatureVideo_comment,
        reject_media_items:mediaItemArej,
        reject_game_comment:this.state.rjGame_comment
      }
    }
    if (submitData.id){
      adminService.updateGameStatus(submitData).then(res => {
        if (res) this.setState({ redirect: '/admin/search'});
      });
    } else {
      console.log('Something Wrong! Game id should not be null!')
    }   
  }
  SubmitValidation(){
    this.toastBC.show({severity:'error', summary: 'Validation Error', detail:'Every reject_commet must contain at least 10 characters', life: 3000});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
        <div className="admin-edit-game-form">
          <Toast ref={(el) => this.toastBC = el}></Toast>
          <h3 className="sub-page-title">Edit game <span className={this.state.gameStatus}>{this.state.gameStatus}</span></h3>
          {this.state.gameStatus !== 'Pending' ? <span className="reject-comment">{this.props.gameData.gameRejectComment}</span> : ''}
          <div className="p-grid p-d-flex">
            <div className="p-col-7">
              <div className="p-grid">
                <div className="p-col-2">Name: </div>
                <div className="p-col-10">
                  {this.state.name}
                </div>
              </div>
              <div className="p-grid">
                <div className="p-col-2">Platforms: </div>
                <div className="p-col-10">
                  <div className="p-formgroup-inline">
                    {this.state.platforms.ios?"iOS ":""}{this.state.platforms.android?"Android ":""}{this.state.platforms.pc?"PC ":""}{this.state.platforms.xbox?"XBox":""}
                  </div>
                </div>
              </div>
              <div className="p-grid">
                <div className="p-col-2">Players: </div>
                <div className="p-col-10">
                  <div className="p-formgroup-inline">
                  {this.state.players.singleplayer?"SinglePlayer ":""}{this.state.players.multiplayer?"MultiPlayer ":""}
                  </div>
                </div>
              </div>
              <div className="p-grid">
                <div className="p-col-2">Orientation: </div>
                <div className="p-col-10">
                  <div className="p-formgroup-inline">
                  {this.state.orientation.d2?"2D ":""}{this.state.orientation.d3?"3D ":""}
                  </div>
                </div>
              </div>
              <div className="p-grid">
                <div className="p-col-2">Release: </div>
                <div className="p-col-10">
                  <div className="p-formgroup-inline">
                  {this.state.release.released?"Released ":""}{this.state.release.upcoming?"Upcoming":""}
                  </div>
                </div>
              </div>
              <div className="p-grid">
                <div className="p-col-2">Type/Tags: </div>
                <div className="p-col-10">
                  {this.state.selectedTags.map((tag, index) => <span key={index}>{tag+" "}</span> )}
                </div>
              </div>
            </div>
            <div className="p-d-flex p-col-5 p-justify-center">
              <div className="p-col-6">
                <div className="p-field-radiobutton">
                  <RadioButton inputId="Ap_fd_describe" name="describe_ar" value="approve" onChange={()=>this.setState({describeArej:true})} checked={this.state.describeArej} />
                  <label htmlFor="Ap_fd_describe">Approve</label>
                </div>
              </div>
              <div className="p-col-6">
                <div className="p-field-radiobutton">
                  <RadioButton inputId="Rej_fd_describe" name="describe_ar" value="reject" onChange={()=>this.setState({describeArej:false})} checked={!this.state.describeArej} />
                  <label htmlFor="Rej_fd_describe">Reject</label>
                </div>
                <div>
                  <InputTextarea style={{width:'100%'}} value={this.state.rjDescription_comment} disabled ={this.state.describeArej} onChange={(e)=>this.setState({rjDescription_comment:e.target.value})} />
                </div>
              </div>
            </div>
          </div>
          <div className="featured-rule">
            <p>Featured video rules(these are stattic and don't come from backend)</p>
            <div className="rule-list">
              <ul>
                <li>Rule1</li>
                <li>Rule2</li>
                <li>Rule3</li>
              </ul>
            </div>
          </div>
          <div className="p-grid p-d-flex">
            <div className="featured-video-wrap p-col-7">
              <div className="p-grid p-ai-center">
                <div className="p-col-3">
                  Featured Video
                </div>
                { this.state.featured_video ? 
                  <React.Fragment>
                    <div className="video-player p-col-8">
                        <ReactPlayer 
                          muted={true} 
                          playing 
                          url={this.state.imgBaseUrl + this.state.featured_video.filename} 
                          controls={false} loop width="100%" height="100%"
                          style={{zIndex:2, position:"relative"}}
                        />
                      </div>
                      
                    </React.Fragment>
                    :
                    <div className="p-col-2">
                      <FileUpload ref={(el) => this.featuredVideoFileUpload = el} name="demo" url="./upload" accept="video/*" mode="basic" customUpload uploadHandler={this.videoUploader} auto></FileUpload>
                    </div>
                }
              </div>
            </div>
            <div className="p-d-flex p-col-5 p-justify-center">
              <div className="p-col-6">
                <div className="p-field-radiobutton">
                  <RadioButton inputId="Ap_fd_featureVideo" name="featureVideo_ar" value="approve" onChange={()=>this.setState({featureVideoArej:true})} checked={this.state.featureVideoArej} />
                  <label htmlFor="Ap_fd_featureVideo">Approve</label>
                </div>
              </div>
              <div className="p-col-6">
                <div className="p-field-radiobutton">
                  <RadioButton inputId="Rej_fd_featureVideo" name="featureVideo_ar" value="reject" onChange={()=>this.setState({featureVideoArej:false})} checked={!this.state.featureVideoArej} />
                  <label htmlFor="Rej_fd_featureVideo">Reject</label>
                </div>
                <div>
                  <InputTextarea  style={{width:'100%'}} value={this.state.rjFeatureVideo_comment} disabled ={this.state.featureVideoArej} onChange={(e)=>this.setState({rjFeatureVideo_comment:e.target.value})} />
                </div>
              </div>
            </div>
          </div>
          <div className="reject-comment-wrap">
            {this.state.gameStatus !== 'Pending' ? <span className="reject-comment">{this.props.gameData.featuredVideoRejectComment}</span> : ''}
          </div>
          <div className="other-featured-rule">
            <p>Other media rules(these are stattic and don't come from backend)</p>
            <div className="rule-list">
              <ul>
                <li>Other Media Rule1</li>
                <li>Other Media Rule2</li>
                <li>Other Media Rule3</li>
              </ul>
            </div>
          </div>
          <div className="other-media-wrap">
            <DragDropContext onDragEnd={this.handleOnDragEnd}>
              <Droppable droppableId="characters">
                {(provided) => (
                  <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                  {
                    this.state.media_files.map((eMedia, index) => {
                      return (
                        <Draggable key={eMedia.id} draggableId={eMedia.id.toString()} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <div className="p-grid p-d-flex">
                                <div className="media-preview-part p-col-7">
                                  <div className="p-grid p-d-flex p-ai-center">
                                    <div className="p-col-2">
                                      <i className="pi pi-bars"></i>
                                    </div>
                                    <div className="p-col-3">
                                      {eMedia.type === "SCREENSHOT" ? 'Screenshot: ' : 'Video'}
                                    </div>
                                    <div className="img-preview p-col-6">
                                      {
                                        eMedia.type === "SCREENSHOT" 
                                        ? <img src={this.state.imgBaseUrl + eMedia.filename} alt="video or screenshot"/>
                                        : <ReactPlayer 
                                              url={this.state.imgBaseUrl + eMedia.filename} 
                                              controls={false} loop 
                                              width="200px" height="100%"
                                          />
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div className="p-d-flex p-col-5 p-justify-center">
                                  <div className="p-col-6">
                                    <div className="p-field-radiobutton">
                                      <RadioButton inputId={"Ap_fd_mediaItem_" + index} name={"media" + index + "_ar"} value="approve" onChange={()=>this.changeMediaItemArej(index,true)} checked={eMedia.arej} />
                                      <label htmlFor={"Ap_fd_mediaItem_" + index}>Approve</label>
                                    </div>
                                  </div>
                                  <div className="p-col-6">
                                    <div className="p-field-radiobutton">
                                      <RadioButton inputId={"Rej_fd_mediaItem_" + index} name={"media" + index + "_ar"} value="reject" onChange={()=>this.changeMediaItemArej(index,false)} checked={!eMedia.arej} />
                                      <label htmlFor={"Rej_fd_mediaItem_" + index}>Reject</label>
                                    </div>
                                    <div>
                                      <InputTextarea style={{width:'100%'}} value={eMedia.comment} disabled ={eMedia.arej} onChange={(e)=>this.changeMediaItemComment(e,index)} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      )
                    })
                  }
                  {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
            <div className="upload-button-wrap">
              <div className="p-grid p-d-flex p-ai-center">
                  <div className="p-col-2">
                    
                  </div>
                  <div className="p-col-2">
                    Video or a screenshot:
                  </div>
                  <div className="button-wrap p-col-4">
                    <FileUpload ref={(el) => this.screenshotFileUpload = el} name="demo" accept="image/*" mode="basic" customUpload uploadHandler={this.ScreenshotUploader} auto></FileUpload>
                  </div>
                  <div className="p-col-2">
                  </div>
                </div>
            </div>
          </div>
          <div>
            <div className="p-d-flex p-col-6 p-justify-center">
              <div className="p-col-6">
                <div className="p-field-radiobutton">
                  <RadioButton inputId="Ap_fd" name="game_ar" value="approve" onChange={()=>this.setState({gameArej:true})} checked={this.state.gameArej} />
                  <label htmlFor="Ap_fd">Approve</label>
                </div>
              </div>
              <div className="p-col-6">
                <div className="p-field-radiobutton">
                  <RadioButton inputId="Rej_fd" name="game_ar" value="reject" onChange={()=>this.setState({gameArej:false})} checked={!this.state.gameArej} />
                  <label htmlFor="Rej_fd">Reject</label>
                </div>
                <div>
                  <InputTextarea style={{width:'100%'}} value={this.state.rjGame_comment} disabled ={this.state.gameArej} onChange={(e)=>this.setState({rjGame_comment:e.target.value})} />
                </div>
              </div>
            </div>
          </div>
          <div className="submit-button-wrap">
            <Button label="Submit for a review" onClick={this.onClickSubmit}/>
          </div>
        </div>
    );
  }
}

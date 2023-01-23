import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Checkbox } from 'primereact/checkbox';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import ReactPlayer from "react-player";
import marketingService from "../../services/marketing.service";
import FilterService from "../../services/filter.service";
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';

const dateFormatList = [
  {label: 'Day/Month/Year', value: 'DayMonthYear'},
  {label: 'Month/Year', value: 'MonthYear'},
  {label: 'Year', value: 'Year'},
];


export default class MarketingEditGameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      imgBaseUrl: 'https://games-bucket-generated.s3.eu-central-1.amazonaws.com/',
      gameStatus: null,
      name: '',
      description: '',
      platforms: {ios:false, android:false, pc:false, xbox:false},
      links:{appstorelink:"",googleplaylink:"",steamlink:"",xboxstorelink:""},
      website:'',
      typeTags:[],
      selectedTypeTags: null,
      selectedTags:[],
      filteredTypeTags: null,
      players: {singleplayer:false, multiplayer:false},
      orientation:{d2:false, d3:false},
      release: {released:false, upcoming:false},
      released: true,
      dateFormat:dateFormatList[0].value,
      day:1,
      month:1,
      year:2021,
      media_files: [],
      featured_video: null,
    };
    this.searchTypeTags = this.searchTypeTags.bind(this);
    this.tagSelected = this.tagSelected.bind(this);
    this.onPlateformChange = this.onPlateformChange.bind(this);
    this.onPlayerChange = this.onPlayerChange.bind(this);
    this.onOrientationChange = this.onOrientationChange.bind(this);
    this.onReleaseChange = this.onReleaseChange.bind(this);
    this.removeSlectedTag = this.removeSlectedTag.bind(this);
    this.removeFeaturedVideo = this.removeFeaturedVideo.bind(this);
    this.removeMediaFiles = this.removeMediaFiles.bind(this);
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
    if (this.props.gameId) {
      marketingService.getEditGameData(this.props.gameId)
      .then(data => {
        let selectedTags = [];
        if (data.tagAlien) selectedTags.push('Aliens');
        if (data.tagMMORPG) selectedTags.push('MMORPG');
        if (data.tagMOBA) selectedTags.push('MOBA');
        if (data.tagTowerDefense) selectedTags.push('Tower Defense');
        let mediaFiles = [];
        let dataMedia = data.media;
        dataMedia.sort(function(a, b) {
          return a.index - b.index;
        });
        dataMedia.map(eMedia => {
          return mediaFiles.push({
            id: eMedia.id,
            type: eMedia.mediaType,
            filename: eMedia.filename
          });
        });
        let gameData = {
          gameStatus: data.status,
          name: data.name,
          platforms: {ios: data.platformIOS, android: data.platformAndroid, pc: data.platformPC, xbox: data.platformXBox},
          selectedTags: selectedTags,
          players: {singleplayer: data.singleplayer, multiplayer: data.multiplayer},
          orientation:{d2: data.orientation === 'o2D' ? true : false, d3: data.orientation === 'o3D' ? true : false},
          release: {released: data.hasBeenReleased ? true : false, upcoming: data.hasBeenReleased ? false : true},
          media_files: mediaFiles,
          featured_video: {id: data.featuredVideoID, filename: data.featuredVideoName},
          links:{
            xboxstorelink: (data.xboxStoreLink?data.xboxStoreLink:""),
            steamlink: (data.owner.steamLink?data.owner.steamLink:""),
            appstorelink: (data.iTunesLink?data.iTunesLink:""),
            googleplaylink: (data.googlePlayLink?data.googlePlayLink:"")
          },
          website: (data.gameWebsiteLink?data.gameWebsiteLink:"")
        }
        this.setState({...gameData});
      })
    }
  }
 onChangeLinks(e,linkname){
  var linkstate = this.state.links;
  linkstate[linkname] = e.target.value;
  this.setState({links: linkstate});    
 }
  searchTypeTags(event) {
    setTimeout(() => {
        let filteredTypeTags;
        if (!event.query.trim().length) {
          filteredTypeTags = [...this.state.typeTags];
        }
        else {
          filteredTypeTags = this.state.typeTags.filter((typetag) => {
            return (this.state.selectedTags.indexOf(typetag.name)===-1)&&typetag.name.toLowerCase().startsWith(event.query.toLowerCase());
          });
        }

        this.setState({ filteredTypeTags });
    }, 250);
  }

  tagSelected(e){
    let selTags = [...this.state.selectedTags];
    if(selTags.indexOf(e.value.name) === -1)
      selTags.push(e.value.name);
    this.setState({
      selectedTags: selTags,
      selectedTypeTags: null
    });
  }

  onPlateformChange(e) {
    let platforms = this.state.platforms;
    platforms[e.value] = e.checked;
    this.setState({platforms: platforms});
  }

  onPlayerChange(e) {
    let players = this.state.players;
    players[e.value] = e.checked;
    this.setState({players: players});
  }

  onOrientationChange(e) {
    let orientation = this.state.orientation;
    orientation[e.value] = e.checked;
    this.setState({orientation: orientation});
  }

  onReleaseChange(e) {
    let release = this.state.release;
    release[e.value] = e.checked;
    this.setState({release: release});
  }

  removeSlectedTag(index) {
    let selTags = [...this.state.selectedTags];
    selTags.splice(index, 1);
    this.setState({selectedTags: selTags});
  }

  removeFeaturedVideo() {
    this.setState({featured_video: null});
  }

  removeMediaFiles(index) {
    let mediaFiles = [...this.state.media_files]
    mediaFiles.splice(index, 1);
    this.setState({media_files: mediaFiles});
  }

  videoUploader(e) {
    let featured_video = this.state.featured_video;
    if (!featured_video) {
      const data = new FormData();
      data.append('file', e.files[0]);
      marketingService.uploadMediaFile(data).then(res => {
        this.featuredVideoFileUpload.clear();
        if (res) {
          featured_video = {
            id: res.media_id,
            filename: res.filename,
          }
          this.setState({featured_video: featured_video});
        } else {
          this.toastBC.show({severity:'error', summary: 'Faild', detail:'Upload was faild!', life: 3000});
        }
      });
    } else {
      this.featuredVideoFileUpload.clear();
      this.toastBC.show({severity:'error', summary: 'Faild', detail:'Featured Video Already Exist!', life: 3000});
    }
    
  }

  ScreenshotUploader(e) {
    let mediaFiles = this.state.media_files;
    if (mediaFiles.length < 6) {
      const data = new FormData();
      data.append('file', e.files[0]);
      marketingService.uploadMediaFile(data).then(res => {
        this.screenshotFileUpload.clear();
        if (res){
          let mediaFile = {
            id: res.media_id,
            type: "SCREENSHOT",
            filename: res.filename,
          }
          mediaFiles.push(mediaFile);
          this.setState({media_files: mediaFiles});
        } else {
          this.toastBC.show({severity:'error', summary: 'Faild', detail:'Upload was faild!', life: 3000});
        }
      });
    } else {
      this.screenshotFileUpload.clear();
      this.toastBC.show({severity:'error', summary: 'Faild', detail:'Maximum Number of Media Files is 6', life: 3000});
    }
  }

  handleOnDragEnd(result) {
    let mediaFiles = this.state.media_files;
    const [reorderedItem] = mediaFiles.splice(result.source.index, 1);
    mediaFiles.splice(result.destination.index, 0, reorderedItem);
    this.setState({ media_files: mediaFiles });
  }

  onClickSubmit() {
    let platforms = [];
    for (var pkey in this.state.platforms) {
      if (this.state.platforms[pkey]) platforms.push(pkey) ;
    }
    let players = [];
    for (pkey in this.state.players) {
      if (this.state.players[pkey]) players.push(pkey) ;
    }
    let featured_video_id = this.state.featured_video ? this.state.featured_video.id : null;
    let orientation = "2D";
    if (this.state.orientation.d2) orientation = "2D";
    if (this.state.orientation.d3) orientation = "3D";
    var release_date ='';
    if(this.state.dateFormat===dateFormatList[0].value){
      if(this.state.day<10) release_date += "0";
      release_date += this.state.day.toString(10)+'-';
    }
    else release_date = "01-";
    if(this.state.dateFormat!==dateFormatList[2].value){
      if(this.state.month<10) release_date += "0";
      release_date += this.state.month.toString(10)+'-';
    }
    else release_date +="01-";
    release_date += this.state.year.toString(10);
    let submitData = {
      name: this.state.name,
      description: this.state.description,
      platforms: platforms,
      tags: this.state.selectedTags,
      players: players,
      featured_video_id: featured_video_id,
      media_files: this.state.media_files,
      orientation: orientation,
      released: this.state.released,
      release_date: release_date,
      release_date_format: this.state.dateFormat,
      xbox_link : this.state.links.xboxstorelink,
	    website_link: this.state.website,
      itunes_link: this.state.links.appstorelink,
      googleplay_link: this.state.links.googleplaylink,
      playstation_link:""
    }

    if (this.SubmitValidation(submitData)) {
      if (this.props.gameId)
        submitData = { id: this.props.gameId, data: submitData};
      if (this.props.gameId){
        marketingService.editGame(submitData).then(res => {
          if (res) this.setState({ redirect: '/marketing/list'});
        });
      } else {
        marketingService.addGame(submitData).then(res => {
          if (res) this.setState({ redirect: '/marketing/list'});
        });
      }
      
    }
  }

  SubmitValidation(vData){
    if (!vData.name) {
      this.toastBC.show({severity:'error', summary: 'Validation Error', detail:'Name field is required!', life: 3000});
      return false;
    }
    if (!vData.platforms || !vData.platforms.length) {
      this.toastBC.show({severity:'error', summary: 'Validation Error', detail:'Platforms  field is required!', life: 3000});
      return false;
    }
    if (!vData.players || !vData.players.length) {
      this.toastBC.show({severity:'error', summary: 'Validation Error', detail:'Players  field is required!', life: 3000});
      return false;
    }
    if (!vData.orientation || !vData.orientation.length) {
      this.toastBC.show({severity:'error', summary: 'Validation Error', detail:'Orientation  field is required!', life: 3000});
      return false;
    }
    if (!vData.tags || !vData.tags.length) {
      this.toastBC.show({severity:'error', summary: 'Validation Error', detail:'Tags  field is required!', life: 3000});
      return false;
    }
    if (!vData.featured_video_id) {
      this.toastBC.show({severity:'error', summary: 'Validation Error', detail:'Featured video should be slected!', life: 3000});
      return false;
    }
    if (!vData.media_files || vData.media_files.length < 2) {
      this.toastBC.show({severity:'error', summary: 'Validation Error', detail:'Media files should be slected at least 2 screenshots', life: 3000});
      return false;
    }
    return true;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
        <div className="marketing-edit-game-form">
          <Toast ref={(el) => this.toastBC = el}></Toast>
          <h3 className="sub-page-title">{this.props.gameId ? this.state.gameStatus : 'Add a Game'}</h3>
          <div className="p-grid">
            <div className="p-col-2">Name: </div>
            <div className="p-col-10">
              <InputText value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
            </div>
          </div>
          <div className="p-grid">
            <div className="p-col-2">Platforms: </div>
            <div className="p-col-10">
              <div className="p-formgroup-inline">
                <div className="p-field-checkbox">
                    <Checkbox inputId="ios_fd" name="ios" value="ios" onChange={this.onPlateformChange} checked={this.state.platforms.ios} />
                    <label htmlFor="ios_fd">iOS</label>
                </div>
                <div className="p-field-checkbox">
                    <Checkbox inputId="android_fd" name="android" value="android" onChange={this.onPlateformChange} checked={this.state.platforms.android} />
                    <label htmlFor="android_fd">Android</label>
                </div>
                <div className="p-field-checkbox">
                    <Checkbox inputId="pc_fd" name="pc" value="pc" onChange={this.onPlateformChange} checked={this.state.platforms.pc} />
                    <label htmlFor="pc_fd">PC</label>
                </div>
                <div className="p-field-checkbox">
                    <Checkbox inputId="xbox_fd" name="xbox" value="xbox" onChange={this.onPlateformChange} checked={this.state.platforms.xbox} />
                    <label htmlFor="xbox_fd">XBox</label>
                </div>
              </div>
              <div>
                {this.state.platforms.ios?(
                  <div className="p-grid p-align-center">
                    <div className="p-col-2">AppStore Link: </div>
                    <div className="p-col-10">
                      <InputText value={this.state.links.appstorelink} onChange={(e)=>this.onChangeLinks(e,"appstorelink")} />
                    </div>
                  </div>
                ):""}
                {this.state.platforms.android?(
                  <div className="p-grid p-align-center">
                    <div className="p-col-2">GooglePlay Link: </div>
                    <div className="p-col-10">
                      <InputText value={this.state.links.googleplaylink} onChange={(e)=>this.onChangeLinks(e,"googleplaylink")} />
                    </div>
                  </div>
                ):""}
                {this.state.platforms.pc?(
                  <div className="p-grid p-align-center">
                    <div className="p-col-2">Steam Link: </div>
                    <div className="p-col-10">
                      <InputText value={this.state.links.steamlink} onChange={(e)=>this.onChangeLinks(e,"steamlink")} />
                    </div>
                  </div>
                ):""}
                {this.state.platforms.xbox?(
                  <div className="p-grid p-align-center">
                    <div className="p-col-2">Xbox Store Link: </div>
                    <div className="p-col-10">
                      <InputText value={this.state.links.xboxstorelink} onChange={(e)=>this.onChangeLinks(e,"xboxstorelink")} />
                    </div>
                  </div>
                ):""}
                </div>
              </div>
          </div>
          <div className="p-grid">
            <div className="p-col-2">Players: </div>
            <div className="p-col-10">
              <div className="p-formgroup-inline">
                <div className="p-field-checkbox">
                    <Checkbox inputId="single_fd" name="singleplayer" value="singleplayer" onChange={this.onPlayerChange} checked={this.state.players.singleplayer} />
                    <label htmlFor="single_fd">Singleplayer</label>
                </div>
                <div className="p-field-checkbox">
                    <Checkbox inputId="multi_fd" name="multiplayer" value="multiplayer" onChange={this.onPlayerChange} checked={this.state.players.multiplayer} />
                    <label htmlFor="multi_fd">Multiplayer</label>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="p-grid">
            <div className="p-col-2">Orientation: </div>
            <div className="p-col-10">
              <div className="p-formgroup-inline">
                <div className="p-field-checkbox">
                    <Checkbox inputId="d2_fd" name="d2" value="d2" onChange={this.onOrientationChange} checked={this.state.orientation.d2} />
                    <label htmlFor="d2_fd">2D</label>
                </div>
                <div className="p-field-checkbox">
                    <Checkbox inputId="d3_fd" name="d3" value="d3" onChange={this.onOrientationChange} checked={this.state.orientation.d3} />
                    <label htmlFor="d3_fd">3D</label>
                </div>
              </div>
            </div>
          </div> */}
          <div className="p-grid">
            <div className="p-col-2">Release: </div>
            <div className="p-col-10">
              <div className="p-formgroup-inline">
                <div className="p-field-checkbox">
                    <Checkbox inputId="released_fd" name="released" value="released" onChange={this.onReleaseChange} checked={this.state.release.released} />
                    <label htmlFor="released_fd">Released</label>
                </div>
                <div className="p-field-checkbox">
                    <Checkbox inputId="upcoming_fd" name="upcoming" value="upcoming" onChange={this.onReleaseChange} checked={this.state.release.upcoming} />
                    <label htmlFor="upcoming_fd">Upcoming</label>
                </div>
              </div>
            </div>
          </div>
          <div className="p-grid">
            <div className="p-col-2">Type/Tags: </div>
            <div className="p-col-10">
              <AutoComplete value={this.state.selectedTypeTags} suggestions={this.state.filteredTypeTags} completeMethod={this.searchTypeTags} field="name" onChange={(e) => this.setState({ selectedTypeTags: e.value })} onSelect={this.tagSelected} />
              <br/>
              <br/>
              {this.state.selectedTags.map((tag, index) => <Button key={index} label={tag} onClick={() => this.removeSlectedTag(index)} icon="pi pi-times" iconPos="right" className="p-mx-1"/>)}
            </div>
          </div>
          <div className="p-grid">
            <div className="p-col-2">WebSite: </div>
            <div className="p-col-10">
              <InputText value={this.state.website} onChange={(e) => this.setState({website: e.target.value})} />
            </div>
          </div>
          <div>
            <p>Released Date</p>
            <div className="p-d-flex">
              <div className="p-field-radiobutton p-col-2">
                  <RadioButton inputId="rel_fd" name="radio_released" value="released" onChange={()=>this.setState({released:true})} checked={this.state.released} />
                  <label htmlFor="rel_fd">Released Game</label>
              </div>
              <div className="p-field-checkbox p-col=2">
                  <RadioButton inputId="upc_fd" name="radio_released" value="upcoming" onChange={()=>this.setState({released:false})} checked={!this.state.released} />
                  <label htmlFor="upc_fd">Upcoming game</label>
              </div>
            </div>
            <div className="p-d-flex p-align-center">
              <div>Date Format:&nbsp;&nbsp;</div>
              <div className="p-col-2">
                <Dropdown className="p-dropdown" value={this.state.dateFormat} options={dateFormatList} onChange={(e) => this.setState({dateFormat:e.value})}/>
              </div>
              {this.state.dateFormat===dateFormatList[0].value&&
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;Day&nbsp;<InputText value={this.state.day} onChange={(e)=>this.setState({day:e.target.value})} /></div>
              }
              {this.state.dateFormat!==dateFormatList[2].value&&
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;Month&nbsp;<InputText value={this.state.month} onChange={(e)=>this.setState({month:e.target.value})} /></div>
              }
              <div>&nbsp;&nbsp;&nbsp;&nbsp;Year&nbsp;<InputText value={this.state.year} onChange={(e)=>this.setState({year:e.target.value})} /></div>
            </div>
            <div className="p-d-flex">
              {this.state.released?<p>Released&nbsp;</p>:<p>Coming&nbsp;</p>}{this.state.dateFormat===dateFormatList[0].value?<p>on:&nbsp;&nbsp;</p>:<p>in:&nbsp;&nbsp;</p>}
              {this.state.dateFormat===dateFormatList[0].value&&
                  <div>{this.state.day}-</div>
              }
              {this.state.dateFormat!==dateFormatList[2].value&&
                  <div>{this.state.month}-</div>
              }
              <div>{this.state.year}</div>
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
          <div className="featured-video-wrap">
            <div className="p-grid p-ai-center">
              <div className="p-col-2">
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
                    <div className="p-col-2">
                      <Button icon="pi pi-times" iconPos="right" onClick={this.removeFeaturedVideo} />
                    </div>
                  </React.Fragment>
                  :
                  <div className="p-col-2">
                    <FileUpload ref={(el) => this.featuredVideoFileUpload = el} name="demo" url="./upload" accept="video/*" mode="basic" customUpload uploadHandler={this.videoUploader} auto></FileUpload>
                  </div>
              }
            </div>
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
                              <div className="media-preview-part">
                                <div className="p-grid p-d-flex p-ai-center">
                                  <div className="p-col-2">
                                    <i className="pi pi-bars"></i>
                                  </div>
                                  <div className="p-col-2">
                                    {eMedia.type === "SCREENSHOT" ? 'Screenshot: ' : 'Video'}
                                  </div>
                                  <div className="img-preview p-col-4">
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
                                  
                                  <div className="p-col-2">
                                    <Button icon="pi pi-times" iconPos="right" onClick={() => this.removeMediaFiles(index)} />
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
                    <FileUpload ref={(el) => this.screenshotFileUpload = el} name="demo" accept="image/*,video/*" mode="basic" customUpload uploadHandler={this.ScreenshotUploader} auto></FileUpload>
                  </div>
                  <div className="p-col-2">
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

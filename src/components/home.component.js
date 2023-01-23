import React, { Component } from "react";
import  ReactDOM  from "react-dom";
import VideoGrid from "./videogrid.component";
import { Fieldset } from 'primereact/fieldset';
import {Checkbox} from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import Header from "./common/header";
import  FilterService  from "../services/filter.service";
import GameService from "../services/game.service";
import ReactGA from 'react-ga';
import scrollSnapPolyfill from 'css-scroll-snap-polyfill'

scrollSnapPolyfill();

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        content: "HOME",
        toggleState: true,
        typeTags:[],
        selectedTypeTags: null,
        selectedTags:[],
        filteredTypeTags: null,
        platforms: {ios:false, android:false, pc:true, xbox:false},
        players: {singleplayer:true, multiplayer:true},
        orientation:{d2:false, d3:false},
        release: {released:false, upcoming:false},
        selectedFilters:[],
        games:{},
        grid: 4
    };
    this.onPlateformChange = this.onPlateformChange.bind(this);
    this.onPlayerChange = this.onPlayerChange.bind(this);
    this.onOrientationChange = this.onOrientationChange.bind(this);
    this.onReleaseChange = this.onReleaseChange.bind(this);
    this.searchTypeTags = this.searchTypeTags.bind(this);
    this.tagSelected = this.tagSelected.bind(this);
    this.removeSlectedTag = this.removeSlectedTag.bind(this);
    this.filterSetToggleState = this.filterSetToggleState.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.saveFilterData = this.saveFilterData.bind(this);
    this.getFilterData = this.getFilterData.bind(this);
  }

  saveFilterData(selTags = null) {
    if(!selTags)
      selTags = this.state.selectedTags
    var filterData = {
      platforms: this.state.platforms,
      players: this.state.players,
      orientation: this.state.orientation,
      release: this.state.release,
      tags: selTags
    }
    localStorage.setItem("watch_vidoe_filterdata", JSON.stringify(filterData));
  }

  getFilterData(){
    var filterData = JSON.parse(localStorage.getItem("watch_vidoe_filterdata"));
    if(!filterData)
      filterData = {
        platforms: {ios:false, android:false, pc:true, xbox:false},
        players: {singleplayer:true, multiplayer:true},
        orientation:{d2:false, d3:false},
        release: {released:false, upcoming:false},
        tags:[""]
      }
    this.setState(filterData);
    this.filterVideo(filterData);
  }

  onPlateformChange(e) {
    let platforms = this.state.platforms;
    platforms={ios:("ios"===e.value), android:("android"===e.value), pc:("pc"===e.value), xbox:("xbox"===e.value)};
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


  componentDidMount() {
    FilterService.getTypeTags().then(data => this.setState({ typeTags: data }));
    this.getFilterData();
  }

  onSelectFilters(filterData){
    let selTags =[];
    if(filterData.platforms.ios) selTags.push("iOS");
    if(filterData.platforms.android) selTags.push("Android");
    if(filterData.platforms.pc) selTags.push("PC");
    if(filterData.platforms.xbox) selTags.push("XBox");
    if(filterData.players.singleplayer) selTags.push("SinglePlayer");
    if(filterData.players.multiplayer) selTags.push("MultiPlayer");
    if(filterData.release.released) selTags.push("Released");
    if(filterData.release.upcoming) selTags.push("Upcoming");
    this.setState({
      selectedFilters: selTags
    });
  }
  filterVideo(filterData){
    this.onSelectFilters(filterData);
    const divs = document.getElementById('div');
    GameService.search(filterData).then(data => {
      ReactDOM.render(<VideoGrid games={data} grid={this.state.grid} />, divs,
        ()=>{
        }
      );
      this.setState({games: data});
      ReactGA.event({
        action: "Apply filters",
        data:filterData 
      });
    });
  }

  componentDidUpdate() {
    this.saveFilterData();
    scrollSnapPolyfill();
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

  removeSlectedTag(index){
    let selTags = [...this.state.selectedTags];
    selTags.splice(index, 1);
    this.setState({selectedTags: selTags});
  }

  filterSetToggleState(){
    this.setState({toggleState:!this.state.toggleState})
  }

  applyFilters(){
    var filterData = {
      tags: this.state.selectedTags,
      players: this.state.players,
      platforms: this.state.platforms,
      orientation: this.state.orientation,
      release: this.state.release
    }
    this.setState({toggleState:true});
    this.filterVideo(filterData);
  }

  clearAll(){
    this.setState({
      content: "HOME",
      toggleState: false,
      typeTags:[],
      selectedTypeTags: null,
      selectedTags:[],
      filteredTypeTags: null,
      platforms: {ios:false, android:false, pc:false, xbox:false},
      players: {singleplayer:false, multiplayer:false},
      orientation:{d2:false, d3:false},
      release: {released:false, upcoming:false}
    });
  }
  render() {
    return (
      <React.Fragment>
        <Header/>
        <div className="layout-content">
          <div className="container scrollsnap-start">
            <Fieldset 
              legend="Filters" 
              toggleable collapsed={this.state.toggleState} 
              onToggle={(e) => this.setState({toggleState: e.value})} 
              onExpand={this.filterSetToggleState} 
              onCollapse={this.filterSetToggleState} 
              className="filters-fieldset"
            >
              <div className="p-grid">
                <div className="p-col-2">Platforms: </div>
                <div className="p-col-10">
                  <div className="p-formgroup-inline">
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="ios_fd" name="radio_home" value="ios" onChange={this.onPlateformChange} checked={this.state.platforms.ios} />
                        <label htmlFor="ios_fd">iOS</label>
                    </div>
                    <div className="p-field-checkbox">
                        <RadioButton inputId="android_fd" name="radio_home" value="android" onChange={this.onPlateformChange} checked={this.state.platforms.android} />
                        <label htmlFor="android_fd">Android</label>
                    </div>
                    <div className="p-field-checkbox">
                        <RadioButton inputId="pc_fd" name="radio_home" value="pc" onChange={this.onPlateformChange} checked={this.state.platforms.pc} />
                        <label htmlFor="pc_fd">PC</label>
                    </div>
                    <div className="p-field-checkbox">
                        <RadioButton inputId="xbox_fd" name="radio_home" value="xbox" onChange={this.onPlateformChange} checked={this.state.platforms.xbox} />
                        <label htmlFor="xbox_fd">XBox</label>
                    </div>
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

              <div className="p-d-flex p-p-3 card">
                  <Button label="Apply Filters" type="button" className="p-button-help p-mr-2" onClick={this.applyFilters}/>
                  <Button label="Clear All" type="button" className="p-ml-auto p-button-danger" onClick={this.clearAll} />
              </div>

            </Fieldset>
            {
              this.state.toggleState ?
              <div className="filter-pane">
                {this.state.selectedTags.map((tag, index) => <Button key={index} label={tag} icon="pi pi-icon" iconPos="right" className="p-mx-1"/>)}{this.state.selectedFilters.map((tag, index) => <Button key={index} label={tag} icon="pi pi-icon" iconPos="right" className="p-mx-1"/>)}
              </div>
              : null
            }
            <div className="grid-select">
              <Button icon="pi pi-th-large" className="p-button-info p-mx-1" onClick={() => this.setState({grid: 4})} />
              <Button icon="pi pi-credit-card" className="p-button-info p-mx-1" onClick={() => this.setState({grid: 2})}/>
              <Button icon="pi pi-desktop" className="p-button-info p-mx-1" onClick={() => this.setState({grid: 1})}/>
            </div>
          </div>
          <div id="div" className="container"></div>
        </div>
        </React.Fragment>
    );
  }
}

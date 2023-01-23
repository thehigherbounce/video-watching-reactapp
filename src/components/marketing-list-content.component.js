import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";

export default class MarketingListContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imgBaseUrl: 'https://games-bucket-generated.s3.eu-central-1.amazonaws.com/',
      redirect: null,
      editIndex: null,
      editData: null,
    };
  }

  componentDidMount() {
    
  }

  editGamePage(index) {
    this.setState({redirect: '/marketing/edit_game', editIndex: index, editData: this.props.details[index]});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect
        to={{
          pathname: this.state.redirect,
          state: {index: this.state.editIndex, data: this.state.editData}
        }}
      />
    }
    return (
        <div className="marketing-list-content">
          {
            this.props.details.map((itemData, index) => {
              return (
                <div key={index} className="marketing-video-item p-d-flex p-jc-between p-ai-center" onClick={() => this.editGamePage(index)}>
                  <div className="left-side p-d-flex p-jc-between p-ai-center">
                    <div className="status p-mr-3">
                      <span className={itemData.status}>{itemData.status}</span>
                    </div>
                    <div className="f-image p-mr-3">
                      <img src={this.state.imgBaseUrl + itemData.screenshot.filename} alt={itemData.name}/>
                    </div>
                    <div className="game-name-platforms p-mr-3">
                      <div className="game-name">{itemData.name}</div>
                      <div className="game-platforms">iOS, Android, PC, XBox</div>
                    </div>
                  </div>
                  <div className="numbers p-d-flex">
                    <div className="icon-group p-mr-2">
                      <i className="pi pi-eye" style={{'fontSize': '2em'}}></i>
                      <br/>
                      <span className="number">{itemData.viewCount}</span>
                    </div>
                    <div className="icon-group p-mr-2">
                      <i className="pi pi-thumbs-up" style={{'fontSize': '2em'}}></i>
                      <br/>
                      <span className="number">{itemData.likeCount}</span>
                    </div>
                    <div className="icon-group p-mr-2">
                      <i className="pi pi-thumbs-down" style={{'fontSize': '2em'}}></i>
                      <br/>
                      <span className="number">{itemData.dislikeCount}</span>
                    </div>
                  </div>
                </div>
              ) 
            })
          }
        </div>
    );
  }
}

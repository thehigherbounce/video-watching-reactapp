import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Toast } from 'primereact/toast';

export default class AdminListContent extends Component {
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
    this.setState({redirect: '/admin/edit_game', editIndex: index, editData: this.props.details[index]});
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
        <div className="admin-list-content">
          {
            this.props.details.map((itemData, index) => {
              return (
                <div key={index} className="admin-video-item p-d-flex p-jc-between p-ai-center" onClick={() => this.editGamePage(index)}>
                  <div className="left-side p-d-flex p-jc-between p-ai-center">
                    <div className="status p-mr-3">
                      <span className={itemData.status}>{itemData.status}</span>
                    </div>
                    <div className="f-image p-mr-3">
                      <img src={this.state.imgBaseUrl + itemData.featuredScreenshot.filename} alt={itemData.name}/>
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
                      <span className="number">{itemData.viewsCount}</span>
                    </div>
                    <div className="icon-group p-mr-2">
                      <i className="pi pi-thumbs-up" style={{'fontSize': '2em'}}></i>
                      <br/>
                      <span className="number">{itemData.likesCount}</span>
                    </div>
                    <div className="icon-group p-mr-2">
                      <i className="pi pi-thumbs-down" style={{'fontSize': '2em'}}></i>
                      <br/>
                      <span className="number">{itemData.dislikesCount}</span>
                    </div>
                  </div>
                </div>
              ) 
            })
          }
          <Toast ref={(el) => this.toastBC = el}></Toast>
        </div>
    );
  }
}

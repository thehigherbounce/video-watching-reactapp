import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AdminHeader from "../common/adminHeader";
import AdminEditGameForm from "./admin-edit-game-form.component";


export default class AdminEditGame extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      redirect: null,
      gameId: null,
      gameIndex: null,
      gameData: null
    };
  }

  componentDidMount() {
    if (!this.props.location.state){
      this.setState({ redirect: '/admin'});
    } else {
      this.setState({
        gameId: this.props.location.state.id,
        gameIndex: this.props.location.state.index,
        gameData: this.props.location.state.data
      });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div>
        <AdminHeader/>
        <div className="layout-content">
            <div className="container">
              {this.props.location.state ? 
                <AdminEditGameForm gameData={this.props.location.state.data}/>
                : null
              }
            </div>
        </div>
      </div>
    );
  }
}

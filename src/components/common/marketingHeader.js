import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import AuthService from "../../services/auth.service";

import EventBus from "../../common/EventBus";

export default class MarketingHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: undefined
    };
    this.logout = this.logout.bind(this);
  }

  logout() {
    AuthService.marketingLogout().then(res => {
      if (res) 
        this.setState({ redirect: '/marketing' });
        // window.location.reload("/marketing");
    });
  }

  componentDidMount() {
    const user = AuthService.getCurrentMarketingUser();
    if (user) {
      this.setState({
        currentUser: user,
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  render() {
    const { currentUser } = this.state;
    if (this.state.redirect) {
      return <Redirect
        to={{
          pathname: this.state.redirect,
        }}
      />
    }
    return (
      <div className="layout-topbar">
          <Link to={"/"} className="logo">
            <img src="/logo_.png" alt="load faild"/>
          </Link>
          <ul className="topbar-menu p-unselectable-text" role="menubar">
            <li role="none">
            <Link to={"/marketing/list"} className="nav-link">
              My Games
            </Link>
            </li>

            <li role="none" className="topbar-submenu">
                <Link to={"/marketing/add_game"} className="nav-link">
                  Add a Game
                </Link>
            </li>
          </ul>
          <ul className="topbar-menu p-unselectable-text auth-ul" role="menubar">
          {currentUser ? (
                <React.Fragment>
                  <li className="nav-item">
                      <button className="logoutButton" onClick={this.logout}>Logout</button>
                  </li>
                </React.Fragment>
              ) : (
              <React.Fragment>
                  <li role="none" className="topbar-submenu">
                      <a className="nav-link" href="/marketing">
                        Login
                      </a>
                  </li>
              </React.Fragment>
              )}
          </ul>
        </div>
    );
  }
}

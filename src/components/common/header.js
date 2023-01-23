import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import Login from "../login.component";
import Register from "../register.component";

import EventBus from "../../common/EventBus";
import AuthService from "../../services/auth.service";
import ReactGA from 'react-ga';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModeratorBoard: false,
      showAdminBoard: true,
      currentUser: undefined
    };
    this.logOut = this.logOut.bind(this);
    this.onDialog = this.onDialog.bind(this);
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: false,
        showAdminBoard: true,
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }
  
  onDialog(name) {
    let state = {
      [`${name}`]: true
    };

    this.setState(state);
  }

  onHideDialog(name) {
      this.setState({
          [`${name}`]: false
      });
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
      showModeratorBoard: false,
      showAdminBoard: false,
    });
    ReactGA.event({
      action: "Logout"
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    return (
      <React.Fragment>
        <div className="layout-topbar">
            <Link to={"/"} className="logo">
              <img src="/logo_.png" alt="load faild"/>
            </Link>
            <ul className="topbar-menu p-unselectable-text" role="menubar">
              <li role="none">
              <Link to={"/home"} className="nav-link">
                  Home
              </Link>
              </li>

              <li role="none" className="topbar-submenu">
                  <Link to={"/marketing"} className="nav-link">
                      Marketing
                  </Link>
              </li>
              {showModeratorBoard && (
              <li role="none" className="topbar-submenu">
                  <Link to={"/mod"} className="nav-link">
                  Moderator Board
                  </Link>
              </li>
              )}
              {showAdminBoard && (
              <li role="none" className="topbar-submenu">
                  <Link to={"/admin/search"} className="nav-link">
                  Admin
                  </Link>
              </li>
              )}

              {/* {currentUser && (
              <li role="none" className="topbar-submenu">
                  <Link to={"/user"} className="nav-link">
                  User
                  </Link>
              </li>
              )} */}
            </ul>
            <ul className="topbar-menu p-unselectable-text auth-ul" role="menubar">
            {currentUser ? (
                  <React.Fragment>
                    <li className="nav-item">
                        <Link to={"/profile"} className="nav-link">
                        Profile
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a href="/login" className="nav-link" onClick={this.logOut}>
                        LogOut
                        </a>
                    </li>
                  </React.Fragment>
                ) : (
                <React.Fragment>
                    <li role="none" className="topbar-submenu">
                        <a className="nav-link" href="#!" onClick={() => this.onDialog('loginDialog')}>
                        Login
                        </a>
                    </li>

                    <li role="none" className="topbar-submenu">
                      <a className="nav-link" href="#!" onClick={() => this.onDialog('registerDialog')}>
                        Sign Up
                        </a>
                    </li>
                </React.Fragment>
                )}
            </ul>
          </div>
          <Dialog header="Login" visible={this.state.loginDialog} style={{ width: '380px', padding: 0}} onHide={() => this.onHideDialog('loginDialog')}>
              <Login/>
          </Dialog>

          <Dialog header="Register" visible={this.state.registerDialog} style={{ width: '380px' }} onHide={() => this.onHideDialog('registerDialog')}>
              <Register/>
          </Dialog>
        </React.Fragment>
    );
  }
}

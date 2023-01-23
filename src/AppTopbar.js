import React, { Component } from 'react';

import AuthService from "./services/auth.service";

import { Link } from 'react-router-dom';

import EventBus from "./common/EventBus";

export class AppTopbar extends Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
    
        this.state = {
          showModeratorBoard: false,
          showAdminBoard: false,
          currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        // if (user) {
        //   this.setState({
        //     currentUser: user,
        //     showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        //     showAdminBoard: user.roles.includes("ROLE_ADMIN"),
        //   });
        // }
        if (user) {
            this.setState({
            currentUser: user,
            showModeratorBoard: false,
            showAdminBoard: false,
            });
        }
        
        EventBus.on("logout", () => {
            this.logOut();
        });
        }

        componentWillUnmount() {
        EventBus.remove("logout");
        }

        logOut() {
        AuthService.logout();
        this.setState({
            showModeratorBoard: false,
            showAdminBoard: false,
            currentUser: undefined,
        });
        }

    render() {
        return (
            <div className="layout-topbar">

                <Link to="/" className="logo" aria-label="PrimeReact logo">
                    <img alt="logo" src="logo.png" />
                    My DEV
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
                        <Link to={"/admin"} className="nav-link">
                        Admin Board
                        </Link>
                    </li>
                    )}

                    {currentUser && (
                    <li role="none" className="topbar-submenu">
                        <Link to={"/user"} className="nav-link">
                        User
                        </Link>
                    </li>
                    )}

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/profile"} className="nav-link">
                                {currentUser.username}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={this.logOut}>
                                LogOut
                                </a>
                            </li>
                        </div>
                    ) : (
                    <div className="navbar-nav ml-auto">
                        <li role="none" className="topbar-submenu">
                            <Link to={"/login"} className="nav-link">
                            Login
                            </Link>
                        </li>

                        <li role="none" className="topbar-submenu">
                            <Link to={"/register"} className="nav-link">
                            Sign Up
                            </Link>
                        </li>
                    </div>
                    )}
                </ul>
            </div>
        );
    }
}

export default AppTopbar;

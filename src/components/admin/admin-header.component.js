import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../services/auth.service";

export default class AdminHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      AdminUserReady: false,
      currentAdminUser: { email: "" },
    };
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const currentAdminUser = AuthService.getCurrentAdminUser();
    if (!currentAdminUser) {
      this.setState({ redirect: '/admin' });
    }else {
      this.setState({ currentAdminUser: currentAdminUser, AdminUserReady: true });
    }
  }

  logout() {
    AuthService.adminLogout().then(res => {
      if (res)
        this.setState({ redirect: '/admin' });
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <section className="navigation">
        <div className="nav-container">
          <nav>
            <div className="nav-mobile"><a id="navbar-toggle" href="#!"><span></span></a></div>
            <ul className="nav-list">
              <li>
                <a href="/admin/search">Search</a>
              </li>
              <li>
                <a href="/admin/edit_game">Edit Game</a>
              </li>
              
              <li>
                <a href="#!" onClick={this.logout}>Logout</a>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    );
  }
}

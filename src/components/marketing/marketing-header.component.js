import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../services/auth.service";

export default class MarketingHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      MarketingUserReady: false,
      currentMarketingUser: { email: "" },
    };
    this.logout = this.logout.bind(this);

  }

  componentDidMount() {
    const currentMarketingUser = AuthService.getCurrentMarketingUser();
    if (!currentMarketingUser) {
      this.setState({ redirect: '/marketing' });
    }else {
      this.setState({ currentMarketingUser: currentMarketingUser, MarketingUserReady: true });
    }
  }

  logout() {
    AuthService.marketingLogout().then(res => {
      if (res) 
        //this.setState({ redirect: '/marketing' });
        window.location.reload("/marketing");
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
                <a href="/marketing/list">My Games</a>
              </li>
              <li>
                <a href="/marketing/add_game">Add a Game</a>
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

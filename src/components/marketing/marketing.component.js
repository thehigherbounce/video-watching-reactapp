import React, { Component } from "react";
import { Redirect } from "react-router-dom";
// import MarketingHeader from "./marketing-header.component";
import MarketingLogin from "./marketing-login.component";
import AuthService from "../../services/auth.service";

export default class Marketing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      MarketingUserReady: false,
      currentMarketingUser: { email: "" },
    };

  }

  componentDidMount() {
    const currentMarketingUser = AuthService.getCurrentMarketingUser();
    if (!currentMarketingUser) {
      this.setState({ redirect: null });
    }else {
      this.setState({ currentMarketingUser: currentMarketingUser, MarketingUserReady: true });
      this.setState({ redirect: "/marketing/list" });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
        <div className="layout-content">
            <div className="container">
                <MarketingLogin/>
            </div>
        </div>
    );
  }
}

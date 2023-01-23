import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AdminLogin from "./admin-login.component";
import AuthService from "../../services/auth.service";

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      AdminUserReady: false,
      currentAdminUser: { email: "" },
    };

  }

  componentDidMount() {
    const currentAdminUser = AuthService.getCurrentAdminUser();
    if (!currentAdminUser) {
      this.setState({ redirect: null });
    }else {
      this.setState({ currentAdminUser: currentAdminUser, AdminUserReady: true });
      this.setState({ redirect: "/admin/search" });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
        <div className="layout-content">
            <div className="container">
                <AdminLogin/>
            </div>
        </div>
    );
  }
}

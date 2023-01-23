import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import AuthService from "../services/auth.service";
import ReactGA from 'react-ga';
import GoogleLogin from 'react-google-login';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      email: "",
      password: "",
      loading: false,
      message: ""
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  responseGoogle() {

  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.email, this.state.password).then(
        () => {
          // this.props.history.push("/profile");
          localStorage.removeItem("gameViewed");
          window.location.reload();
          ReactGA.event({
            action: "Login"
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
      <div className="col-md-12 marketing-login-form">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >
            <div className="p-field">
              <label htmlFor="fieldId" className="p-d-block">Email</label>
              <InputText 
                className="p-d-block login-input"
                id="fieldId" 
                type="text" 
                name="email" 
                value={this.state.email} 
                onChange={this.onChangeEmail}
                validations={[required, email]}
              />
            </div>

            <div className="p-field">
              <label htmlFor="password" className="p-d-block">Password</label>
              <InputText 
                className="p-d-block login-input"
                type="password" 
                name="password" 
                value={this.state.password} 
                onChange={this.onChangePassword}
                validations={[required]}
              />
            </div>

            <div className="p-field">
              <Button label="Login" disabled={this.state.loading} loading={this.state.loading} loadingoptions={{ position: 'right' }}/>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
        <div className="googleLoginWrap">
          <GoogleLogin
            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </div>
      </div>
    );
  }
}

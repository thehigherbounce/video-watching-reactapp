import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import AuthService from "../../services/auth.service";

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

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export default class MarketingLogin extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      email: "",
      password: "",
      loading: false,
      message: "",
      pageState: "login"
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

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.marketingLogin(this.state.email, this.state.password).then(
        () => {   
          window.location.reload("/marketing");
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

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.marketingRegister(
        this.state.email,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
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
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  render() {
    if (this.state.pageState === 'login'){
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
          <div className="register-wrap">Still haven’t created a Marketing account? 
            <a href="#!" className="register-link" onClick={() => this.setState({ pageState: "register" })}>Sign up</a>
          </div>
        </div>
      );
    }
    if (this.state.pageState === 'register'){
      return (
        <div className="col-md-12 marketing-login-form">
          <div className="card card-container">
            <img
              src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
              alt="profile-img"
              className="profile-img-card"
            />
  
            <Form
              onSubmit={this.handleRegister}
              ref={c => {
                this.form = c;
              }}
            >
              {!this.state.successful && (
                <div>
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
                      validations={[required, vpassword]}
                    />
                  </div>
  
                  <div className="p-field">
                    <Button label="Sign Up" />
                  </div>
                </div>
              )}
  
              {this.state.message && (
                <div className="form-group">
                  <div
                    className={
                      this.state.successful
                        ? "alert alert-success"
                        : "alert alert-danger"
                    }
                    role="alert"
                  >
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
          <div className="register-wrap">Are you already registered? 
            <a href="#!" className="register-link" onClick={() => this.setState({ pageState: "login" })}>Sign in</a>
          </div>
        </div>
      );
    }
  }
}

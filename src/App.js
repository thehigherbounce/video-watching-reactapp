import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import './assets/style/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import "./App.css";
import './assets/style/app/App.scss';

import AuthService from "./services/auth.service";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import Marketing from "./components/marketing/marketing.component";
import MarketingList from "./components/marketing/marketing-list.component";
import MarketingAddGame from "./components/marketing/marketing-add-game.component";
import MarketingEditGame from "./components/marketing/marketing-edit-game.component";
import Admin from "./components/admin/admin.component";
import AdminSearch from "./components/admin/admin-search.component";
import AdminEditGame from "./components/admin/admin-edit-game.component";
import ReactGA from 'react-ga';
import RouteChangeTracker from './common/route-tracker';


// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

const TRACKING_ID = "G-R9SJ7BMV0X"; 
ReactGA.initialize(TRACKING_ID); 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModeratorBoard: false,
      showAdminBoard: true,
      currentUser: undefined,
    };
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

  componentWillUnmount() {
    EventBus.remove("logout");
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
    return (
      <div>
      <RouteChangeTracker/>
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path={["/", "/marketing"]} component={Marketing} />
            <Route exact path={["/", "/marketing/list"]} component={MarketingList} />
            <Route exact path={["/", "/marketing/add_game"]} component={MarketingAddGame} />
            <Route exact path={["/", "/marketing/edit_game"]} component={MarketingEditGame} />
            
            <Route exact path={["/", "/admin"]} component={Admin} />
            <Route exact path={["/", "/admin/search"]} component={AdminSearch} />
            <Route exact path={["/", "/admin/edit_game"]} component={AdminEditGame} />
            <Route exact path="/profile" component={Profile} />
            {/* <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} /> 
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/mod" component={BoardModerator} />
            <Route path="/admin" component={BoardAdmin} /> */}
          </Switch>
        </div>
    );
  }
}
export default App;

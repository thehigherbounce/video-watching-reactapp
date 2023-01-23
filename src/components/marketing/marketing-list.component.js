import React, { Component } from "react";
import marketingService from "../../services/marketing.service";
import MarketingHeader from "../common/marketingHeader";
// import MarketingHeader from "./marketing-header.component";
import MarketingListContent from "./marketing-list-content.component";

export default class MarketingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myGames: [],
    };

    this.getMyGames = this.getMyGames.bind(this);
  }

  componentDidMount() {
    this.getMyGames();
  }

  getMyGames() {
    marketingService.myGames().then(data => {
      this.setState({myGames: data.items});
    });
  }

  render() {
    return (
      <div>
        <MarketingHeader/>
        <div className="layout-content">
            <div className="container">
                <MarketingListContent details={this.state.myGames}/>
            </div>
        </div>
      </div>
    );
  }
}

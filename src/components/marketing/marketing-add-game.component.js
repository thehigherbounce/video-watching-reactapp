import React, { Component } from "react";
import MarketingHeader from "../common/marketingHeader";
import MarketingEditGameForm from "./marketing-edit-game-form.component";

export default class MarketingAddGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
     
    };

  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div>
        <MarketingHeader/>
        <div className="layout-content">
            <div className="container">
              <MarketingEditGameForm/>
            </div>
        </div>
      </div>
    );
  }
}

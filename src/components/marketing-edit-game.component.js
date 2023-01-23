import React, { Component } from "react";
import MarketingHeader from "./marketing-header.component";
import MarketingEditGameForm from "./marketing-edit-game-form.component";

export default class MarketingEditGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  componentDidMount() {
    
  }
  
  render() {
    return (
        <div className="layout-content">
            <div className="container">
              <MarketingHeader/>
              <MarketingEditGameForm/>
            </div>
        </div>
    );
  }
}

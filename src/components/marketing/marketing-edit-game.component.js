import React, { Component } from "react";
import MarketingHeader from "../common/marketingHeader";
import MarketingEditGameForm from "./marketing-edit-game-form.component";

export default class MarketingEditGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: this.props.location.state.id,
      gameIndex: this.props.location.state.index,
      gameData: null
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
              <MarketingEditGameForm gameId={this.props.location.state.id}/>
            </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import AdminService from "../../services/admin.service";
import AdminHeader from "../common/adminHeader";
import AdminSearchFilter from "./admin-search-filter.component";
import AdminListContent from "./admin-list-content.component";
import { Toast } from 'primereact/toast';

export default class AdminSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedGames: [],
    };

    this.SearchGames = this.searchGames.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  componentDidMount() {
    this.searchGames({ status: 'Pending' });
  }

  searchGames(filter) {
    AdminService.search(filter).then(data => {
      this.setState({searchedGames: data.games});
    });
  }

  applyFilter(filter) {
    if(filter.name || filter.companyName){
      this.searchGames(filter);
    } else {
      this.toastBC.show({severity:'error', summary: 'Validation Error', detail:'Either name or company name is not null.', life: 3000});
    }
  } 

  render() {
    return (
      <div>
        <AdminHeader/>
        <div className="layout-content">
            <div className="container">
                <Toast ref={(el) => this.toastBC = el}></Toast>
                <AdminSearchFilter applyFilter={(filter) => this.applyFilter(filter)}/>
                <AdminListContent details={this.state.searchedGames}/>
            </div>
        </div>
      </div>
    );
  }
}

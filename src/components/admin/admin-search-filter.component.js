import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

export default class AdminSearchFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      status: 'Pending',
      companyName: '',
    };

    this.statuss = [
      { name: 'Approved', code: 'Approved' },
      { name: 'Pending', code: 'Pending' },
      { name: 'Rejected', code: 'Rejected' },
      { name: 'Hidden', code: 'Hidden' },
    ];

    this.onStatusChange = this.onStatusChange.bind(this);
  }

  componentDidMount() {
    
  }

  onStatusChange(e) {
    this.setState({ status: e.value.name });
  }

  editGamePage(index) {
    this.setState({redirect: '/admin/edit_game', editIndex: index, editData: this.props.details[index]});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect
        to={{
          pathname: this.state.redirect,
          state: {index: this.state.editIndex, data: this.state.editData}
        }}
      />
    }
    return (
        <div className="admin-search-filter">
          <h3 className="filter-title">Filters</h3>
          <div className="filter-form">
            <div className="p-field p-grid">
              <label htmlFor="name-filter" className="p-col-fixed" style={{width:'100px'}}>Name</label>
              <div className="p-col">
                <InputText id="name-filter" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
              </div>
            </div>
            <div className="p-field p-grid">
              <label htmlFor="company-filter" className="p-col-fixed" style={{width:'100px'}}>Company name</label>
              <div className="p-col">
                <InputText id="company-filter" value={this.state.companyName} onChange={(e) => this.setState({companyName: e.target.value})} />
              </div>
            </div>
            <div className="p-field p-grid">
              <label htmlFor="status-filter" className="p-col-fixed" style={{width:'100px'}}>Status</label>
              <div className="p-col">
                <Dropdown id="status-filter" value={{ name: this.state.status, code: this.state.status }} options={this.statuss} onChange={this.onStatusChange} optionLabel="name" placeholder="Status" />
              </div>
            </div>
            <div className="filter-button">
              <Button label="Apply" className="p-button-info" onClick={() => this.props.applyFilter(this.state)} />
            </div>
          </div>
        </div>
    );
  }
}

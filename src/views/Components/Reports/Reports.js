import React, { Component } from 'react';
import { MDBBtn, MDBRow } from 'mdbreact';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { CSVLink } from "react-csv";
import _ from 'lodash';
import MysqlLayer from 'utils/MysqlLayer';

export default class Reports extends Component {

  reportData = [{
    'dummy': 'dummy'
  }];

  constructor(props) {
    super(props);
    this.state = {
      type: 'business',
      workspace: 'collections',
      clientId: sessionStorage.getItem('cwsClient')
    };

    this.loadCollectionRecords = this.loadCollectionRecords.bind(this);
    this.setExportData = this.setExportData.bind(this);
    this.mysqlLayer = new MysqlLayer();

  }

  componentDidMount() {
    //console.log('state: ', this.state);
    this.loadCollectionRecords();
  }

  async loadCollectionRecords() {
    //console.log('loadCollectionRecords...');
    const type = this.state.type;
    const workspace = this.state.workspace;
    const clientId = this.state.clientId;

    this.reportData = await this.mysqlLayer.Get(`/${type}/${workspace}/list_all_report/${clientId}`);
    //console.log('this.reportData: ', this.reportData);
    this.processReportData();
    this.setState({ staticContext: this.state.staticContext });
  }

  processReportData() {
    //console.log('processReportData...');
    if (!this.reportData) this.reportData = [];

    _.forEach(this.reportData, function(obj) {

      Object.entries(obj).forEach(item => {
        _.set(obj, _.startCase(item[0]), item[1]);
      });

      /* keeping one example of how it works the hard way, just in case
      if (obj.accountNotes) {
        _.set(obj, 'Account Notes', obj.accountNotes);
      }
    */
    });
  }

  setExportData(tableChangeEvent) {
    let table = document.getElementsByTagName('table');
    let exportData = [];

    for (var r = 0, n = table[1].rows.length; r < n; r++) {
      let row = [];
      for (var c = 0, m = table[1].rows[r].cells.length; c < m; c++) {
        row.push(table[1].rows[r].cells[c].innerHTML);
      }
      this.exportData.push(row);
    }

    this.setState({ exportData });
  }

  render() {
    let table = document.getElementsByTagName('table');
    let exportData = [];

    if (table[1] != null) {
      for (var r = 0, n = table[1].rows.length; r < n; r++) {
        let row = [];
        for (var c = 0, m = table[1].rows[r].cells.length; c < m; c++) {
          row.push(table[1].rows[r].cells[c].innerHTML);
        }
        exportData.push(row);
      }
    }

    return (
      <div>
        <h3 className="mb-3">Report</h3>
        <MDBRow className="mb-3">
          <MDBBtn color="mdb-color" onClick={this.loadCollectionRecords}>Load Collection Records</MDBBtn>
          <CSVLink data={exportData} filename={"theSystemDataExport.csv"}>
            <MDBBtn color="mdb-color">Export</MDBBtn>
          </CSVLink>
        </MDBRow>
        <PivotTableUI
          id="pivotTable"
          data={this.reportData}
          onChange={(s) => {
            this.setState(s);
            this.setState(s); //DO NOT DELETE THIS LINE, it makes sure that the export data is not one entry behind.
          }}
          {...this.state}
        />
      </div>
    )
  }
}

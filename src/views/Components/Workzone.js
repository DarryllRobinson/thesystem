import React, { Component } from 'react';
import {Link } from "react-router-dom";
import { MDBDataTable } from 'mdbreact';
import MysqlLayer from 'utils/MysqlLayer';
import moment from 'moment';

class Workzone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordStatus: '',
      columns: [],
      rows: []
    }

    this.mysqlLayer = new MysqlLayer();
    this.loadRecords = this.loadRecords.bind(this);
  }

  async componentDidMount() {
    //console.log('Workzone props: ', this.props);
    //console.log('this.props.location.state: ', this.props.location.state);

    // Figure out what workspace to extract
    let workspace = '';
    if (this.props.location.state === undefined) {
      workspace = this.getWorkspaceName(this.props.history.location.pathname);
    } else {
      workspace = this.props.location.state.workspace
    }

    //console.log('mounting workspace: ', workspace);

    // Determine which currentStatus to set, fallback to default if required
    let recordStatus = '';
    if (workspace === 'applications') {
      if (this.props.location.state === undefined) {
        recordStatus = 'Referred'
      } else {
        recordStatus = this.props.location.state.recordStatus;
      }
    } else if (workspace === 'collections') {
      if (this.props.location.state === undefined) {
        recordStatus = 'Open'
      } else {
        recordStatus = this.props.location.state.recordStatus;
      }
    }
    //console.log('mounting recordStatus: ', recordStatus);

    let task = '';
    if (this.props.location.state.task === undefined) {
      task = 'list_all';
    } else {
      task = this.props.location.state.task;
    }

    this.setState({
      recordStatus: recordStatus,
      task: task,
      workspace: workspace
    });

    //console.log('this.state.recordStatus: ', this.state.recordStatus);
    this.loadRecords(recordStatus, task, workspace);
    //this.loadRecords(this.state.recordStatus);
  }

  getWorkspaceName(pathname) {
    //console.log('pathname: ', pathname);
    const searchTerm = '/';
    const indexOfFirst = pathname.indexOf(searchTerm);
    const indexOfSecond = pathname.indexOf(searchTerm, (indexOfFirst + 1));
    const indexOfThird = pathname.indexOf(searchTerm, (indexOfSecond + 1));
    const indexOfFourth = pathname.indexOf(searchTerm, (indexOfThird + 1));
    const indexOfFifth = pathname.indexOf(searchTerm, (indexOfFourth + 1));
    const apiLength = pathname.length;

    /*console.log('indexOfFirst: ', indexOfFirst);
    console.log('indexOfSecond: ', indexOfSecond);
    console.log('indexOfThird: ', indexOfThird);
    console.log('indexOfFourth: ', indexOfFourth);
    console.log('indexOfFifth: ', indexOfFifth);
    console.log('apiLength: ', apiLength);*/

    // For routes with /api/{resource}/{table}/{appcurrentStatus}/:id pattern
    if (indexOfFifth < 0) console.log('5: ', pathname.substring(indexOfThird + 1, indexOfFourth));
    if (indexOfFifth < 0) return pathname.substring(indexOfThird + 1, indexOfFourth);
    // For routes with /api/{resource}/{table}/:id pattern
    if (indexOfFourth < 0) console.log('4: ', pathname.substring(indexOfThird + 1, apiLength));
    if (indexOfFourth < 0) return pathname.substring(indexOfThird + 1, apiLength);
    // For routes with /api/{table}/:id pattern
    if (indexOfThird < 0) console.log('3: ', pathname.substring(indexOfSecond + 1, apiLength));
    if (indexOfThird < 0) return pathname.substring(indexOfSecond + 1, apiLength);
    // For routes with /api/{table} pattern
    if (indexOfSecond < 0) console.log('2: ', pathname.substring(indexOfFirst, indexOfSecond + 1));
    if (indexOfSecond < 0) return pathname.substring(indexOfFirst, apiLength);
  }

  //async loadRecords(currentStatus, workspace) {
  async loadRecords(currentStatus, task, workspace) {
    //console.log('this.props.history.location.state: ', this.props.history.location.state);
    //console.log('loading records: ', this.props.location.state.records.length === 0);
    //console.log('currentStatus: ', currentStatus);
    workspace = 'collections';
    //console.log('workspace: ', workspace);
    //const currentStatus = this.state.recordStatus;
    //const workspace = this.state.workspace ? this.state.workspace : this.props.workspace;

    let records = [];
    let clientId = sessionStorage.getItem('cwsClient');
    const type = this.props.location.state.type ? this.props.location.state.type : sessionStorage.getItem('cwsType');
    //if (workspace === 'cases') workspace = 'collections';
    //const workspace = this.props.location.state.workspace;
    //console.log('typeof: ', typeof workspace);
    const workrecord = workspace.substring(0, workspace.length - 1);
    //console.log('workrecord: ', workrecord);

    // check if any records were sent as props
    if (this.props.history.location.state.records) { //console.log('props records: ', this.props.history.location.state.records);
      records = this.props.history.location.state.records;
    } else {
      records = await this.mysqlLayer.Get(`/${type}/${workspace}/list_all/${clientId}`);
    }
    /*if (!this.props.location.state.records || this.props.location.state.records.length === 0) { */ //}
    //else { records = this.props.location.state.records; }
    //console.log('records: ', records);
    let recordStatus = currentStatus;
    //console.log('recordStatus: ', recordStatus);
    let rows = [];
    let columns = [];

    if (records) {
      records.forEach(record => {
        //console.log('record: ', record);
        if (record.currentStatus === recordStatus && workspace === 'applications') {
          //console.log('records: applications');
          let row = {
            recordId: record.id,
            firstName: record.firstName,
            surname: record.surname,
            idNumber: record.idNumber,
            currentStatus: record.currentStatus,
            limit: record.limit,
            createdBy: record.createdBy,
            createdDate: moment(record.createdDate).format('YYYY-MM-DD HH:mm:ss'),
            //id: <button type="button" className="btn btn-secondary" name={record.id} size="sm" onClick={this.openRecord}>Open</button>
            id: <Link className="nav-link" to={{
                pathname: `/workzone/${workspace}/${workrecord}/${record.id}`,
                state: {
                  recordId: record.id,
                  record: record,
                  type: type,
                  workrecord: workrecord,
                  workspace: workspace
                }
              }}
              style={{padding: 0}}><button type="button" className="btn btn-secondary" size="sm">Open</button></Link>
          }
          rows.push(row);

          columns = [
            {
              label: 'Record ID',
              field: 'recordId',
              sort: 'asc'
            },
            {
              label: 'First Name',
              field: 'firstName',
              sort: 'asc'
            },
            {
              label: 'Surname',
              field: 'surname',
              sort: 'asc'
            },
            {
              label: 'ID Number',
              field: 'idNumber',
              sort: 'asc'
            },
            {
              label: 'Status',
              field: 'currentStatus',
              sort: 'asc'
            },
            {
              label: 'Limit',
              field: 'limit',
              sort: 'asc'
            },
            {
              label: 'Agent',
              field: 'createdBy',
              sort: 'asc'
            },
            {
              label: 'Date Created',
              field: 'createdDate',
              sort: 'asc'
            },
            {
              label: 'Open',
              field: 'id',
              sort: 'asc'
            }
          ];
        } else if (record.currentStatus === recordStatus && workspace === 'collections') {
          //console.log('recordStatus: ', recordStatus);
          //console.log('records: ', record);
          //console.log('record.updatedDate: ', record.updatedDate);
          const updatedDate = record.updatedDate ? moment(record.updatedDate).format('YYYY-MM-DD HH:mm:ss') : '';
          //console.log('updatedDate: ', updatedDate);

          //record.tags.forEach(tag => {
            //if (tag === task) {
              let row = {
                recordId: record.caseId,
                accountNumber: record.accountNumber,
                caseId: record.caseId,
                caseNumber: record.caseNumber,
                caseNotes: record.caseNotes,
                name: record.customerName,
                customerAnalysis: record.customerAnalysis,
                regIdNumber: record.regIdNumber,
                debtorAge: record.debtorAge,
                resolution: record.resolution,
                totalBalance: record.totalBalance,
                amountDue: record.amountDue,
                currentBalance: record.currentBalance,
                days30: record.days30,
                days60: record.days60,
                days90: record.days90,
                days120: record.days120,
                days150: record.days150,
                days180: record.days180,
                paymentDueDate: record.paymentDueDate,
                debitOrderDate: record.debitOrderDate,
                lastPaymentDate: record.lastPaymentDate,
                lastPaymentAmount: record.lastPaymentAmount,
                lastPTPDate: record.lastPTPDate,
                lastPTPAmount: record.lastPTPAmount,
                accountNotes: record.accountNotes,
                nextVisitDate: moment(record.nextVisitDate).format('YYYY-MM-DD'),
                currentAssignment: record.currentAssignment,
                updatedBy: record.updatedBy,
                updatedDate: updatedDate,
                createdBy: record.createdBy,
                createdDate: moment(record.createdDate).format('YYYY-MM-DD HH:mm:ss'),
                id: <Link className="nav-link" to={{
                    pathname: `/workzone/${workspace}/${workrecord}/${record.caseId}`,
                    state: {
                      caseId: record.caseId,
                      record: record,
                      type: type,
                      workspace: workspace
                    }
                  }}
                  style={{padding: 0}}><button type="button" className="btn btn-secondary" size="sm">Open</button></Link>
              }

              rows.push(row);
              columns = [
                {
                  label: 'Open',
                  field: 'id',
                  sort: 'asc'
                },
                {
                  label: 'Case Number',
                  field: 'caseId',
                  sort: 'asc'
                },
                {
                  label: 'Account Number',
                  field: 'accountNumber',
                  sort: 'asc'
                },
                {
                  label: 'Customer Name',
                  field: 'name',
                  sort: 'asc'
                },
                {
                  label: 'Customer Analysis',
                  field: 'customerAnalysis',
                  sort: 'asc'
                },
                {
                  label: 'Reg/ID Number',
                  field: 'regIdNumber',
                  sort: 'asc'
                },
                {
                  label: 'Debtor Age',
                  field: 'debtorAge',
                  sort: 'asc'
                },
                {
                  label: 'Case Notes',
                  field: 'caseNotes',
                  sort: 'asc'
                },
                {
                  label: 'Total Balance',
                  field: 'totalBalance',
                  sort: 'asc'
                },
                {
                  label: 'Amount Due',
                  field: 'amountDue',
                  sort: 'asc'
                },
                {
                  label: 'Current Balance',
                  field: 'currentBalance',
                  sort: 'asc'
                },
                {
                  label: 'Resolution',
                  field: 'resolution',
                  sort: 'asc'
                },
                {
                  label: 'Next Visit Date',
                  field: 'nextVisitDate',
                  sort: 'asc'
                },
                {
                  label: 'Current Assignment',
                  field: 'currentAssignment',
                  sort: 'asc'
                },
                {
                  label: 'Updated By',
                  field: 'updatedBy',
                  sort: 'asc'
                },
                {
                  label: 'Date Updated',
                  field: 'updatedDate',
                  sort: 'asc'
                }
              ];
            //}
          //});
        } /*else {
          console.log('record.currentStatus: ', record.currentStatus);
          console.log('recordStatus: ', recordStatus);
          console.log('problem with record: ', record.currentStatus, recordStatus);
        }*/
      });
    }

    this.setState({
      rows: rows,
      columns: columns,
      recordStatus: currentStatus
    });
  }

  /*openRecord(event) {
    let recordId = event.target.name;
    history.push('/workspace/application', { recordId });
  }*/

  componentToLoad() {
    const currentStatus = this.state.recordStatus;
    const workspace = 'collections'; //this.state.workspace;
    //console.log('componentToLoad workspace: ', workspace);
    let workspaceCapitalised = '';
    if (this.state.workspace) workspaceCapitalised = workspace.charAt(0).toUpperCase() + workspace.slice(1);

    switch (workspace) {
      case 'applications':
        switch (currentStatus) {
          case 'Referred': return (
            <div>
              <h4>{workspaceCapitalised}: Referred Applications</h4>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Pended - Agent", this.state.workspace)}>Load Pended Applications</button>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Decline Review - Agent", this.state.workspace)}>Load Decline Review Applications</button>
            </div>
          )
          case 'Pended - Store': return (
            <div>
              <h4>{workspaceCapitalised}: Pended Applications</h4>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Referred", this.state.workspace)}>Load Referred Applications</button>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Decline Review - Store", this.state.workspace)}>Load Decline Review Applications</button>
            </div>
          )
          case 'Decline Review - Store': return (
            <div>
              <h4>{workspaceCapitalised}: Decline Review Applications</h4>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Referred", this.state.workspace)}>Load Referred Applications</button>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Pended - Store", this.state.workspace)}>Load Pended Applications</button>
            </div>
          )
          case 'Pended - Agent': return (
            <div>
              <h4>{workspaceCapitalised}: Pended Applications</h4>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Referred", this.state.workspace)}>Load Referred Applications</button>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Decline Review - Agent", this.state.workspace)}>Load Decline Review Applications</button>
            </div>
          )
          case 'Decline Review - Agent': return (
            <div>
              <h4>{workspaceCapitalised}: Decline Review Applications</h4>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Referred", this.state.workspace)}>Load Referred Applications</button>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Pended - Agent", this.state.workspace)}>Load Pended Applications</button>
            </div>
          )
          default: return (
            <div>
              <h4>Problem Loading !{workspaceCapitalised}! Records</h4>
            </div>
          )
        }

      case 'collections':
        switch (currentStatus) {
          case 'Pended': return (
            <div>
              <h4>{workspaceCapitalised}: Pended Cases</h4>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Open", this.state.workspace)}>Load Open Cases</button>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Closed", this.state.workspace)}>Load Closed Cases</button>
            </div>
          )
          case 'Open': return (
            <div>
              <h4>{workspaceCapitalised}: Open Cases</h4>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Pended", this.state.workspace)}>Load Pended Cases</button>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Closed", this.state.workspace)}>Load Closed Cases</button>
            </div>
          )
          case 'Closed': return (
            <div>
              <h4>{workspaceCapitalised}: Closed Cases</h4>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Open", this.state.workspace)}>Load Open Cases</button>
              <button type="button" className="btn btn-secondary" onClick={() => this.loadRecords("Pended", this.state.workspace)}>Load Pended Cases</button>
            </div>
          )
          default: return (
            <div>
              <h4>Problem Loading !{workspaceCapitalised}! Records</h4>
            </div>
          )
        }
      default: return (
        <div>
          <h4>Problem with selecting a Workspace</h4>
        </div>
      )
    }

  }

  render() {
    let gridData = { columns: this.state.columns, rows: this.state.rows }
    return (
      <div className="col-12">
        {this.componentToLoad()}

        <MDBDataTable
          striped
          bordered
          small
          data={gridData}
        />
      </div>
    )
  }
}

export default Workzone;

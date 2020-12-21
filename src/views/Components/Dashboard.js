import React, { Component } from 'react';
import MysqlLayer from 'utils/MysqlLayer';
import Security from 'utils/Security';
import Welcome from './Workspace/Welcome';
import Workspace from './Workspace/Workspace';
import moment from 'moment';
import { Container } from 'react-bootstrap';
//import Container from '@material-ui/core/Container';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      client: null,
      items: null,
      loading: true,
      paid: 0,
      ptp: 0,
      role: null,
      records: null,
      service: null,
      task: null,
      total: 0,
      worklists: [],
      workspaces: null,
      workzones: []
    }

    this.mysqlLayer = new MysqlLayer();
    this.security = new Security();
  }

  async componentDidMount() {
    let data = {
      firstName: sessionStorage.getItem('cwsFirstName'),
      surname: sessionStorage.getItem('cwsSurname'),
      email: sessionStorage.getItem('cwsUser'),
      role: sessionStorage.getItem('cwsRole'),
      type: sessionStorage.getItem('cwsType'),
      storeId: sessionStorage.getItem('cwsStoreId'),
      clientId: sessionStorage.getItem('cwsClient')
    };

    let user = [];
    user.push(data);
    this.setState({ user: user });

    if (data.role !== 'client') {
      this.prepareAgentDashboard(data.clientId);
    } else {
      this.prepareClientDashboard(data.clientId);
    }
  }

  async prepareClientDashboard(client) {

    // start with extracting the services from the db
    const clientservices = await this.mysqlLayer.Get(`/admin/clientservices/${client}`);
    let services = this.getWorkspaces(clientservices);

    services.forEach(async service => {
      let workspace = service.workspace;
      let type = this.getType(clientservices, service);
      let workzones = this.getWorkzones('client');
      let worklists = [];
      await this.mysqlLayer.Get(`/client/${workspace}/list_all/${client}`
      ).then(async records => {
        worklists = await this.getWorklists(workzones, records);
        let workspaces = [];
        workspaces.push({
          workspace: workspace,
          worklists: worklists
        });

        this.setState({
          type: type,
          workspaces: workspaces
        });
      });
    });
  }

  async prepareAgentDashboard(client) {

    // start with extracting the services from the db
    const clientservices = await this.mysqlLayer.Get(`/admin/clientservices/${client}`);
    let services = this.getWorkspaces(clientservices);
    //console.log('workspaces: ', workspaces);

    services.forEach(async service => {
      let workspace = service.workspace;
      let type = this.getType(clientservices, service);
      let workzones = this.getWorkzones('agent');
      let worklists = [];
      /*console.log('Dashboard service: ', service);
      console.log('Dashboard service type: ', typeof service);
      console.log('Dashboard workspace: ', workspace);
      console.log('Dashboard workspace type: ', typeof workspace);*/
      await this.mysqlLayer.Get(`/${type}/${workspace}/list_all/${client}`
      ).then(async records => {
        worklists = await this.getWorklists(workzones, records);
        let workspaces = [];
        workspaces.push({
          workspace: workspace,
          worklists: worklists
        });

        //console.log('workspaces: ', workspaces);

        this.setState({
          tasks: ['list_all', 'list_today'],
          type: type,
          //records: records,
          workspaces: workspaces
        });
      });
      //console.log('worklists: ', worklists);


    });

    //this.setState({ loading: false });
  }

  getWorkspaces(clientservices) {
    let workspaces = [];
    clientservices.forEach(service => {
      workspaces.push({
        workspace: service.service
      });
    });
    return workspaces;
  }

  getType(clientservices, workspace) {
    let type = '';
    clientservices.forEach(service => {
      if (service.service === workspace.workspace) type = service.type;
    });
    return type;
  }

  getWorkzones(role) {
    switch (role) {
      case 'agent':
        return [
          {
            worklist: 'Queues',
            task: 'list_all'
          },
          {
            worklist: 'Today',
            task: 'list_today'
          }
        ];
      case 'client':
        return [
          {
            worklist: 'Financial',
            task: 'financial'
          },
          {
            worklist: 'Today',
            task: 'list_today'
          }
        ];
      default:
        return [
          {
            worklist: 'Queues',
            task: 'list_all'
          },
          {
            worklist: 'Today',
            task: 'list_today'
          }
        ];
    }

  }

  getWorklists(workzones, records) {
    let worklists = [];
    workzones.forEach(async workzone => {
      //console.log('workzone: ', workzone);
      let items = await this.getItems(workzone.task, records);

      if (items) {
        worklists.push({
          worklist: workzone.worklist,
          items: items
        });
      }

      this.setState({
        worklists: worklists
      });
    });
    return worklists;
  }

  async getItems(task, records) {
    //console.log('task, records: ', task, records);
    let items = [];
    let user = sessionStorage.getItem('cwsUser');

    if (sessionStorage.getItem('cwsRole') !== 'client') {
      let recordStatuses = this.getStatusLists(records);
      recordStatuses.forEach(recordStatus => {
        let count = 0;
        records.forEach(record => {
          let tags = [];
          //if (record.tags === undefined) console.log('undefined');
          if (record.tags !== undefined) tags = record.tags;

          switch (task) {
            case 'list_all':
              if (record.currentStatus === recordStatus) {
                ++count;
                tags.push(task);
              }
              break;
            case 'list_today':
            //console.log('today: ', moment(new Date() - 86400000).format('YYYY-MM-DD'), moment(record.nextVisitDateTime).format('YYYY-MM-DD'));
              if (record.currentStatus === recordStatus
                  && record.currentAssignment === user
                  && moment(record.nextVisitDateTime).format('YYYY-MM-DD') > (moment(new Date() - 86400000)).format('YYYY-MM-DD')) {
                ++count;
                tags.push(task);
                //console.log('list_today id: ', record.id);
              }
              break;
            default:
              console.log('task switch default - there must be a problem');
          }

          record.tags = tags;

        });
        items.push({
          item: recordStatus,
          count: count
        });

        //console.log('about to setState: ', records);
        this.setState({ records: records });
        //console.log('items: ', task, items);
      });
    } else {
      let recordTypes = ['Total owed', 'Paid', 'PTP', 'Outstanding'];
      recordTypes.forEach(recordType => {
        let count = 0;
        records.forEach(record => {
          let tags = [];
          //if (record.tags === undefined) console.log('undefined');
          if (record.tags !== undefined) tags = record.tags;

          switch (task) {
            case 'financial':
              switch (recordType) {
                case 'Total owed':
                  count = record.days60 + record.days90 + record.days120 + record.days150 + record.days180 + record.days180Over;
                  tags.push(recordType);
                  this.setState({ total: count });
                  break;
                case 'Paid':
                  if (record.lastPaymentAmount > 0) {
                    count = record.lastPaymentAmount;
                    tags.push(recordType);
                    this.setState({ paid: count });
                  }
                  break;
                case 'PTP':
                  if (record.lastPTPAmount > 0) {
                    console.log('record.lastPTPAmount: ', record.lastPTPAmount, record.accountNumber);
                    tags.push(recordType);
                    let ptp = this.state.ptp;
                    count = record.lastPTPAmount + ptp;
                    console.log('count: ', count);
                    this.setState({ ptp: count });
                  }
                  break;
                case 'Outstanding':
                  record.tags.forEach(tag => {
                    if (tag !== 'Paid' && tag !== 'PTP') tags.push(recordType);
                  });
                  count = (this.state.total - this.state.paid - this.state.ptp);
                  break;
                default:
                  console.log('Problem with getItems case financial');
              }
              break;
            case 'list_today':
            //console.log('today: ', moment(new Date() - 86400000).format('YYYY-MM-DD'), moment(record.nextVisitDateTime).format('YYYY-MM-DD'));
              if (moment(record.closedDate).format('YYYY-MM-DD') > (moment(new Date() - 86400000)).format('YYYY-MM-DD')) {
                ++count;
                tags.push(task);
                //console.log('list_today id: ', record.id);
              }
              break;
            default:
              console.log('task switch default - there must be a problem. ', task);
          }

          record.tags = tags;

        });
        items.push({
          item: recordType,
          count: count
        });

        //console.log('about to setState: ', records);
        this.setState({ records: records });
        //console.log('items: ', task, items);
      });
    }




    return items;
  }

  getStatusLists(records) {
    let list = [];
    records.forEach(record => {
      list.push(record.currentStatus);
    });

    // filter list for distinct statuseses
    let completeWorklist = list.filter(this.onlyUnique);

    return completeWorklist;
  }

  componentDidUpdate() {
    if (this.props.loggedInStatus === "NOT_LOGGED_IN") {
      this.props.history.push('/');
    }
  }

  filterWorklists(workspace, lists) {
    //console.log('lists: ', lists);
    let role = sessionStorage.getItem('cwsRole');
    //console.log('role: ', role);
    let finalList = [];
    let recordStatuses = [];

    switch (workspace) {
      case 'applications':
        switch (role) {
          case 'agent':
            recordStatuses = ['Approved', 'Declined', 'Cancelled', 'Pended - Agent', 'DeclineReview - Agent', 'Referred'];

            lists.forEach(list => {
              //console.log('list: ', list);
              //console.log(recordStatuses.find(recordStatus => list === recordStatus));
              if (recordStatuses.find(recordStatus => list === recordStatus)) finalList.push(list);
            });
            //console.log('finalList: ', finalList);
            return finalList;
          case 'store':
            recordStatuses = ['Approved', 'Declined', 'Cancelled', 'Pended - Store', 'DeclineReview - Store'];

            lists.forEach(list => {
              //console.log('list: ', list);
              //console.log(recordStatuses.find(recordStatus => list === recordStatus));
              if (recordStatuses.find(recordStatus => list === recordStatus)) finalList.push(list);
            });
            //console.log('finalList: ', finalList);
            return finalList;
          case 'superuser':
            recordStatuses = ['Approved', 'Declined', 'Cancelled', 'Pended - Agent', 'DeclineReview - Agent', 'Pended - Store', 'DeclineReview - Store', 'Referred'];

            lists.forEach(list => {
              //console.log('list: ', list);
              //console.log(recordStatuses.find(recordStatus => list === recordStatus));
              if (recordStatuses.find(recordStatus => list === recordStatus)) finalList.push(list);
            });
            //console.log('finalList: ', finalList);
            return finalList;
          default:
            finalList = ['No record statuses for this user'];
            return finalList;
        }

      case 'collections':
        switch (role) {
          case 'agent':
            recordStatuses = ['Open', 'Closed', 'Pended'];

            lists.forEach(list => {
              //console.log('list: ', list);
              //console.log(recordStatuses.find(recordStatus => list === recordStatus));
              if (recordStatuses.find(recordStatus => list === recordStatus)) finalList.push(list);
            });
            //console.log('finalList: ', finalList);
            return finalList;
          case 'client':
            recordStatuses = ['Open', 'Closed', 'Pended'];
            lists.forEach(list => {
              //console.log('list: ', list);
              //console.log(recordStatuses.find(recordStatus => list === recordStatus));
              if (recordStatuses.find(recordStatus => list === recordStatus)) finalList.push(list);
            });
            //console.log('finalList: ', finalList);
            return finalList;
          case 'store':
            recordStatuses = ['Open', 'Closed', 'Pended'];
            lists.forEach(list => {
              //console.log('list: ', list);
              //console.log(recordStatuses.find(recordStatus => list === recordStatus));
              if (recordStatuses.find(recordStatus => list === recordStatus)) finalList.push(list);
            });
            //console.log('finalList: ', finalList);
            return finalList;
          case 'superuser':
            recordStatuses = ['Open', 'Closed', 'Pended', 'Locked'];
            lists.forEach(list => {
              //console.log('list: ', list);
              //console.log(recordStatuses.find(recordStatus => list === recordStatus));
              if (recordStatuses.find(recordStatus => list === recordStatus)) finalList.push(list);
            });
            //console.log('finalList: ', finalList);
            return finalList;
          default:
            finalList = ['No record statuses for this user'];
            return finalList;
        }

      default:
        finalList = ['No record statuses for this user'];
        return finalList;
    }

  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  render() {

    //if (this.state.loading) {
    if (!this.state.workspaces || !this.state.records) {
      return (
        <Container>
          <Welcome user={this.state.user}/>
          <div
            className="card border-light mb-3"
            style={{
              padding: "20px",
              boxShadow: "0 10px 10px -5px",//"0px 0px 0px 0px #3D3735",
              border: "2px solid #3D3735",
              marginTop: "10px"
            }}
          >
            No records have been loaded for you yet. Check back soon.
          </div>
        </Container>
      );
    } else {
      //console.log('const workspaces: ', this.state.workspaces);
      //console.log('const workspaces: ', workspaces);
      const workspace = this.state.workspaces.map((workspace, idx) =>
      //const workspace = workspaces.map((workspace, idx) =>
        <div
          key={idx}
          className="card border-light mb-3"
          style={{
            padding: "20px",
            boxShadow: "0 10px 10px -5px",//"0px 0px 0px 0px #3D3735",
            border: "2px solid #3D3735",
            marginTop: "10px"
          }}
        >
          {/*console.log('render workspace: ', workspace)*/}
          <Workspace
            key={idx}
            records={this.state.records}
            workspaces={workspace}
            tasks={this.state.tasks}
            type={this.state.type}
            user={this.state.user}
          />
        </div>
      );

      return (
        <Container>
          <div className="cols-12">
            <Welcome user={this.state.user}/>
            {workspace}
          </div>
        </Container>
      );
    }
  }
}

export default Dashboard;

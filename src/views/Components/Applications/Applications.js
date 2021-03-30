import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MysqlLayer from '../../Utilities/MysqlLayer';
import Security from '../../Utilities/Security';
import moment from 'moment';
import { PieChart } from 'react-minimal-pie-chart';

class Applications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: null,
      approved: null,
      approvedTat: 0,
      referred: null,
      referredTat: 0,
      declined: null,
      declinedTat: 0,
      tatTarget: 2,
    };

    this.mysqlLayer = new MysqlLayer();
    this.security = new Security();
  }

  async componentDidMount() {
    const applications = await this.mysqlLayer.Get('/workspace/applications');
    await this.setState({ applications: applications });
    await this.queuePrep(applications);
  }

  queuePrep(apps) {
    let approved = [];
    let referred = [];
    let declined = [];

    apps.forEach((app) => {
      switch (app.currentStatus) {
        case 'Approved': {
          approved.push(app);
          let newTat = this.queueTat(app, this.state.approvedTat);
          if (newTat > this.state.approvedTat)
            this.setState({ approvedTat: newTat });
          break;
        }
        case 'Referred': {
          referred.push(app);
          let newTat = this.queueTat(app, this.state.referredTat);
          if (newTat > this.state.referredTat)
            this.setState({ referredTat: newTat });
          break;
        }
        case 'Declined': {
          declined.push(app);
          let newTat = this.queueTat(app, this.state.declinedTat);
          if (newTat > this.state.declinedTat)
            this.setState({ declinedTat: newTat });
          break;
        }
        default:
      }
    });

    this.setState({
      approved: approved,
      referred: referred,
      declined: declined,
    });
  }

  queueTat(app, queueTat) {
    let appClosedDate = null;
    console.log('app.closedDate before: ', app.closedDate);
    app.closedDate === null
      ? (appClosedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      : (appClosedDate = app.closedDate);
    console.log('appClosedDate after: ', appClosedDate);
    //console.log('appClosedDate: ', appClosedDate, app.closedDate);
    const tat =
      Math.abs(new Date() - new Date(app.createdDate)) / 1000 / 60 / 60;
    if (tat > queueTat) return tat;
    return queueTat;
  }

  cardTat(tat) {
    const target = this.state.tatTarget;

    if (target < tat) {
      return 'card text-white bg-danger mb-3';
    }
    if (target * 0.9 < tat) {
      return 'card text-white bg-warning mb-3';
    }
    if (target > tat) {
      return 'card text-white bg-secondary mb-3';
    }
  }

  render() {
    if (this.state.applications) {
      //const tat = (Math.abs(new Date() - new Date(this.state.applications[2].createdDate))) / 1000 / 60 / 60;
    }

    return (
      <div className="container">
        {/*<div className="row">
          <Link to="/workspace/new-application">
            <div className="card text-white bg-primary mb-3">
              <div className="card-header">Process a credit application</div>
              <div className="card-body">
                <h4 className="card-title">+ New Application</h4>
              </div>
            </div>
          </Link>
        </div>*/}

        {this.state.applications === null && <p>Loading queues...</p>}
        {this.state.applications &&
          this.state.approved &&
          this.state.referred &&
          this.state.declined && (
            <div className="row">
              <div className="col">
                <Link
                  to={{
                    pathname: '/workspace/applications/approved',
                    state: this.state.approved,
                  }}
                >
                  <PieChart
                    data={[
                      { title: 'One', value: 10, color: '#E38627' },
                      { title: 'Two', value: 15, color: '#C13C37' },
                      { title: 'Three', value: 20, color: '#6A2135' },
                    ]}
                  />
                </Link>
              </div>

              <div className="col">
                <Link
                  to={{
                    pathname: '/workspace/applications/referred',
                    state: this.state.referred,
                  }}
                >
                  <div
                    className={this.cardTat(this.state.referredTat)}
                    style={{ maxWidth: '20rem' }}
                  >
                    <div className="card-header">Referred Applications</div>
                    <div className="card-body">
                      <h4 className="card-title">
                        Total: {this.state.referred.length} <br />
                        <br />
                        Longest TAT: {Math.round(
                          this.state.referredTat
                        )} hours <br />
                        <br />
                        Avg TAT:{' '}
                        {Math.round(this.state.referredTat) /
                          this.state.referred.length}{' '}
                        hours
                      </h4>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col">
                <Link
                  to={{
                    pathname: '/workspace/applications/declined',
                    state: this.state.declined,
                  }}
                >
                  <div
                    className={this.cardTat(this.state.declinedTat)}
                    style={{ maxWidth: '20rem' }}
                  >
                    <div className="card-header">Declined Applications</div>
                    <div className="card-body">
                      <h4 className="card-title">
                        Total: {this.state.declined.length} <br />
                        <br />
                        Longest TAT: {Math.round(
                          this.state.declinedTat
                        )} hours <br />
                        <br />
                        Avg TAT:{' '}
                        {Math.round(this.state.declinedTat) /
                          this.state.declined.length}{' '}
                        hours
                      </h4>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default Applications;

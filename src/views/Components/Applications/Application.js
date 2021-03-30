import React, { Component } from 'react';
import MysqlLayer from '../../Utilities/MysqlLayer';
import moment from 'moment';

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      application: null,
      disabled: false,
      agentComments: '',
      storeComments: '',
      supervisorComments: '',
      user: 'Darryll',
      changesMade: false,
    };

    this.mysqlLayer = new MysqlLayer();
    this.handleChange = this.handleChange.bind(this);
    this.pendRecord = this.pendRecord.bind(this);
    this.approveRecord = this.approveRecord.bind(this);
    this.closeRecord = this.closeRecord.bind(this);
  }

  async componentDidMount() {
    console.log('Application.js props: ', this.props);
    const recordId = this.props.location.state.recordId;
    const type = this.props.location.state.type;
    const workrecord = this.props.location.state.workrecord;
    const workspace = this.props.location.state.workspace;

    console.log(
      `record coming from: /${type}/${workspace}/${workrecord}/${recordId}`
    );
    let record = await this.mysqlLayer.Get(
      `/${type}/${workspace}/${workrecord}/${recordId}`
    );
    await this.setState({
      recordId: recordId,
      type: type,
      workrecord: workrecord,
      workspace: workspace,
      application: record,
      agentComments: record.agentComments,
      storeComments: record.storeComments,
      supervisorComments: record.supervisorComments,
    });
    //console.log('application: ', this.state.application);
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({
      [e.target.name]: value,
      changesMade: true,
    });
  }

  async pendRecord() {
    const comments = this.state.agentComments;
    if (comments && comments.length > 10) {
      this.setState({ disabled: true });
      let oldComments = this.state.application[0].agentComments;

      let newComment =
        oldComments +
        `\n\r ${this.state.user} - ${moment(new Date()).format(
          'YYYY-MM-DD HH:mm:ss'
        )}: ${this.state.agentComments}`;
      let update = {
        agentComments: newComment,
        storeComments: this.state.storeComments,
        supervisorComments: this.state.supervisorComments,
        currentStatus: 'Pended - Store',
        updatedBy: this.state.user, // must add actual username
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };

      await this.mysqlLayer.Put(
        `/${this.state.type}/${this.state.workspace}/${this.state.workrecord}/${this.state.recordId}`,
        update
      );
      this.props.history.push({
        pathname: `/workzone/applications`,
        state: 'Referred',
      });
    } else {
      alert('Please enter a comment longer than 10 characters');
    }
  }

  async closeRecord() {
    if (this.state.changesMade) alert('The changes you made have been lost');
    console.log('state: ', this.state);
    this.props.history.push({
      pathname: `${this.state.type}/${this.state.workspace}/${this.state.workrecord}s`,
      state: 'Referred',
    });
  }

  async approveRecord() {
    return (
      <div className="modal">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const application = this.state.application;
    if (application === null) return <p>Loading...</p>;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-header">Application {application[0].id}</div>
              <div className="card-body text-left">
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputFirstName">First Name</label>
                      <input
                        disabled={true}
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={application[0].firstName || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputSurname">Surname</label>
                      <input
                        disabled={true}
                        type="text"
                        name="surname"
                        className="form-control"
                        value={application[0].surname || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputIDNumber">ID Number</label>
                      <input
                        disabled={true}
                        type="text"
                        name="idNumber"
                        className="form-control"
                        value={application[0].idNumber || ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputDOB">Date of Birth</label>
                      <input
                        disabled={true}
                        type="text"
                        name="dob"
                        className="form-control"
                        value={
                          moment(application[0].dob).format('YYYY-MM-DD') || ''
                        }
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputSex">Sex</label>
                      <input
                        disabled={true}
                        type="text"
                        name="sex"
                        className="form-control"
                        value={application[0].sex || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputNumDependents">
                        Number of Dependents
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        name="numDependents"
                        className="form-control"
                        value={application[0].numDependents || ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputMobile">Mobile</label>
                      <input
                        disabled={true}
                        type="text"
                        name="mobile"
                        className="form-control"
                        value={application[0].mobile || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail">Email address</label>
                      <input
                        disabled={true}
                        type="email"
                        name="email"
                        className="form-control"
                        value={application[0].email || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      {/* This space left blank intentionally */}
                    </div>
                  </div>
                </div>

                <br />
                <br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputAddress1">
                        Address Line 1
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        name="address1"
                        className="form-control"
                        value={application[0].address1 || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputAddress2">
                        Address Line 2
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        name="address2"
                        className="form-control"
                        value={application[0].address2 || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputAddress3">
                        Address Line 3
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        name="address3"
                        className="form-control"
                        value={application[0].address3 || ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputAddress4">
                        Address Line 4
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        name="address4"
                        className="form-control"
                        value={application[0].address4 || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputAddress5">
                        Address Line 5
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        name="address5"
                        className="form-control"
                        value={application[0].address5 || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputresidencyDuration">
                        Time at Address
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        name="residencyDuration"
                        className="form-control"
                        value={application[0].residencyDuration || ''}
                      />
                    </div>
                  </div>
                </div>

                <br />
                <br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmployer">Employer</label>
                      <input
                        disabled={true}
                        type="text"
                        name="employer"
                        className="form-control"
                        value={application[0].employer || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmploymentDuration">
                        Time at Employer
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        name="employmentDuration"
                        className="form-control"
                        value={application[0].employmentDuration || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      {/* This space left blank intentionally */}
                    </div>
                  </div>
                </div>

                <br />
                <br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputBankCode">Bank Code</label>
                      <input
                        disabled={true}
                        type="text"
                        name="bankCode"
                        className="form-control"
                        value={application[0].bankCode || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputBankAcc">Bank Account</label>
                      <input
                        disabled={true}
                        type="text"
                        name="bankAccount"
                        className="form-control"
                        value={application[0].bankAccount || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      {/* This space left blank intentionally */}
                    </div>
                  </div>
                </div>

                <br />
                <br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputGrossIncome">
                        Gross Income
                      </label>
                      <input
                        disabled={true}
                        type="number"
                        name="grossIncome"
                        className="form-control"
                        value={application[0].grossIncome || 0}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputExpenses">Expenses</label>
                      <input
                        disabled={true}
                        type="number"
                        name="expenses"
                        className="form-control"
                        value={application[0].expenses || 0}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      {/* This space left blank intentionally */}
                    </div>
                  </div>
                </div>

                <br />
                <br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputBureauScore">
                        Bureau Score
                      </label>
                      <input
                        disabled={true}
                        type="number"
                        name="bureauScore"
                        className="form-control"
                        value={application[0].bureauScore || 0}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      {/* This space left blank intentionally */}
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      {/* This space left blank intentionally */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card border-none"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card border-none"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card border-none"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card border-none"></div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-header">Vetting Comment History</div>
              <div className="card-body text-left">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="exampleInputAgentComment">
                        Vetting Agent Comments
                      </label>
                      <textarea
                        disabled={true}
                        rows="10"
                        name="agentComments"
                        className="form-control"
                        value={this.state.application[0].agentComments || ''}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-header">Vetting Comments</div>
              <div className="card-body text-left">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="exampleInputAgentComment">
                        Vetting Agent Comments
                      </label>
                      <input
                        disabled={this.state.disabled}
                        type="text"
                        name="agentComments"
                        onChange={(e) => {
                          this.handleChange(e);
                        }}
                        className="form-control"
                        placeholder="Remember to provide clear feedback to the store"
                      />
                    </div>

                    <button
                      disabled={this.state.disabled}
                      className="btn btn-primary"
                      onClick={() => {
                        this.pendRecord();
                      }}
                    >
                      Pend
                    </button>

                    <button
                      disabled={this.state.disabled}
                      className="btn btn-primary"
                      onClick={() => {
                        this.approveRecord();
                      }}
                    >
                      Approve
                    </button>

                    <button
                      disabled={this.state.disabled}
                      className="btn btn-primary"
                      onClick={() => {
                        this.closeRecord();
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Application;

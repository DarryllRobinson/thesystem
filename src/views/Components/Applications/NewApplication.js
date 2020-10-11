import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import MysqlLayer from '../../Utilities/MysqlLayer';
import Vet from './Vet';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Upload from '../../Utilities/Upload';

class NewApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      disabled: false,
      firstName: '',
      surname: '',
      idNumber: '',
      sex: '',
      mobile: '',
      email: '',
      dob: null,
      address1: '',
      address2: '',
      address3: '',
      address4: '',
      address5: '',
      employer: '',
      employmentDuration: 0.0,
      residencyDuration: 0.0,
      numDependents: 0,
      bankCode: '',
      bankAccount: '',
      grossIncome: 0,
      expenses: 0,
      bureauScore: 0,
      createdBy: '',
      createdDate: null,
      currentStatus: null,
      limit: null,
      closedBy: '',
      closedDate: null,
      changesMade: false
    }

    this.mysqlLayer = new MysqlLayer();
    this.vet = new Vet();
    this.cancelApp = this.cancelApp.bind(this);
  }

  async componentDidMount() {
    //console.log('NewApplication props: ', this.props);
    let application = {
      currentStatus: 'Open',
      createdBy: sessionStorage.getItem('cwsUser'), //"Darryll", // must add actual username
      createdDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      f_clientId: sessionStorage.getItem('cwsClient')
    };

    const setup = await this.mysqlLayer.Post('/workspace/applications', application, { withCredentials: true });
    await this.setState({ appId: setup.data.insertId });
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({
      [e.target.name]: value,
      changesMade: true
    });
  }

  async submit() {
    this.setState({ disabled: true });

    /*let xxxapplication = {
      firstName: this.state.firstName,
      surname: this.state.surname,
      idNumber: this.state.idNumber,
      sex: this.state.sex,
      mobile: this.state.mobile,
      email: this.state.email,
      dob: this.state.dob,
      address1: this.state.address1,
      address2: this.state.address2,
      address3: this.state.address3,
      address4: this.state.address4,
      address5: this.state.address5,
      employer: this.state.employer,
      employmentDuration: this.state.employmentDuration,
      residencyDuration: this.state.residencyDuration,
      numDependents: this.state.numDependents,
      bankCode: this.state.bankCode,
      bankAccount: this.state.bankAccount,
      grossIncome: this.state.grossIncome,
      expenses: this.state.expenses,
      bureauScore: this.state.bureauScore,
      createdBy: "Darryll", // must add actual username
      createdDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }*/

    let application = {
      firstName: "Peter",
      surname: "Parker",
      idNumber: "1234567890123",
      sex: 'M',//this.state.sex,
      mobile: "01234",
      email: "peter@email.com",
      dob: "1990-08-08",
      address1: "45 Buckingham Place",
      address2: "",
      address3: "",
      address4: "Durban",
      address5: "2134",
      employer: "SAB",
      employmentDuration: 2,
      residencyDuration: 2,
      numDependents: 2,//this.state.numDependents,
      bankCode: "123456",
      bankAccount: "22233344",
      grossIncome: 10000,
      expenses: 2000,
      bureauScore: 650,
      createdBy: sessionStorage.getItem('cwsUser'), //"Darryll", // must add actual username
      createdDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }

    //console.log('this.state.appId: ', this.state.appId);
    //const response = await this.mysqlLayer.Put(`/workspace/applications/application/${this.state.appId}`, application, { withCredentials: true });
    await this.mysqlLayer.Put(`/workspace/applications/application/${this.state.appId}`, application, { withCredentials: true });
    //console.log('response: ', response);
    //const appId = response.insertId;

    let cont = true;
    cont = await this.vet.Declines(application);

    if (cont) {
      this.setState({ currentStatus: 'Approved' });

      let score = await this.vet.Scorecard(application);
      if (score < 20) this.setState({ currentStatus: 'Referred' });
      console.log('score: ', score);
    }

    if (this.state.currentStatus === 'Approved') this.setState(
      {
        limit: 1000,
        closedBy: sessionStorage.getItem('cwsUser'),
        closedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      });
    if (this.state.currentStatus === 'Referred') this.setState({ limit: 750 });

    //let update = [];
    /*update.push("currentStatus": this.state.currentStatus);
    update.push("limit": this.state.limit);
    update.push("closedBy": this.state.closedBy);
    update.push("closedDate": this.state.closedDate);
    console.log('update: ', update);
    console.log('appId: ', appId);
    await this.updateAppTable(appId, update);*/

    //this.props.history.push('/workspace/applications');
  }

  creditStatus(currentStatus, limit) {
    if (currentStatus && limit) {
      toast(`Credit currentStatus ${currentStatus} -- Limit ${limit}`, {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        }
      );
    }
  }

  async updateAppTable(id, currentStatus) {
    console.log('id: ', id);
    console.log('currentStatus: ', currentStatus);
    const res = await this.mysqlLayer.Put('/workspace/applications/id', currentStatus);
    console.log('res: ', res);
  }

  async cancelApp() {
    if (this.state.changesMade) alert('The changes you made have been lost');
    this.props.history.push({
      pathname: '/dashboard',
      //state: 'Referred'
    });
  }

  render() {

    if (this.state.loading) {
      return (
        <div>Loading...</div>
      );
    } else {

      let appDocuments = [];
      appDocuments.push(
        {
          docType: 'identity',
          //formats: 'application/application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          formats: 'application/pdf',
          message: 'Proof of Identity'
        },
        {
          docType: 'residence',
          formats: 'application/pdf',
          message: 'Proof of Residence'
        },
        {
          docType: 'payslip',
          formats: 'application/pdf',
          message: 'Latest Payslip'
        }
      );


      const upload = appDocuments.map((appDocument, idx) => {
        console.log('idx: ', idx);
        return (
          <Upload
            key={idx}
            formats={appDocument.formats}
            message={appDocument.message}
            docType={appDocument.docType}
            user={sessionStorage.getItem('cwsUser')}
            client={sessionStorage.getItem('cwsClient')}
          />
        );
      });

      return (
        <div className="container">
          <div className="row">
            <div className="col-10">
              <div className="card border-primary">
                <div className="card-header">Application ID: {this.state.appId}</div>
                <div className="card-body text-left">

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputFirstName">First Name</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="firstName"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="Peter"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputSurname">Surname</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="surname"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="Parker"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputIDNumber">ID Number</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="idNumber"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="1234567890123"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputDOB">Date of birth</label>
                        <input
                          disabled={this.state.disabled}
                          type="date"
                          name="dob"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="14/06/2002"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputSex">Sex</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="sex"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputNumDependents">Number of Dependents</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="numDependents"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputMobile">Mobile</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="mobile"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="01234"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail">Email</label>
                        <input
                          disabled={this.state.disabled}
                          type="email"
                          name="email"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="peter@email.com"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        {/* This space left blank intentionally */}
                      </div>
                    </div>
                  </div>

                  <br /><br />

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputAddress1">Address Line 1</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="address1"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="Building 1"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputAddress2">Address Line 2</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="address2"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="43 Street Lane"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputAddress3">Address Line 3</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="address3"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="Suburb"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputAddress4">Address 4</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="address4"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="City"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputAddress5">Address 5</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="address5"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="2134"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputresidencyDuration">Time at Address</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="residencyDuration"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="2"
                        />
                      </div>
                    </div>
                  </div>

                  <br /><br />
                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmployer">Employer</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="employer"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="SAB"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmploymentDuration">Time at Employer</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="employmentDuration"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        {/* This space left blank intentionally */}
                      </div>
                    </div>
                  </div>

                  <br /><br />

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputBankCode">Bank Code</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="bankCode"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="123456"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputBankAcc">Bank Account</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="bankCode"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="44455566"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        {/* This space left blank intentionally */}
                      </div>
                    </div>
                  </div>

                  <br /><br />

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label className="control-label">Gross Income</label>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input
                              disabled={this.state.disabled}
                              type="text"
                              name="grossIncome"
                              onChange={(e) => {this.handleChange(e)}}
                              className="form-control"
                              aria-label="Amount (to the nearest dollar)"
                              data-np-checked="1"
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label className="control-label">Expenses</label>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input
                              disabled={this.state.disabled}
                              type="text"
                              name="expenses"
                              onChange={(e) => {this.handleChange(e)}}
                              className="form-control"
                              aria-label="Amount (to the nearest dollar)"
                              data-np-checked="1"
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="col-4">
                        <div className="form-group">
                          {/* This space left blank intentionally */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <br /><br />

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="exampleInputBureauScore">Bureau Score</label>
                        <input
                          disabled={this.state.disabled}
                          type="number"
                          name="bureauScore"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="650"
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

                  <button
                    disabled={this.state.disabled}
                    className="btn btn-primary"
                    onClick={() => {this.submit()}}>
                    Submit
                  </button>

                  <button
                    disabled={this.state.disabled}
                    className="btn btn-primary"
                    onClick={() => {this.cancelApp()}}>
                    Cancel
                  </button>

                  {this.creditStatus(this.state.currentStatus, this.state.limit)}
                  <ToastContainer />
                </div>
              </div>
            </div>
            <div className="col-2">
              {upload}

            </div>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(NewApplication);

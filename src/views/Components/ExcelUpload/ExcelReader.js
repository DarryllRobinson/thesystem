import React, { Component } from 'react';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import MysqlLayer from 'utils/MysqlLayer';
import ErrorReporting from 'utils/ErrorReporting';
import moment from 'moment';

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      progress: 0,
      accountErrors: [],
      customerErrors: [],
      contactErrors: [],
      caseErrors: [],
      outcomeErrors: [],
      errors: [],
      customerDone: false,
      accountDone: false,
      contactDone: false,
      caseDone: false,
      outcomeDone: false,
      compliance: '',
      uploaded: {
        customers: false,
        accounts: false,
        contacts: false,
        cases: false,
        outcomes: false
      },
      workspaces: [
        'customers',
        'accounts',
        'contacts',
        'cases',
        'outcomes'
      ]
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.uploadData = this.uploadData.bind(this);
    this.saveCustomerRecordsToDatabase = this.saveCustomerRecordsToDatabase.bind(this);
    this.saveAccountRecordsToDatabase = this.saveAccountRecordsToDatabase.bind(this);
    this.saveContactRecordsToDatabase = this.saveContactRecordsToDatabase.bind(this);
    this.saveCaseRecordsToDatabase = this.saveCaseRecordsToDatabase.bind(this);
    this.saveOutcomeRecordsToDatabase = this.saveOutcomeRecordsToDatabase.bind(this);

    this.mysqlLayer = new MysqlLayer();
    this.errorReporting = new ErrorReporting();
  }

  componentDidMount() {
    //console.log('ExcelReader props: ', this.props);
    //this.randmonGenerator();
    //console.log('uploaded: ', this.state.uploaded);
    this.setState({
      type: sessionStorage.getItem('cwsType')
    });
  }

  randmonGenerator() {
    const min = 1;
    const max = 100;
    const rand = Math.floor(min + Math.random() * (max - min));
    return rand;
  }

  handleChange(e) {
    this.setState({ errors: [] });
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  }

  handleFile(e) {
    /* Boilerplate to set up FileReader */
    const workspace = e.target.name;
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      // Update state and clear error messages
      this.setState({
        data: data,
        cols: make_cols(ws['!ref']),
        accountErrors: [],
        customerErrors: [],
        contactErrors: [],
        caseErrors: [],
        outcomeErrors: []
      }, async () => {
        //console.log(JSON.stringify(this.state.data, null, 2));
        //console.log('data: ', data);
        try {
          //this.uploadData(this.state.data);
          //console.log('data loaded: ', data);
          let cont = await this.checkData(workspace, this.state.data);
          //console.log('cont: ', cont);
          if (cont) this.uploadData(workspace, this.state.data);
        } catch(e) {
          console.log('Uploading Collection update file problem (e): ', e);
          this.errorReporting.sendMessage(
            {
              error: `handleFile error: ${e}`,
              fileName: 'ExcelReader.js',
              dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              user: sessionStorage.getItem('cwsUser'),
              state: JSON.stringify(this.state)
            }
          );
        }
      });

    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };
  }

  checkData(workspace, records) {
    this.setState({ compliance: `${records.length} ${workspace} records processed for compliance` });
    let errors = [];

    switch (workspace) {
      case 'customers':
        records.forEach((record, idx) => {
          if (record.CustomerNumber === undefined) errors.push(`Record id: ${idx + 1} CustomerNumber is missing`);
          if (record.Customer === undefined) errors.push(`Record id: ${idx + 1} Customer is missing`);
        });
        break;
      case 'accounts':
        records.forEach((record, idx) => {
          if (record.AccountNumber === undefined) errors.push(`Record id: ${idx + 1} AccountNumber is missing`);
          if (record.AccountStatus === undefined) errors.push(`Record id: ${idx + 1} AccountStatus is missing`);
          if (record.CustomerRefNo === undefined) errors.push(`Record id: ${idx + 1} CustomerRefNo is missing`);
          //if (record.DateCreated === undefined) errors.push(`Record id: ${idx + 1} DateCreated is missing`);
          if (!moment(record.DateCreated).isValid()) errors.push(`Record id: ${idx + 1} DateCreated is incorrectly formatted`);
        });
        break;
      case 'contacts':
        records.forEach((record, idx) => {
          if (record.AccountNumber === undefined) errors.push(`Record id: ${idx + 1} AccountNumber is missing`);
        });
        break;
      case 'cases':
        records.forEach((record, idx) => {
          if (record.AccountNumber === undefined) errors.push(`Record id: ${idx + 1} AccountNumber is missing`);
          if (record.CurrentAssignment === undefined) errors.push(`Record id: ${idx + 1} CurrentAssignment is missing`);
          if (record.CurrentStatus === undefined) errors.push(`Record id: ${idx + 1} CurrentStatus is missing`);
        });
        break;
      case 'outcomes':
        records.forEach((record, idx) => {
          if (record.CaseNumber === undefined) errors.push(`Record id: ${idx + 1} CaseNumber is missing`);
        });
        break;
      default:
      errors.push(`No workspace identified for ${workspace}`);
    }

    this.setState({ errors: errors });
    if (errors.length > 0) return false;
    return true;
  }

  uploadData(workspace, data) {
    let count = 0;
    //console.log('data: ', data);
    data.forEach(async datum => {
      switch (workspace) {
        case 'customers':
          await this.saveCustomerRecordsToDatabase(datum);
          break;
        case 'accounts':
          await this.saveAccountRecordsToDatabase(datum);
          break;
        case 'contacts':
          await this.saveContactRecordsToDatabase(datum);
          break;
        case 'cases':
          await this.saveCaseRecordsToDatabase(datum);
          break;
        case 'outcomes':
          await this.saveOutcomeRecordsToDatabase(datum);
          break;
        default:
          ;;
          break;
      }
      count++;

      let chance = this.randmonGenerator();
      let message = ``;
      if (chance > 100) {
        message = `${count} files have been successfully uploaded to the ${workspace} table. You should feel good about yourself.`;
      } else {
        message = `${count} files have been successfully uploaded to the ${workspace} table.`;
      }
      this.setState({ compliance: message });
    });
  }

  async saveCustomerRecordsToDatabase(record) {
    //console.log('record: ', record);
    let customer = null;
    if (record.CustomerEntity === 'Enterprise') {
      customer = [
        {
          operatorShortCode: record.OperatorShortCode,
          customerRefNo: record.CustomerNumber,
          customerName: record.Customer,
          customerEntity: record.CustomerEntity,
          regIdNumber: record.CompanyRegNo,
          customerType: record.Customer_Type,
          productType: record.ProductType,
          createdBy: 'System',
          regIdStatus: record.CIPCStatus,
          f_clientId: sessionStorage.getItem('cwsClient')
        }
      ];
    } else if (record.CustomerEntity === 'Consumer') {
      customer = [
        {
          operatorShortCode: record.OperatorShortCode,
          customerRefNo: record.CustomerNumber,
          customerName: record.Customer,
          customerEntity: record.CustomerEntity,
          regIdNumber: record.ConsumerIDNumber,
          customerType: record.Customer_Type,
          productType: record.ProductType,
          createdBy: 'System',
          regIdStatus: record.IDVStatus,
          f_clientId: sessionStorage.getItem('cwsClient')
        }
      ];
    }

    const response = await this.postToDb(customer, 'customers');
    //console.log('saveCustomerRecordsToDatabase response: ', response);
    if (response.data.errno) {
      let error =[];
      error = this.state.customerErrors;
      error.push(response.data);
      this.setState({ customerErrors: error });
    }

    this.setState({ uploaded: { customers: true }});
    return response.data.insertId;
  }

  async saveAccountRecordsToDatabase(record) {
    const paymentDueDate = record.paymentDueDate ?
      moment(this.ExcelDateToJSDate(record.paymentDueDate)).format('YYYY-MM-DD') :
      null;

    const debitOrderDate = record.debitOrderDate ?
      moment(this.ExcelDateToJSDate(record.debitOrderDate)).format('YYYY-MM-DD') :
      null;

    const lastPaymentDate = record.lastPaymentDate ?
      moment(this.ExcelDateToJSDate(record.lastPaymentDate)).format('YYYY-MM-DD') :
      null;

    const lastPTPDate = record.lastPTPDate ?
      moment(this.ExcelDateToJSDate(record.lastPTPDate)).format('YYYY-MM-DD') :
      null;

    const openDate = record.DateCreated ?
      moment(this.ExcelDateToJSDate(record.DateCreated)).format('YYYY-MM-DD') :
      null;

    let account = [
      {
        accountNumber: record.AccountNumber,
        accountName: record.AccountName,
        createdBy: 'System',
        //createdDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        openDate: openDate,
        debtorAge: record.DebtorAge,
        creditLimit: record.CreditLimit,
        currentBalance: record.CurrentBalance,
        days30: record.days30,
        days60: record.days60,
        days90: record.days90,
        days120: record.days120,
        days150: record.days150,
        days180: record.days180,
        days180Over: record.days180Over,
        f_customerId: record.AccountNumber,
        lastPTPDate: lastPTPDate,
        paymentDueDate: paymentDueDate,
        debitOrderDate: debitOrderDate,
        lastPaymentDate: lastPaymentDate,
        paymentMethod: record.PaymentMethod,
        paymentTermDays: record.PaymentTerms,
        totalBalance: record.TotalBalance
      }
    ];
    /*let accounts = [];
    records.forEach(record => {
      accounts.push({
        accountRef: record.accountRef,
        amountDue: record.amountDue,
        createdBy: record.createdBy,
        //createdDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        creditLimit: record.creditLimit,
        currentBalance: record.currentBalance,
        days30: record.days30,
        days60: record.days60,
        days90: record.days90,
        days120: record.days120,
        f_customerId: insertId,
        lastPTPDate: moment(record.lastPTPDate).format('YYYY-MM-DD'),
        paymentMethod: record.paymentMethod,
        paymentTermDays: record.paymentTermDays,
        totalBalance: record.totalBalance
      });
    });*/

    //console.log('Number of records in [accounts]: ', accounts.length);

    //accounts.forEach(async account => {
      let response = await this.postToDb(account, 'accounts');
      //console.log('saveAccountRecordsToDatabase response: ', response);
      if (response.data.errno) {
        let error =[];
        error = this.state.accountErrors;
        error.push(response.data);
        this.setState({ accountErrors: error });
      }
      this.setState({ uploaded: { accounts: true }});
    //});

    /*const response = await this.postToDb(accounts, 'accounts');
    console.log('saveAccountRecordsToDatabase response: ', response);
    return response;*/
  }

  async saveCaseRecordsToDatabase(record) {

    const createdDate = record.DateCreated ?
      moment(this.ExcelDateToJSDate(record.DateCreated)).format('YYYY-MM-DD HH:mm:ss') :
      null;

    const nextVisitDateTime = record.nextVisitDateTime ?
      moment(this.ExcelDateToJSDate(record.nextVisitDateTime)).format('YYYY-MM-DD HH:mm:ss') :
      null;

    const updatedDate = record.DateLastUpdated ?
      moment(this.ExcelDateToJSDate(record.DateLastUpdated)).format('YYYY-MM-DD HH:mm:ss') :
      null;
      //console.log('updatedDate: ', updatedDate);

    const reopenedDate = record.DateReopened ?
      moment(this.ExcelDateToJSDate(record.DateReopened)).format('YYYY-MM-DD HH:mm:ss') :
      null;
      //console.log('reopenedDate: ', reopenedDate);

    let caseUpdate = [
      {
        caseNumber: record.CaseNumber,
        f_accountNumber: record.AccountNumber,
        createdDate: createdDate,
        createdBy: record.CreatedBy,
        currentAssignment: record.CurrentAssignment,
        nextVisitDateTime: nextVisitDateTime,
        updatedDate: updatedDate,
        updatedBy: record.LastUpdatedBy,
        reopenedDate: reopenedDate,
        reopenedBy: record.ReopenedBy,
        caseReason: record.CaseReason,
        currentStatus: record.CurrentStatus,
        caseNotes: record.CaseNotes
      }
    ];

    let response = await this.postToDb(caseUpdate, 'cases');
      //console.log('saveCaseRecordsToDatabase response: ', response);
      if (response.data.errno) {
        let error =[];
        error = this.state.caseErrors;
        error.push(response.data);
        this.setState({ caseErrors: error });
      }
      this.setState({ uploaded: { cases: true }});
    //});

    /*const response = await this.postToDb(accounts, 'accounts');
    console.log('saveAccountRecordsToDatabase response: ', response);
    return response;*/
  }

  async saveOutcomeRecordsToDatabase(record) {

    const createdDate = record.DateCreated ? record.DateCreated : null;

    /*const nextVisitDateTime = record.NextVisitDate ?
      (record.NextVisitDate + ' ' + record.NextVisitTime) :
      null;

      console.log('record.NextVisitDate: ', record.NextVisitDate);
      console.log('record.NextVisitDate: ', moment(record.NextVisitDate).format('YYYY-MM-DD'));
      console.log('record.NextVisitDate: ', moment(record.NextVisitDate).format('DD-MM-YYYY'));
      console.log('record.NextVisitTime: ', moment(record.NextVisitTime).format('HH:mm:ss'));
      const newDate = this.ExcelDateToJSDate(record.NextVisitDate);
      console.log('newDate: ', moment(newDate).format('YYYY-MM-DD'));*/

    /*const nextVisitDate = record.NextVisitDate ?
      moment(this.ExcelDateToJSDate(record.NextVisitDate)).format('YYYY-MM-DD') :
      null;

    const nextVisitTime = record.NextVisitTime ?
      moment(record.NextVisitTime).format('YYYY-MM-DD HH:mm:ss') :
      null;*/

    const ptpDate = record.PTPDate ?
      moment(this.ExcelDateToJSDate(record.PTPDate)).format('YYYY-MM-DD HH:mm:ss') :
      null;

    const debitResubmissionDate = record.DebtOrderDate ?
      moment(this.ExcelDateToJSDate(record.DebtOrderDate)).format('YYYY-MM-DD HH:mm:ss') :
      null;


    let outcome = [
      {
        f_caseId: record.CaseNumber,
        createdDate: createdDate,
        createdBy: record.CreatedBy,
        outcomeStatus: record.Status,
        transactionType: record.TransactionType,
        numberCalled: record.PhoneNumberCalled,
        EmailAddressUsed: record.emailUsed,
        contactPerson: record.ContactPerson,
        outcomeResolution: record.Resolution,
        nextSteps: record.NextSteps,
        ptpDate: ptpDate,
        ptpAmount: record.PTPAmount,
        debitResubmissionDate: debitResubmissionDate,
        debitResubmissionAmount: record.DebitOrderAmount,
        outcomeNotes: record.OutcomeNotes
      }
    ];

    let response = await this.postToDb(outcome, 'outcomes');
      //console.log('saveOutcomeRecordsToDatabase response: ', response);
      if (response.data.errno) {
        let error =[];
        error = this.state.outcomeErrors;
        error.push(response.data);
        this.setState({ outcomeErrors: error });
      }
      this.setState({ uploaded: { outcomes: true }});
    //});

    /*const response = await this.postToDb(accounts, 'accounts');
    console.log('saveAccountRecordsToDatabase response: ', response);
    return response;*/
  }

  async saveContactRecordsToDatabase(record) {
    let contact = [
      {
        f_accountNumber: record.AccountNumber,
        primaryContactName: record.PrimaryContactName,
        primaryContactNumber: record.PrimaryContactNumber,
        primaryContactEmail: record.PrimaryEmailAddress,
        representativeName: record.RepresentativeName,
        representativeNumber: record.RepresentativeContactNumber,
        representativeEmail: record.RepresentativeEmailAddress,
        alternativeRepName: record.AltRepName,
        alternativeRepNumber: record.AltRepContact,
        alternativeRepEmail: record.AltRepEmail,
        otherNumber1: record.OtherContact1,
        otherNumber2: record.OtherContact2,
        otherNumber3: record.OtherContact3,
        otherNumber4: record.OtherContact4,
        otherNumber5: record.OtherContact5,
        otherEmail1: record.OtherEmail1,
        otherEmail2: record.OtherEmail2,
        otherEmail3: record.OtherEmail3,
        otherEmail4: record.OtherEmail4,
        otherEmail5: record.OtherEmail5,
        dnc1: record.DNC1,
        dnc2: record.DNC2,
        dnc3: record.DNC3,
        dnc4: record.DNC4,
        dnc5: record.DNC5
      }
    ];

    let response = await this.postToDb(contact, 'contacts');
      //console.log('saveContactRecordsToDatabase response: ', response);
      if (response.data.errno) {
        let error =[];
        error = this.state.contactErrors;
        error.push(response.data);
        this.setState({ contactErrors: error });
      }
      this.setState({ uploaded: { contacts: true }});
    //});

    /*const response = await this.postToDb(accounts, 'accounts');
    console.log('saveAccountRecordsToDatabase response: ', response);
    return response;*/
  }

  ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569)*86400*1000));
  }

  async postToDb(records, workspace) {
    let type = this.state.type;
    //let workspace = workspace;
    let task = 'create_items';
    let clientId = sessionStorage.getItem('cwsClient');

    const response = await this.mysqlLayer.Post(`/${type}/${workspace}/${task}/${clientId}`, records);
    //console.log('postToDb response: ', response);
    return response;
  }

  checkToDisplay(workspace) {
    let display = false;
    for (const [key, value] of Object.entries(this.state.uploaded)) {
      if (key === workspace) display = value;
      //console.log(`${key}: ${value}`);
    }
    return display;
  }

  render() {

    const customerErrors = this.state.customerErrors.map((err, idx) =>
      <p key={idx}>Customer error: {err.sqlMessage}</p>
    );

    const accountErrors = this.state.accountErrors.map((err, idx) =>
      <p key={idx}>Account error: {err.sqlMessage}</p>
    );

    const contactErrors = this.state.contactErrors.map((err, idx) =>
      <p key={idx}>Contact error: {err}</p>
    );

    const caseErrors = this.state.caseErrors.map((err, idx) =>
      <p key={idx}>Case error: {err.sqlMessage}</p>
    );

    const outcomeErrors = this.state.outcomeErrors.map((err, idx) =>
      <p key={idx}>Outcome error: {err.sqlMessage}</p>
    );

    const recordErrors = this.state.errors.map((err, idx) =>
      <p key={idx}>Upload error: {err}</p>
    );

    const filesToUpload = this.state.workspaces.map((workspace, idx) =>
      <div key={idx} className="container">
        <div className="row">
          <div className="col-8">
            <label htmlFor="file">Import new {workspace}</label>
            <br />
            <input
              type="file"
              id="file"
              accept={SheetJSFT}
              onChange={this.handleChange}
            />
            {!this.checkToDisplay(workspace) && <input
              type='submit'
              name={workspace}
              value="Upload file"
              onClick={this.handleFile}
            />}
            <br /><br />
          </div>
        </div>
      </div>
    );

    return (
      <div className="container">
        <div className="row">
          <div className="col-8">
            {filesToUpload}

          </div>
          <div className="col-4">
            <p style={{"fontWeight": "bold"}}>{this.state.compliance}</p>
            {customerErrors}
            {accountErrors}
            {recordErrors}
            {caseErrors}
            {outcomeErrors}
            {contactErrors}
          </div>
        </div>
      </div>

    )
  }
}

export default ExcelReader;

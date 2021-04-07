import React, { Component } from 'react';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import LinearProgress from 'components/CustomLinearProgress/CustomLinearProgress';
import MysqlLayer from 'utils/MysqlLayer';
import ErrorReporting from 'utils/ErrorReporting';
import moment from 'moment';
import image from '../../../assets/img/green-tick.jpeg';

//const workspaces = ['customers', 'accounts', 'contacts', 'cases', 'outcomes'];

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      type: sessionStorage.getItem('cwsType'),
      workspaces: {
        ids: ['customers', 'accounts', 'contacts', 'cases', 'outcomes'],
        entities: {
          customers: {
            errors: [],
            loading: false,
            numberRecords: 0,
            checked: false,
            progress: 0,
          },
          accounts: {
            errors: [],
            loading: false,
            numberRecords: 0,
            checked: false,
            progress: 0,
          },
          contacts: {
            errors: [],
            loading: false,
            numberRecords: 0,
            checked: false,
            progress: 0,
          },
          cases: {
            errors: [],
            loading: false,
            numberRecords: 0,
            checked: false,
            progress: 0,
          },
          outcomes: {
            errors: [],
            loading: false,
            numberRecords: 0,
            checked: false,
            progress: 0,
          },
        },
      },
    };

    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.mysqlLayer = new MysqlLayer();
    this.errorReporting = new ErrorReporting();
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  }

  handleFile(e) {
    /* Boilerplate to set up FileReader */
    const workspace = e.target.name;
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      // Parse data
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? 'binary' : 'array',
        bookVBA: true,
      });

      // Get first worksheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      // Convert array of arrays
      const data = XLSX.utils.sheet_to_json(ws);

      let workspaceObject = this.state.workspaces.entities[workspace];
      workspaceObject.numberRecords = data.length;

      this.setState(
        {
          data: data,
          cols: make_cols(ws['!ref']),
          ...this.state,
          workspaceObject,
        },
        async () => {
          try {
            if (this.checkData(workspace, data)) {
              workspaceObject.checked = true;
              this.setState({ ...this.state, workspaceObject });
              this.uploadData(workspace, data);
            }
          } catch (e) {
            console.log('Uploading Collection update file problem (e): ', e);
            this.errorReporting.sendMessage({
              error: `handleFile error: ${e}`,
              fileName: 'ExcelReader.js',
              dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              user: sessionStorage.getItem('cwsUser'),
              state: JSON.stringify(this.state),
            });
          }
        }
      );
    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    }
  }

  checkData(workspace, records) {
    let workspaceObject = this.state.workspaces.entities[workspace];
    let errors = [];

    switch (workspace) {
      case 'customers':
        records.forEach((record, idx) => {
          if (record.CustomerNumber === undefined)
            errors.push(`Record id: ${idx + 1} CustomerNumber is missing`);
          if (record.Customer === undefined)
            errors.push(`Record id: ${idx + 1} Customer is missing`);
        });
        break;
      case 'accounts':
        records.forEach((record, idx) => {
          if (record.AccountNumber === undefined)
            errors.push(`Record id: ${idx + 1} AccountNumber is missing`);
          if (record.AccountStatus === undefined)
            errors.push(`Record id: ${idx + 1} AccountStatus is missing`);
          if (record.CustomerRefNo === undefined)
            errors.push(`Record id: ${idx + 1} CustomerRefNo is missing`);
          //if (record.DateCreated === undefined) errors.push(`Record id: ${idx + 1} DateCreated is missing`);
          if (!moment(record.DateCreated).isValid())
            errors.push(
              `Record id: ${idx + 1} DateCreated is incorrectly formatted`
            );
        });
        break;
      case 'contacts':
        records.forEach((record, idx) => {
          if (record.AccountNumber === undefined)
            errors.push(`Record id: ${idx + 1} AccountNumber is missing`);
        });
        break;
      case 'cases':
        records.forEach((record, idx) => {
          if (record.AccountNumber === undefined)
            errors.push(`Record id: ${idx + 1} AccountNumber is missing`);
          if (record.CurrentAssignment === undefined)
            errors.push(`Record id: ${idx + 1} CurrentAssignment is missing`);
          if (record.CurrentStatus === undefined)
            errors.push(`Record id: ${idx + 1} CurrentStatus is missing`);
        });
        break;
      case 'outcomes':
        records.forEach((record, idx) => {
          if (record.CaseNumber === undefined)
            errors.push(`Record id: ${idx + 1} CaseNumber is missing`);
        });
        break;
      default:
        errors.push(`No workspace identified for ${workspace}`);
    }

    workspaceObject.errors = errors;
    this.setState({ ...this.state, workspaceObject });
    if (errors.length > 0) return false;
    return true;
  }

  chunkData(data) {
    //console.log('chunkData', data);
    const maxRowsThatCanBeInserted = 400;
    const chunks =
      data.length % maxRowsThatCanBeInserted === 0
        ? Math.floor(data.length / maxRowsThatCanBeInserted)
        : Math.floor(data.length / maxRowsThatCanBeInserted) + 1;
    let chunkedData = [];
    for (let i = 0; i < chunks; i++) {
      let first = i * maxRowsThatCanBeInserted;
      let second = first + maxRowsThatCanBeInserted;
      let records = data.slice(first, second);
      chunkedData.push(records);
    }
    this.setState({ chunkedData: chunkedData });
    //console.log('chunkedData:', chunkedData);
    return chunkedData;
  }

  async uploadData(workspace, data) {
    let workspaceObject = this.state.workspaces.entities[workspace];
    workspaceObject.loading = true;
    workspaceObject.progress = 0;
    this.setState({ ...this.state, workspaceObject });
    let totalRecords = 0;
    let preppedData;
    let chunkedData;

    switch (workspace) {
      case 'customers':
        preppedData = this.prepCustomerRecords(data);
        break;
      case 'accounts':
        preppedData = this.prepAccountRecords(data);
        break;
      case 'contacts':
        preppedData = this.prepContactRecords(data);
        break;
      case 'cases':
        preppedData = this.prepCaseRecords(data);
        break;
      case 'outcomes':
        preppedData = this.prepOutcomeRecords(data);
        break;
      default:
        break;
    }

    chunkedData = this.chunkData(preppedData);

    // Single post function makes more sense
    for (let i = 0; i < chunkedData.length; i++) {
      const response = await this.postToDb(chunkedData[i], workspace).then(
        this.setState({
          progress: Math.round(((i + 1) / chunkedData.length) * 100),
        })
      );
      if (response.data.errno) {
        let error = [];
        error = this.state.customerErrors;
        error.push(response.data);
        this.setState({ customerErrors: error });
      }

      totalRecords = totalRecords + response.data.affectedRows;
    }

    workspaceObject.loading = false;
    workspaceObject.progress = 100;
    this.setState({ ...this.state, workspaceObject });
    return totalRecords;
  }

  prepCustomerRecords(records) {
    let customers = [];

    records.forEach((record) => {
      let customer = [];
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
            f_clientId: sessionStorage.getItem('cwsClient'),
          },
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
            f_clientId: sessionStorage.getItem('cwsClient'),
          },
        ];
      }
      customers.push(customer);
    });

    return customers;
  }

  prepAccountRecords(records) {
    let accounts = [];

    records.forEach((record) => {
      const paymentDueDate = record.paymentDueDate
        ? moment(this.ExcelDateToJSDate(record.paymentDueDate)).format(
            'YYYY-MM-DD'
          )
        : null;

      const debitOrderDate = record.debitOrderDate
        ? moment(this.ExcelDateToJSDate(record.debitOrderDate)).format(
            'YYYY-MM-DD'
          )
        : null;

      const lastPaymentDate = record.lastPaymentDate
        ? moment(this.ExcelDateToJSDate(record.lastPaymentDate)).format(
            'YYYY-MM-DD'
          )
        : null;

      const lastPTPDate = record.lastPTPDate
        ? moment(this.ExcelDateToJSDate(record.lastPTPDate)).format(
            'YYYY-MM-DD'
          )
        : null;

      const openDate = record.DateCreated
        ? moment(this.ExcelDateToJSDate(record.DateCreated)).format(
            'YYYY-MM-DD'
          )
        : null;

      let account = [
        {
          accountNumber: record.AccountNumber,
          accountName: record.AccountName,
          createdBy: 'System',
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
          totalBalance: record.TotalBalance,
        },
      ];
      accounts.push(account);
    });
    return accounts;
  }

  prepCaseRecords(records) {
    let cases = [];

    records.forEach((record) => {
      const createdDate = record.DateCreated
        ? moment(this.ExcelDateToJSDate(record.DateCreated)).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        : null;

      const nextVisitDateTime = record.nextVisitDateTime
        ? moment(this.ExcelDateToJSDate(record.nextVisitDateTime)).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        : null;

      const updatedDate = record.DateLastUpdated
        ? moment(this.ExcelDateToJSDate(record.DateLastUpdated)).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        : null;

      const reopenedDate = record.DateReopened
        ? moment(this.ExcelDateToJSDate(record.DateReopened)).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        : null;

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
          caseNotes: record.CaseNotes,
        },
      ];
      cases.push(caseUpdate);
    });
    return cases;
  }

  prepOutcomeRecords(records) {
    let outcomes = [];

    records.forEach((record) => {
      const createdDate = record.DateCreated ? record.DateCreated : null;

      const ptpDate = record.PTPDate
        ? moment(this.ExcelDateToJSDate(record.PTPDate)).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        : null;

      const debitResubmissionDate = record.DebtOrderDate
        ? moment(this.ExcelDateToJSDate(record.DebtOrderDate)).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        : null;

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
          outcomeNotes: record.OutcomeNotes,
        },
      ];
      outcomes.push(outcome);
    });

    return outcomes;
  }

  prepContactRecords(records) {
    let contacts = [];

    records.forEach((record) => {
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
          dnc5: record.DNC5,
        },
      ];
      contacts.push(contact);
    });
    return contacts;
  }

  ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }

  async postToDb(records, workspace) {
    let type = this.state.type;
    let task = 'create_items';
    let clientId = sessionStorage.getItem('cwsClient');

    const response = await this.mysqlLayer.Post(
      `/${type}/${workspace}/${task}/${clientId}`,
      records
    );
    return response;
  }

  render() {
    const { progress, workspaces } = this.state;

    const workspaceDisplay = workspaces.ids.map((workspace, idx) => (
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
              style={{ width: '400px' }}
            />
            {workspaces.entities[workspace].progress === 0 && (
              <input
                type="submit"
                name={workspace}
                value="Upload file"
                onClick={this.handleFile}
              />
            )}

            {workspaces.entities[workspace].loading && (
              <>
                <br />
                <br />
                <LinearProgress variant="determinate" value={progress} />
              </>
            )}
            {workspaces.entities[workspace].progress === 100 && (
              <img src={image} alt="Green tick" width="55" height="45" />
            )}
          </div>
        </div>
        <br />
        <br />
      </div>
    ));

    return <div className="container">{workspaceDisplay}</div>;
  }
}

export default ExcelReader;

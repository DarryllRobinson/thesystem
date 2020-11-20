import moment from 'moment';

export default class Upload {

  uploadData(workspace, data) {
    let count = 0;
    console.log('data: ', data);
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
    console.log('record: ', record);
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

    const response = await this.xpostToDb(customer, 'customers');
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
}

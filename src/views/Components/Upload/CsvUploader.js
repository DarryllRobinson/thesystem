import React, { useEffect, useState } from 'react';
import MysqlLayer from 'utils/MysqlLayer';
//import FetchData from 'utils/useFetch';
import moment from 'moment';

// push file into state
// extract existing customerRefNos from database
// process each record by:
  // checking if customerRefNo exists
  // if so, reject and display reason
  // if not, upload to database and display success/update progress bar


export default function CsvUploader() {
  const clientId = sessionStorage.getItem('cwsClient');
  const [file, setFile] = useState(null);
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const mysqlLayer = new MysqlLayer();
      const result = await mysqlLayer.Get(`/business/collections/list_all_customers/${clientId}`);
      if (!ignore) {
        setCustomers(result);
        //console.log('result: ', result);
        //console.log('customers: ', customers);
      }
    }

    fetchData();
    return () => { ignore = true; }
  }, [clientId]);

  return (
    <div>
      <h3>Import CSV</h3>
      <input
        type="file"
        onChange={event => setFile(event.target.files[0])}
        accept=".csv"
      />
      <button onClick={() => { UploadFile(file, customers) }}>Upload</button>
      <br /><br />
      {/*<UpdateRecordsLoaded />*/}
    </div>
  )
}

function UploadFile(file, customers) {
  if (!file) {
    console.log('no file: ', file);
    return
  }

  let fileReader = new FileReader();
  fileReader.readAsText(file);

  fileReader.onload = async function() {
    const dataset = fileReader.result;
    let lines = dataset.split('\r\n');
    let result = [];
    let headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentline = lines[i].split(",");
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = currentline[j];
      }

      if (obj.account_number) {
        if (checkUnique(obj.account_number, customers)) {
          result.push(obj);
          const uploadMsg = await UploadData(result[0]);
          //console.log('uploadMsg: ', uploadMsg);
          if (uploadMsg === 'problem') console.log('problem uploading record');
        }
      }
    }
    //console.log('result: ', result[0]);

  };
}

function checkUnique(accNum, customers) {
  const found = customers.find(customer => customer === accNum);
  return !found;
}

function UpdateRecordsLoaded() {
  const [recordCount, setRecordCount] = useState(0);

  useEffect(() => {
    setRecordCount(recordCount + 1);

  }, [recordCount])
  return (
    <div>{recordCount} records have been uploaded</div>

  )
}

async function UploadData(record) {
  const user = sessionStorage.getItem('cwsUser');
  //const [customerErrors, setCustomerErrors] = useState(null);

  let customer = null;
  customer = [
    {
      operatorShortCode: record.account_number,
      customerRefNo: record.account_number,
      customerName: record.customer_name,
      customerEntity: 'Consumer',
      regIdNumber: record.id_number,
      //createdBy: `System Upload - ${user}`,
      createdBy: user,
      f_clientId: sessionStorage.getItem('cwsClient')
    }
  ];
  //console.log('customer: ', customer);

  const response = await PostToDb(customer, 'customers');

  if (response.data.errno) {
    //console.log('problem');
    return 'problem';
  }
  console.log('response: ', response);

  const accResponse = await saveAccountRecordsToDatabase(user, record);

  if (accResponse.data.errno) {
    //console.log('problem');
    return 'accResponse problem';
  }
  console.log('accResponse: ', accResponse);

  const contResponse = await saveContactRecordsToDatabase(record);
  const caseResponse = await saveCaseRecordsToDatabase(user, record);


/*  if (response.data.errno) {
    let error =[];
    error = customerErrors;
    error.push(response.data);
    setCustomerErrors(error);
  }
*/
  //this.setState({ uploaded: { customers: true }});
  return response.data.insertId;
}

async function saveAccountRecordsToDatabase(user, record) {
  const paymentDueDate = null;

  const debitOrderDate = record.debit_order_date; /*?
    moment(xlSerialToJsDate(record.debit_order_date)).format('YYYY-MM-DD HH:mm:ss') :
    null;
    console.log('record.debit_order_date: ', record.debit_order_date);
  console.log('typeof record.debit_order_date: ', typeof record.debit_order_date);
  console.log('debitOrderDate: ', debitOrderDate);*/

  const lastPaymentDate = null;

  const lastPTPDate = null;

  const openDate = null;

  let account = [
    {
      accountNumber: record.account_number,
      accountName: record.customer_name,
      //createdBy: `System Upload - ${user}`,
      createdBy: user,
      //createdDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      openDate: openDate,
      debtorAge: record.age,
      //creditLimit: record.CreditLimit,
      currentBalance: record.current_value,
      days30: record.Value_30_days,
      days60: record.Value_60_days,
      days90: record.Value_90_days,
      days120: record.Value_120_days,
      //days150: record.days150,
      //days180: record.days180,
      //days180Over: record.days180Over,
      f_customerId: record.account_number,
      lastPTPDate: lastPTPDate,
      paymentDueDate: paymentDueDate,
      debitOrderDate: debitOrderDate,
      lastPaymentDate: lastPaymentDate,
      //paymentMethod: record.PaymentMethod,
      //paymentTermDays: record.PaymentTerms,
      totalBalance: record.balance
    }
  ];

  let response = await PostToDb(account, 'accounts');
  console.log('saveAccountRecordsToDatabase response: ', response);
  return response;
}

async function saveContactRecordsToDatabase(record) {
  let contact = [
    {
      f_accountNumber: record.account_number,
      //primaryContactName: record.PrimaryContactName,
      primaryContactNumber: record.telephone1,
      //primaryContactEmail: record.PrimaryEmailAddress,
      //representativeName: record.RepresentativeName,
      //representativeNumber: record.RepresentativeContactNumber,
      //representativeEmail: record.RepresentativeEmailAddress,
      //alternativeRepName: record.AltRepName,
      //alternativeRepNumber: record.AltRepContact,
      //alternativeRepEmail: record.AltRepEmail,
      otherNumber1: record.telephone2,
      otherNumber2: record.telephone3,
      otherNumber3: record.telephone4,
      otherNumber4: record.telephone5,
      otherNumber5: record.telephone6,
      otherNumber6: record.telephone7,
      otherNumber7: record.telephone8,
      otherNumber8: record.telephone9,
      otherNumber9: record.telephone10,
      //otherEmail1: record.OtherEmail1,
      //otherEmail2: record.OtherEmail2,
      //otherEmail3: record.OtherEmail3,
      //otherEmail4: record.OtherEmail4,
      //otherEmail5: record.OtherEmail5,
      //dnc1: record.DNC1,
      //dnc2: record.DNC2,
      //dnc3: record.DNC3,
      //dnc4: record.DNC4,
      //dnc5: record.DNC5
    }
  ];

  let response = await PostToDb(contact, 'contacts');
  console.log('saveContactRecordsToDatabase response: ', response);

  return response;
}

async function saveCaseRecordsToDatabase(user, record) {

  /*const createdDate = record.DateCreated ?
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
    //console.log('reopenedDate: ', reopenedDate);*/

  let caseUpdate = [
    {
      //caseNumber: record.CaseNumber,
      f_accountNumber: record.account_number,
      //createdDate: createdDate,
      createdBy: user,
      currentAssignment: record.agentname,
      //nextVisitDateTime: nextVisitDateTime,
      //updatedDate: updatedDate,
      //updatedBy: record.LastUpdatedBy,
      //reopenedDate: reopenedDate,
      //reopenedBy: record.ReopenedBy,
      //caseReason: record.CaseReason,
      //currentStatus: record.CurrentStatus,
      caseNotes: record.dialler_comments
    }
  ];

  let response = await PostToDb(caseUpdate, 'cases');
  console.log('saveCaseRecordsToDatabase response: ', response);

  return response;
}

async function PostToDb(records, workspace) {
  const mysqlLayer = new MysqlLayer();
  let type = 'business';
  //let workspace = workspace;
  let task = 'create_items';
  let clientId = sessionStorage.getItem('cwsClient');

  const response = await mysqlLayer.Post(`/${type}/${workspace}/${task}/${clientId}`, records);
  //console.log('postToDb response: ', response);
  return response;
}

function ExcelDateToJSDate(date) {
  console.log('date before: ', date);
  console.log('date: ', new Date(Math.round((date - 25569)*86400*1000)));
  return new Date(Math.round((date - 25569)*86400*1000));
}

function SerialDateToJSDate(serialDate, offsetUTC) {
  return new Date(Date.UTC(0, 0, serialDate, offsetUTC));
}

function xlSerialToJsDate(xlSerial){
  return new Date(-2209075200000 + (xlSerial - (xlSerial < 61 ? 0 : 1)) * 86400000);
}

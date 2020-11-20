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
      createdBy: `System Upload - ${user}`,
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

  const accResponse = await saveAccountRecordsToDatabase(response.data.insertId, user, record);

  if (accResponse.data.errno) {
    //console.log('problem');
    return 'accResponse problem';
  }
  console.log('accResponse: ', accResponse);

  // account upload

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

async function saveAccountRecordsToDatabase(fId, user, record) {
  const paymentDueDate = null;

  const debitOrderDate = record.debit_order_date ?
    moment(ExcelDateToJSDate(record.debit_order_date)).format('YYYY-MM-DD') :
    null;
  console.log('record.debit_order_date: ', record.debit_order_date);
  console.log('debitOrderDate: ', debitOrderDate);

  const lastPaymentDate = null;

  const lastPTPDate = null;

  const openDate = null;

  let account = [
    {
      accountNumber: record.account_number,
      accountName: record.customer_name,
      createdBy: `System Upload - ${user}`,
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
      f_customerId: fId,
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

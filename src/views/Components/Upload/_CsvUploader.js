import React, { useEffect, useState } from 'react';
import MysqlLayer from 'utils/MysqlLayer';
//import FetchData from 'utils/useFetch';
import moment from 'moment';

export default function CsvUploader() {
  // first we need to check if the account number exists already
  // by loading the existing into state
  const [customers, setCustomers] = useState(null);
  const clientId = sessionStorage.getItem('cwsClient');
  const mysqlLayer = new MysqlLayer();
  //const fetchData = new FetchData();
  //console.log('fetchData: ', fetchData(`/business/collections/list_all_customers/${clientId}`));

  useEffect(() => {
    async function fetchAccounts() {
      await mysqlLayer.Get(`/business/collections/list_all_customers/${clientId}`)
        .then(response => {
          console.log('response: ', response);
          setCustomers(response);
        });
    }
    fetchAccounts();
  }, []);

  useEffect(() => {
    function useCustomers() {
      return customers;
    }
  });

  return (
    <div>
      <h3>Import CSV</h3>
      {FileUpload}
      <br /><br />
    </div>
  )
}

const useFetch = (url) => {
  const clientId = sessionStorage.getItem('cwsClient');
  const mysqlLayer = new MysqlLayer();
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!url) return;
    const fetchData = async () => {
      setStatus('fetching');
      const response = await mysqlLayer.Get(`/business/collections/list_all_customers/${clientId}`);
      const data = await response.json();
      setData(data);
      setStatus('fetched');
    };

    fetchData();
  }, [url]);

  return { status, data };
};

function FileUpload(e) {
  function handleChange(e) {
    console.log('customers: ', useFetch());

  }

  return <input
      type="file"
      onChange={event => FileUpload(event.target.files[0])}
      accept=".csv"
  />
}



function HandleFile(file) {
  //const [recordCount, setRecordCount] = useState(0);
  //const [records, setRecords] = useState(null);
  console.log('customers: ', useFetch());

  if (!file) {
    return
  }

  let fileReader = new FileReader();
  fileReader.readAsText(file);

  setTimeout(() => {
      let lines = fileReader.result.split("\n");
      let result = [];
      let headers = lines[0].split(",");

      for (let i = 1; i < lines.length; i++) {
          let obj = {};
          let currentline = lines[i].split(",");
          for (let j = 0; j < headers.length; j++) {
              obj[headers[j].trim()] = currentline[j];
          }

          if (obj.msisdn)
              result.push(obj);
      }

      //setRecordCount(result.length);
      //setRecords(result);
      //SaveRecordsToDatabase(result);


  }, 3000);
  return;
}

function SaveRecordsToDatabase(records) {
  // need to save one record at a time as the foreign key is required for the next table down in the sequence


  const createdBy = sessionStorage.getItem('cwsUser');
  const clientId = sessionStorage.getItem('cwsClient');
  const createdDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  let customers = [];
  let accounts = [];
  let cases = [];
  let contacts = [];
  let outcomes = [];
/*
  customers.push({
    customerRefNo: record.account_number,
    customerName: record.customer_name,
    customerEntity: 'Consumer',
    regIdNumber: record.id_number,
    createdBy: createdBy,
    createdDate: createdDate,
    f_clientId: clientId
  });



  accountNumber: record.account_number,
  accountName: record.customer_name,
  createdBy: createdBy,
  createdDate: createdDate,
  f_customerId: record.,

  caseNumber?: record.,
  createdDate: createdDate,
  createdBy: createdBy,
  currentAssignment?: record.,
  caseNotes?: record.,
  kamNotes?: record.,
  currentStatus: record.,
  f_accountNumber: record.,

  outcomes
  createdDate: createdDate,
  createdBy: createdBy,
  outcomeStatus: record.,
  f_caseId: record.,*/
}

import React, { useEffect, useRef, useState } from 'react';
import MysqlLayer from 'utils/MysqlLayer';

/*function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
}*/

export const CsvUploader = () => {
  const clientId = sessionStorage.getItem('cwsClient');
  const [file, setFile] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [records, setRecords] = useState([]);
  const [done, setDone] = useState(false);
  //const [progress, setProgress] = useState(0);
  const [compliance, setCompliance] = useState('');
  const [errors, setErrors] = useState([]);
  const firstTimeRender = useRef(true);

  useEffect(() => {
    if (!firstTimeRender.current) {
      displayRecords();
      const cont = checkData(records);
      if (cont) {
        console.log('Need to create the chunking and upload functions');
      }
    }
  }, [done]);

  useEffect(() => {
    firstTimeRender.current = false;
  }, []);

  useEffect(() => {
    async function fetchData() {
      const mysqlLayer = new MysqlLayer();
      const result = await mysqlLayer.Get(
        `/business/collections/list_all_customers/${clientId}`
      );
      setCustomers(result);
    }

    fetchData();
  }, [clientId]);

  const UploadFile = (file, customers) => {
    if (!file) {
      console.log('No file provided to upload');
      return;
    }

    let fileReader = new FileReader();
    fileReader.readAsText(file);
    let records = [];

    fileReader.onload = function () {
      const dataset = fileReader.result;
      let lines = dataset.split('\r\n');
      let headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentline[j];
        }

        if (obj.account_number) {
          if (checkUnique(obj.account_number, customers)) {
            //setRecords(records => [...records, obj]);
            records.push(obj);
          } else {
            console.log(
              `Account ${obj.account_number} already exists on the database`
            );
          }
        }
      }
      setRecords(records);
      setDone(true);
    };
    //setRecords(records);
    /*setRecords(
      (prev) => prev.push(records),
      () => {
        console.log('records after setState: ', records);
        checkData(records);
      }
    );*/
  };

  const displayRecords = () => {
    console.log('records: ', records);
  };

  const checkUnique = (accNum, customers) => {
    const found = customers.find((customer) => customer === accNum);
    return !found;
  };

  const checkData = (records) => {
    if (records.length === 0) {
      console.log('no records');
    }
    //console.log('checkData records: ', records);
    setCompliance(`${records.length} records processed for compliance`);
    let errors = [];

    records.forEach((record, idx) => {
      //console.log('checking record: ', record);
      /*if (record.CustomerNumber === undefined)
        errors.push(`Record id: ${idx + 1} CustomerNumber is missing`);
      if (record.Customer === undefined)
        errors.push(`Record id: ${idx + 1} Customer is missing`);*/
      if (record.account_number === undefined)
        errors.push(`Record id: ${idx + 1} AccountNumber is missing`);
      /*if (record.AccountStatus === undefined)
        errors.push(`Record id: ${idx + 1} AccountStatus is missing`);
      if (record.CustomerRefNo === undefined)
        errors.push(`Record id: ${idx + 1} CustomerRefNo is missing`);
      //if (record.DateCreated === undefined) errors.push(`Record id: ${idx + 1} DateCreated is missing`);
      if (!moment(record.DateCreated).isValid())
        errors.push(
          `Record id: ${idx + 1} DateCreated is incorrectly formatted`
        );
      if (record.AccountNumber === undefined)
        errors.push(`Record id: ${idx + 1} AccountNumber is missing`);
      if (record.AccountNumber === undefined)
        errors.push(`Record id: ${idx + 1} AccountNumber is missing`);
      if (record.CurrentAssignment === undefined)
        errors.push(`Record id: ${idx + 1} CurrentAssignment is missing`);
      if (record.CurrentStatus === undefined)
        errors.push(`Record id: ${idx + 1} CurrentStatus is missing`);
      if (record.CaseNumber === undefined)
        errors.push(`Record id: ${idx + 1} CaseNumber is missing`);*/
    });

    setErrors(errors);
    if (errors.length > 0) return false;
    return true;
  };

  return (
    <div>
      <h3>Import CSV</h3>
      <input
        type="file"
        onChange={(event) => setFile(event.target.files[0])}
        accept=".csv"
      />
      <button
        onClick={
          () => UploadFile(file, customers)
          //setProgress(progress + progressUpdate);
        }
      >
        Upload
      </button>
      <br />
      <br />
      {compliance}
      {errors}
    </div>
  );
};

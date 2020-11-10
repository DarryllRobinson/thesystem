import MysqlLayer from 'utils/MysqlLayer';
import { useState, useEffect } from 'react';

export default function FetchData() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);
  const mysqlLayer = new MysqlLayer();
  const reportObject = {
    workspace: 'collections',
    reportName: 'aging',
    clientId: 1
  };

  const useFetch = (query) => {

    useEffect(() => {
      if (!query) return;

      const fetchData = async () => {
        setStatus('fetching');
        const response = await mysqlLayer.Post('/reports', reportObject);
        const data = await response.json();
        setData(data.hits);
        setStatus('fetched');
      };

      fetchData();
    }, [query]);

    return { status, data };
  };

  return status;
}
/*

const mysqlLayer = new MysqlLayer();
const reportObject = {
  workspace: 'collections',
  reportName: 'aging',
  clientId: 1
};

const useFetch = (query) => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            setStatus('fetching');
            const response = await fetch(
                `https://hn.algolia.com/api/v1/search?query=${query}`
            );
            const data = await response.json();
            setData(data.hits);
            setStatus('fetched');
        };

        fetchData();
    }, [query]);

    return { status, data };
};
*/

import React from 'react';
import { Chart } from 'react-charts';

export default function ColumnChart(props) {
  //console.log('ColumnChart props: ', props);
  //console.log('ColumnChart props.reports[0]: ', props.reports[0]);

  const graphData = props.reports.map((report, idx) => {
    console.log('report: ', report);
    console.log('report.goals[idx]: ', report.goals[idx]);
    return null; //?????????
  });

  console.log('graphData: ', graphData);

  const data = React.useMemo(
    () => [
      {
        label: 'Current',
        data: [['30 Days', 1000], ['60 Days', 3000], ['90 Days', 5000]]
      },
      {
        label: 'Target',
        data: [['30 Days', 3000], ['60 Days', 5000], ['90 Days', 7000]]
      }
    ],
    []
  );
  /*const { data, randomizeData } = useDemoConfig({
    series: 2,
    datums: 3,
    dataType: "ordinal"
  });*/

  const series = React.useMemo(
    () => ({
      type: 'bar'
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { position: 'left', type: 'linear', stacked: false }
    ],
    []
  );

  return (
    <>
      <br />
      <br />
      <div style={{ height: "250px", width: "250px"}}>
        <Chart data={data} series={series} axes={axes} tooltip />
      </div>
    </>
  )
}

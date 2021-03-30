import React from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryTheme,
} from 'victory';
import MysqlLayer from 'utils/MysqlLayer';

const data = [
  { quarter: 1, earnings: 11111 },
  { quarter: 2, earnings: 22222 },
  { quarter: 3, earnings: 12121 },
  { quarter: 4, earnings: 32332 },
];

const ageOfAccounts = [
  { days: 0, value: 11000 },
  { days: 30, value: 1000 },
  { days: 60, value: 2000 },
  { days: 90, value: 500 },
  { days: 120, value: 800 },
  { days: 150, value: 0 },
  { days: 180, value: 250 },
];

const ageAtList = [
  { quarter: 1, days: 35 },
  { quarter: 2, days: 22 },
  { quarter: 3, days: 44 },
  { quarter: 4, days: 52 },
];

class Victory extends React.Component {
  constructor(props) {
    super(props);
    this.mysqlLayer = new MysqlLayer();
  }

  async componentDidMount() {
    /*const workspace = req.body.workspace;
    const clientId = req.body.clientId;
    const reportName = req.body.reportName;*/
    const agingReport = await this.mysqlLayer.Get(
      `/reports/collections/aging/1`
    );
    console.log('agingReport: ', agingReport);
  }

  render() {
    return (
      <>
        <div className="ui stackable four column divided grid">
          <div className="row">
            <div className="column">
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryLegend
                  x={70}
                  y={30}
                  title="Age at List"
                  centerTitle
                  orientation="horizontal"
                  gutter={20}
                  style={{
                    border: { stroke: 'black' },
                    title: { fontSize: 20 },
                  }}
                  data={[
                    { name: 'One', symbol: { fill: 'tomato', type: 'star' } },
                    { name: 'Two', symbol: { fill: 'orange' } },
                    { name: 'Three', symbol: { fill: 'gold' } },
                  ]}
                />
                <VictoryAxis
                  tickValues={[1, 2, 3, 4]}
                  tickFormat={[
                    'Quarter 1',
                    'Quarter 2',
                    'Quarter 3',
                    'Quarter 4',
                  ]}
                />
                <VictoryAxis dependentAxis tickFormat={(x) => `R ${x}k`} />
                <VictoryBar
                  events={[
                    {
                      target: 'data',
                      eventHandlers: {
                        onClick: () => {
                          return [
                            {
                              target: 'data',
                              mutation: (props) => {
                                const fill = props.style && props.style.fill;
                                return fill === 'black'
                                  ? null
                                  : { style: { fill: 'black' } };
                              },
                            },
                          ];
                        },
                      },
                    },
                  ]}
                  data={ageAtList}
                  x="quarter"
                  y="days"
                />
              </VictoryChart>
            </div>
            <div className="column">
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                  tickValues={[1, 2, 3, 4]}
                  tickFormat={[
                    'Quarter 1',
                    'Quarter 2',
                    'Quarter 3',
                    'Quarter 4',
                  ]}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `$${x / 1000}k`}
                />
                <VictoryBar horizontal data={data} x="quarter" y="earnings" />
              </VictoryChart>
            </div>
            <div className="column">
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                  tickValues={[1, 2, 3, 4]}
                  tickFormat={[
                    'Quarter 1',
                    'Quarter 2',
                    'Quarter 3',
                    'Quarter 4',
                  ]}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `$${x / 1000}k`}
                />
                <VictoryBar data={data} x="quarter" y="earnings" />
              </VictoryChart>
            </div>
            <div className="column">
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                  tickValues={[0, 30, 60, 90, 120, 150, 180]}
                  tickFormat={[
                    'Current',
                    '30 Days',
                    '60 Days',
                    '90 Days',
                    '120 Days',
                    '150 Days',
                    '180 Days',
                  ]}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `$${x / 1000}k`}
                />
                <VictoryBar data={ageOfAccounts} x="days" y="value" />
              </VictoryChart>
            </div>
          </div>
        </div>

        <div className="ui stackable four column divided grid">
          <div className="row">
            <div className="column">
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                  tickValues={[1, 2, 3, 4]}
                  tickFormat={[
                    'Quarter 1',
                    'Quarter 2',
                    'Quarter 3',
                    'Quarter 4',
                  ]}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `$${x / 1000}k`}
                />
                <VictoryBar data={data} x="quarter" y="earnings" />
              </VictoryChart>
            </div>
            <div className="column">
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                  tickValues={[1, 2, 3, 4]}
                  tickFormat={[
                    'Quarter 1',
                    'Quarter 2',
                    'Quarter 3',
                    'Quarter 4',
                  ]}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `$${x / 1000}k`}
                />
                <VictoryBar data={data} x="quarter" y="earnings" />
              </VictoryChart>
            </div>
            <div className="column">
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                  tickValues={[1, 2, 3, 4]}
                  tickFormat={[
                    'Quarter 1',
                    'Quarter 2',
                    'Quarter 3',
                    'Quarter 4',
                  ]}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `$${x / 1000}k`}
                />
                <VictoryBar data={data} x="quarter" y="earnings" />
              </VictoryChart>
            </div>
            <div className="column">
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                  tickValues={[1, 2, 3, 4]}
                  tickFormat={[
                    'Quarter 1',
                    'Quarter 2',
                    'Quarter 3',
                    'Quarter 4',
                  ]}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `$${x / 1000}k`}
                />
                <VictoryBar data={data} x="quarter" y="earnings" />
              </VictoryChart>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Victory;

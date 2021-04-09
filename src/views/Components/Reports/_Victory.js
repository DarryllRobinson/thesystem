import React from 'react';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryContainer,
  //VictoryLabel,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';
import MysqlLayer from 'utils/MysqlLayer';

class Victory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: {
        ids: ['aging', 'agentPTP', 'datePTP'],
        entities: {
          aging: {
            data: null,
            title: 'Aging',
          },
          agentPTP: {
            data: null,
            title: 'PTP by Agent',
          },
          datePTP: {
            data: null,
            title: 'PTP by Date',
          },
        },
      },
    };
    this.mysqlLayer = new MysqlLayer();
    //this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
    this.interval = setInterval(() => this.loadData(), 30 * 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  loadData() {
    const reportList = this.state.reports.ids;

    reportList.forEach(async (report) => {
      const reportObject = this.state.reports.entities[report];
      reportObject.data = null;
      this.setState({ ...this.state, reportObject });

      const reportData = await this.mysqlLayer.Get(
        `/reports/collections/${report}/1`
      );

      reportObject.data = this.prepData(reportData);
      this.setState({ ...this.state, reportObject });
    });
  }

  prepData(data) {
    let tempArray = [];

    if (data.length === 1) {
      for (const [key, value] of Object.entries(data[0])) {
        let tempObj = {};
        tempObj.name = key;
        tempObj.value = value;
        tempArray.push(tempObj);
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        const obj = Object.entries(data[i]);
        let tempObj = {};
        for (const [key, value] of Object.entries(obj)) {
          if (key === '0') {
            tempObj.name = value[1];
          }
          if (key === '1') {
            tempObj.value = value[1];
          }
        }
        tempArray.push(tempObj);
      }
    }

    return tempArray;
  }

  reportsDisplay() {
    const reports = this.state.reports;

    const reportsDisplay = reports.ids.map((report, idx) => {
      return (
        <div key={idx} className="col">
          {reports.entities[report].data && (
            <div>
              <VictoryChart
                animate={{
                  duration: 2000,
                  easing: 'backOut',
                  onLoad: { duration: 1000 },
                }}
                containerComponent={<VictoryContainer responsive={false} />}
                domainPadding={{ x: 20, y: 5 }}
                padding={{ top: 50, bottom: 50, left: 80, right: 20 }}
                theme={VictoryTheme.material}
              >
                <VictoryBar
                  data={reports.entities[report].data}
                  labelComponent={
                    <VictoryTooltip
                      dy={0}
                      centerOffset={{ x: 25 }}
                      constrainToVisibleArea
                    />
                  }
                  labels={({ datum }) => [
                    `R ${Math.round(datum.value / 1000)} k`,
                  ]}
                  x="name"
                  y="value"
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(t) => `R ${Math.round(t) / 1000} k`}
                />
                <VictoryAxis
                  label={reports.entities[report].title}
                  style={{
                    axisLabel: {
                      fontSize: 20,
                      orientation: 'top',
                      padding: 25,
                    },
                    tickLabels: { fontSize: 10, padding: 3 },
                  }}
                />
              </VictoryChart>
            </div>
          )}
          {!reports.entities[report].data && <div key={idx}>Loading...</div>}
        </div>
      );
    });
    return reportsDisplay;
  }

  render() {
    return (
      <>
        <div className="ui  message">
          Auto-refresh every 30 minutes or{' '}
          <button
            className="ui button primary"
            onClick={() => {
              this.loadData();
            }}
          >
            Reload
          </button>
        </div>
        <div className="row">{this.reportsDisplay()}</div>
      </>
    );
  }
}

export default Victory;

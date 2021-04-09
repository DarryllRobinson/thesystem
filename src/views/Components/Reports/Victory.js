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
import CustomBar from './CustomBar';
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
            description: 'Amount owed per period',
            title: 'Aging',
          },
          agentPTP: {
            data: null,
            description: 'PTP sum per agent',
            title: 'PTP by Agent',
          },
          datePTP: {
            data: null,
            description: 'PTP sum per date',
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
        <div key={idx}>
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
                height={200}
                padding={{ top: 50, bottom: 50, left: 80, right: 20 }}
                theme={VictoryTheme.material}
                width={250}
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
          {!reports.entities[report].data && (
            <div key={idx}>
              <div className="ui segment">
                <div className="ui active inverted dimmer">
                  <div className="ui text loader">Loading</div>
                </div>
                <p></p>
              </div>
            </div>
          )}
        </div>
      );
    });
    return reportsDisplay;
  }

  customBarRender() {
    const reports = this.state.reports;
    const { styleType } = this.props;

    const reportsDisplay = reports.ids.map((report, idx) => {
      return (
        <div key={idx}>
          <div className="ui segment">
            {reports.entities[report].data && (
              <CustomBar
                chartNumber={idx}
                data={reports.entities[report].data}
                description={reports.entities[report].description}
                styleType={styleType}
                title={reports.entities[report].title}
              />
            )}
            {!reports.entities[report].data && (
              <div key={idx}>
                <div className="ui segment">
                  <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                  </div>
                  <p></p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    });

    return reportsDisplay;
  }

  refreshButtonRender() {
    return (
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
    );
  }

  render() {
    return (
      <>
        <div className="row">{this.customBarRender()}</div>
      </>
    );
  }
}

export default Victory;

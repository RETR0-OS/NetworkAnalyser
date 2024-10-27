// Dashboard.js
import React, { useEffect, useState } from 'react';
import './App.css';
import './chart.css';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const Dashboard = () => {
  const [protocolCounts, setProtocolCounts] = useState([]);
  const [serviceCounts, setServiceCounts] = useState([]);
  const [anomalyTypeCounts, setAnomalyTypeCounts] = useState([]);
  const [attackVectorCounts, setAttackVectorCounts] = useState([]);

  useEffect(() => {
    // Use hardcoded data instead of fetching

    // **Sample data for protocolCounts**
    const sampleProtocolCounts = [
      { name: 'tcp', value: 120 },
      { name: 'udp', value: 80 },
      { name: 'icmp', value: 30 },
    ];
    setProtocolCounts(sampleProtocolCounts);

    // **Sample data for serviceCounts**
    const sampleServiceCounts = [
      { name: 'http', value: 70 },
      { name: 'ftp', value: 50 },
      { name: 'ssh', value: 40 },
      { name: 'dns', value: 20 },
    ];
    setServiceCounts(sampleServiceCounts);

    // **Anomalies data from anomalies.txt**
    const anomaliesText = `
All ok
All ok
All ok
All ok
All ok
Anomaly detected in request 1: [np.float64(378.73077917099), 2, 6, 10, 155109, 140589, 0, 0, 0, 0, 0, 0, 0, 726, 547, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Anomaly type: udpstorm
Possible attack vector : DoS

Anomaly detected in request 1: [np.float64(437.6359281539917), 2, 6, 10, 157251, 141811, 0, 0, 0, 0, 0, 0, 0, 772, 591, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Anomaly type: udpstorm
Possible attack vector : DoS

All ok
All ok
All ok
All ok
All ok
All ok
All ok
Anomaly detected in request 1: [np.float64(484.83814907073975), 2, 6, 10, 188208, 173588, 0, 0, 0, 0, 0, 0, 0, 731, 562, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Anomaly type: udpstorm
Possible attack vector : DoS

Anomaly detected in request 1: [np.float64(544.5192821025848), 2, 6, 10, 191215, 175715, 0, 0, 0, 0, 0, 0, 0, 775, 605, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Anomaly type: udpstorm
Possible attack vector : DoS
`;

    // **Process anomalies data**
    const anomalyLines = anomaliesText.split('\n');
    let anomalyTypeCount = {};
    let attackVectorCount = {};
    let totalAnomalies = 0;
    let totalOk = 0;

    for (let i = 0; i < anomalyLines.length; i++) {
      const line = anomalyLines[i].trim();

      if (line === 'All ok') {
        totalOk++;
      }

      if (line.startsWith('Anomaly type:')) {
        const anomalyType = line.split(':')[1].trim();
        anomalyTypeCount[anomalyType] = (anomalyTypeCount[anomalyType] || 0) + 1;
        totalAnomalies++;
      }

      if (line.startsWith('Possible attack vector')) {
        const attackVector = line.split(':')[1].trim();
        attackVectorCount[attackVector] = (attackVectorCount[attackVector] || 0) + 1;
      }
    }

    // **Convert counts to arrays for recharts**
    const anomalyTypeCountsArray = Object.entries(anomalyTypeCount).map(([type, count]) => ({
      name: type,
      value: count,
    }));

    const attackVectorCountsArray = Object.entries(attackVectorCount).map(
      ([vector, count]) => ({
        name: vector,
        value: count,
      })
    );

    // **Set state with processed data**
    setAnomalyTypeCounts(anomalyTypeCountsArray);
    setAttackVectorCounts(attackVectorCountsArray);
  }, []);

  // **Define colors for the charts**
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#AA0DFE',
    '#F806FF',
    '#800000',
    '#B0FF92',
    '#FF9280',
    '#FAC200',
  ];

  return (
    <div>
      <header className="app-header">
        <h1>SniffHound</h1>
      </header>
      <h2 className="hart-heading">Anomaly Dashboard</h2>
      <div className="chart-container">
        {/* **Protocol Type Distribution Chart** */}
        <div className="chart-card">
          <h2>Protocol Type Distribution</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={protocolCounts}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
              {protocolCounts.map((entry, index) => (
                <Cell
                  key={`protocol-cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>

        {/* **Service Distribution Chart** */}
        <div className="chart-card">
          <h2>Service Distribution</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={serviceCounts}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
              {serviceCounts.map((entry, index) => (
                <Cell
                  key={`service-cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>

        {/* **Anomaly Type Distribution Chart** */}
        <div className="chart-card">
          <h2>Anomaly Type Distribution</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={anomalyTypeCounts}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
              {anomalyTypeCounts.map((entry, index) => (
                <Cell
                  key={`anomaly-type-cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>

        {/* **Attack Vector Distribution Chart** */}
        <div className="chart-card">
          <h2>Attack Vector Distribution</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={attackVectorCounts}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
              {attackVectorCounts.map((entry, index) => (
                <Cell
                  key={`attack-vector-cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

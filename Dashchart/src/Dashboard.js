import React, { useEffect, useState } from 'react';
import './App.css';
import './chart.css';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import axios from 'axios';
import Papa from 'papaparse';

const Dashboard = () => {
  const [protocolCounts, setProtocolCounts] = useState([]);
  const [serviceCounts, setServiceCounts] = useState([]);
  const [anomalyTypeCounts, setAnomalyTypeCounts] = useState([]);
  const [attackVectorCounts, setAttackVectorCounts] = useState([]);

  useEffect(() => {
    // Fetch and parse the anomalies.txt file
    const fetchAnomalies = async () => {
      try {
        // Corrected the path to anomalies.txt
        const anomaliesResponse = await axios.get('/Logs/anomalies.txt');
        const anomaliesText = anomaliesResponse.data;

        // Process anomalies data
        const anomalyLines = anomaliesText.split('\n');
        let anomalyTypeCount = {};
        let attackVectorCount = {};

        for (let i = 0; i < anomalyLines.length; i++) {
          const line = anomalyLines[i].trim();

          if (line.startsWith('Anomaly type:')) {
            const anomalyType = line.split(':')[1].trim();
            anomalyTypeCount[anomalyType] = (anomalyTypeCount[anomalyType] || 0) + 1;
          }

          if (line.startsWith('Possible attack vector')) {
            const attackVector = line.split(':')[1].trim();
            attackVectorCount[attackVector] = (attackVectorCount[attackVector] || 0) + 1;
          }
        }

        // Convert counts to arrays for recharts
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

        setAnomalyTypeCounts(anomalyTypeCountsArray);
        setAttackVectorCounts(attackVectorCountsArray);
      } catch (error) {
        console.error('Error fetching anomalies:', error);
      }
    };

    // Fetch and parse the CSV data
    const fetchCSVData = async () => {
      try {
        const csvResponse = await axios.get('/captured_network_data.csv');
        const parsedData = Papa.parse(csvResponse.data, { header: true });
        const data = parsedData.data;

        // Existing code to process protocolCounts and serviceCounts
        // Define the mappings
        const protocolMapping = { 0: 'tcp', 1: 'udp', 2: 'icmp' };
        const serviceMapping = {
          0: 'http',
          1: 'private',
          2: 'domain_u',
          3: 'smtp',
          4: 'ftp_data',
          5: 'eco_i',
          6: 'other',
          7: 'ecr_i',
          8: 'telnet',
          9: 'finger',
          10: 'ftp',
          11: 'https',
        };

        // Count the occurrences of each protocol type
        const protocolCount = data.reduce((acc, row) => {
          const protocolType = row.protocol_type;
          if (protocolType !== undefined) {
            const mappedProtocol = protocolMapping[protocolType] || 'unknown';
            acc[mappedProtocol] = (acc[mappedProtocol] || 0) + 1;
          }
          return acc;
        }, {});

        const protocolCountsArray = Object.entries(protocolCount).map(([protocol, count]) => ({
          name: protocol,
          value: count,
        }));

        setProtocolCounts(protocolCountsArray);

        // Count the occurrences of each service type
        const serviceCount = data.reduce((acc, row) => {
          const serviceType = row.service;
          if (serviceType !== undefined) {
            const mappedService = serviceMapping[serviceType] || 'unknown';
            acc[mappedService] = (acc[mappedService] || 0) + 1;
          }
          return acc;
        }, {});

        const serviceCountsArray = Object.entries(serviceCount).map(([service, count]) => ({
          name: service,
          value: count,
        }));

        setServiceCounts(serviceCountsArray);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchAnomalies();
    fetchCSVData();
  }, []);

  // Define colors for the charts
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
        <h2 className="chart-header">Anomaly Dashboard</h2>
      <div className="chart-container">
        {/* Protocol Type Distribution Chart */}
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

        {/* Service Distribution Chart */}
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

        {/* Anomaly Type Distribution Chart */}
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

        {/* Attack Vector Distribution Chart */}
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
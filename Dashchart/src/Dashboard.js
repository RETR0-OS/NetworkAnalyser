// Dashboard.js
import React, { useEffect, useState } from 'react';
import './App.css';
import './chart.css';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import Papa from 'papaparse';
import axios from 'axios';

const Dashboard = () => {
  const [protocolCounts, setProtocolCounts] = useState([]);
  const [serviceCounts, setServiceCounts] = useState([]);

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

  useEffect(() => {
    // Fetch the CSV file from the public directory
    const fetchData = async () => {
      const response = await axios.get('/captured_network_data.csv');
      const parsedData = Papa.parse(response.data, { header: true });
      const data = parsedData.data;

      // Count the occurrences of each protocol type
      const protocolCount = data.reduce((acc, row) => {
        const protocolType = row.protocol_type; // Assuming protocol_type is the column name
        if (protocolType !== undefined) {
          const mappedProtocol = protocolMapping[protocolType] || 'unknown'; // Fallback for unmapped protocols
          acc[mappedProtocol] = (acc[mappedProtocol] || 0) + 1;
        }
        return acc;
      }, {});

      const countsArray = Object.entries(protocolCount).map(([protocol, count]) => ({
        name: protocol,
        value: count,
      }));

      setProtocolCounts(countsArray);

      // Count the occurrences of each service type
      const serviceCount = data.reduce((acc, row) => {
        const serviceType = row.service; // Assuming service is the column name
        if (serviceType !== undefined) {
          const mappedService = serviceMapping[serviceType] || 'unknown'; // Fallback for unmapped services
          acc[mappedService] = (acc[mappedService] || 0) + 1;
        }
        return acc;
      }, {});

      const serviceCountsArray = Object.entries(serviceCount).map(([service, count]) => ({
        name: service,
        value: count,
      }));

      setServiceCounts(serviceCountsArray);
    };

    fetchData();
  }, []);

  // Define colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA0DFE', '#F806FF', '#800000'];

  return (
    <div>
      <header className="app-header">
        <h1>SniffHound</h1>
      </header>
        <h2 className='chart-heading'> Anomaly Dashboard</h2>
      <div className="chart-container">
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
      </div>
    </div>
  );
};

export default Dashboard;

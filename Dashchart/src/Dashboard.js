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
        11: 'https', // Added mapping for https
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

    return (
        <div>
          <header>
            <h1>Anomaly Dashboard</h1>
          </header>
          <div className="chart-container">
            <h2>Protocol Type Distribution</h2>
            <PieChart width={400} height={400}>
                <Pie
                    data={protocolCounts}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {protocolCounts.map((entry, index) => (
                        <Cell key={`protocol-cell-${index}`} fill={`hsl(${(index * 360) / protocolCounts.length}, 70%, 50%)`} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>

            <h2>Service Distribution</h2>
            <PieChart width={400} height={400}>
                <Pie
                    data={serviceCounts}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="value"
                >
                    {serviceCounts.map((entry, index) => (
                        <Cell key={`service-cell-${index}`} fill={`hsl(${(index * 360) / serviceCounts.length}, 70%, 50%)`} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
      </div>
    );
};

export default Dashboard;

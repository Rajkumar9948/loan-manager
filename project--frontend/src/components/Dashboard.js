import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const statsRes = await axios.get('http://localhost:3000/api/applications/statistics');
      const appsRes = await axios.get('http://localhost:3000/api/applications');
      setStats(statsRes.data);
      setApplications(appsRes.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>Total: {stats.total}</div>
      <div>Approved: {stats.approved}</div>
      <div>Rejected: {stats.rejected}</div>
      <div>Pending: {stats.pending}</div>

      <h3>Applications</h3>
      <ul>
        {applications.map(app => (
          <li key={app.id}>
            {app.fullName} - {app.amount} - {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

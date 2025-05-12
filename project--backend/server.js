const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// SQLite database setup
const db = new sqlite3.Database('./loan_manager.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database.');
});

// Create table if not exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS LoanApplications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT,
  email TEXT,
  amount REAL,
  duration INTEGER,
  purpose TEXT,
  status TEXT DEFAULT 'pending',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);`;
db.run(createTableQuery);

// --- Routes ---

// POST - Create new application
app.post('/api/applications', (req, res) => {
  const { fullName, email, amount, duration, purpose } = req.body;
  const stmt = `INSERT INTO LoanApplications (fullName, email, amount, duration, purpose) VALUES (?, ?, ?, ?, ?)`;
  db.run(stmt, [fullName, email, amount, duration, purpose], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID, ...req.body, status: 'pending', createdAt: new Date().toISOString() });
  });
});

// GET - List all applications
app.get('/api/applications', (req, res) => {
  const query = `SELECT * FROM LoanApplications ORDER BY createdAt DESC`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET - Dashboard statistics
app.get('/api/applications/statistics', (req, res) => {
  const stats = {
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  };

  const query = `SELECT status, COUNT(*) as count FROM LoanApplications GROUP BY status`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows.forEach(row => {
      stats[row.status] = row.count;
      stats.total += row.count;
    });
    res.json(stats);
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

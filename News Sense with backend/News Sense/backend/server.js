const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Register API
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // Default categories
  const preferredCategories = JSON.stringify(['Business', 'Technology']);

  const sql = `INSERT INTO users (username, password, preferredCategories) VALUES (?, ?, ?)`;
  db.run(sql, [username, password, preferredCategories], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.status(201).json({
      id: this.lastID,
      username,
      preferredCategories: JSON.parse(preferredCategories)
    });
  });
});

// Login API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(sql, [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      id: row.id,
      username: row.username,
      preferredCategories: JSON.parse(row.preferredCategories)
    });
  });
});

// Update Profile preferences
app.put('/api/auth/preferences', (req, res) => {
  const { username, categories } = req.body;
  
  if (!username || !categories) {
    return res.status(400).json({ error: 'Username and categories required' });
  }

  const sql = `UPDATE users SET preferredCategories = ? WHERE username = ?`;
  db.run(sql, [JSON.stringify(categories), username], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true });
  });
});

// Update Profile username
app.put('/api/auth/profile', (req, res) => {
  const { oldUsername, newUsername } = req.body;
  
  if (!oldUsername || !newUsername) {
    return res.status(400).json({ error: 'Usernames required' });
  }

  const sql = `UPDATE users SET username = ? WHERE username = ?`;
  db.run(sql, [newUsername, oldUsername], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true });
  });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route for React Router
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

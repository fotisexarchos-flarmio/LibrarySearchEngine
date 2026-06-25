const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'books.db');
const db = new sqlite3.Database(DB_PATH);

app.get('/api/books/search', (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.json([]);
  }

  const sql = `
    SELECT * FROM books 
    WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?
  `;
  const searchTerm = `%${query}%`;

  db.all(sql, [searchTerm, searchTerm, searchTerm], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
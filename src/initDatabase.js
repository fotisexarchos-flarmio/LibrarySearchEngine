const sqlite3 = require('sqlite3').verbose();
const { faker } = require('@faker-js/faker');
const path = require('path');

// Define the path for your SQLite database file
const DB_PATH = path.join(__dirname, 'books.db');

// Connect to the database (it will create the file if it doesn't exist)
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Run the database setup serialization
db.serialize(() => {
  // 1. Drop the table if it already exists to start fresh
  db.run(`DROP TABLE IF EXISTS books`);

  // 2. Create the books table
  db.run(`
    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      genre TEXT,
      published_year INTEGER,
      isbn TEXT,
      description TEXT,
      price REAL
    )
  `);
  console.log('Books table created.');

  // 3. Prepare the insert statement for better performance
  const stmt = db.prepare(`
    INSERT INTO books (title, author, genre, published_year, isbn, description, price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // 4. Generate and insert 50 random books
  const numberOfBooks = 50;
  
  for (let i = 0; i < numberOfBooks; i++) {
    const title = faker.book.title();
    const author = faker.book.author();
    const genre = faker.book.genre();
    const publishedYear = faker.date.past({ years: 30 }).getFullYear();
    const isbn = faker.commerce.isbn();
    const description = faker.lorem.paragraph({ min: 1, max: 3 });
    const price = parseFloat(faker.commerce.price({ min: 4.99, max: 29.99 }));

    stmt.run(title, author, genre, publishedYear, isbn, description, price);
  }

  // Finalize the statement to clear it from memory
  stmt.finalize();
  console.log(`Successfully populated database with ${numberOfBooks} fake books!`);
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
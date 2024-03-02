const express = require('express');
const { Client, Pool } = require('pg');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// Create a connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '4525',
  port: '5432'
});

// Define a reusable function to execute queries
const queryDatabase = async (queryText, values = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(queryText, values);
    return result.rows;
  } finally {
    client.release();
  }
};

// Define a route to send a string
app.get('/api/string', async (req, res) => {
  try {
    const result = await queryDatabase('SELECT * FROM customers');
    res.json(result);
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define a route to search
app.get('/api/search', async (req, res) => {
  try {
    const searchStr = req.query.search;
    const searchParam = '%' + searchStr + '%';
    const result = await queryDatabase('SELECT * FROM customers WHERE LOWER(customer_name) LIKE LOWER($1)', [searchParam]);
    res.json(result);
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

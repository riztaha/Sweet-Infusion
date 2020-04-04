// This connects to DB
const { Pool } = require('pg');
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

// ----menu_items----
// This FXN will return all information about all menu items as an object
const getAllMenuItems = function() {
  const queryString = `
  SELECT *
  FROM menu_items;
  `;
  const values = []
  return pool.query(queryString, values)
  .then((res) => {
    return res.rows;
  }).catch(err => console.error('query error', err.stack));
}
exports.getAllMenuItems = getAllMenuItems;

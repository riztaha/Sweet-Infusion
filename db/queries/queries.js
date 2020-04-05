// This connects to DB
const { Pool } = require("pg");
const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "midterm",
});

// ----menu_items----
// This FXN will return an object of all
// information about all menu items.
const getAllMenuItems = function () {
  const queryString = `
  SELECT *
  FROM menu_items;
  `;
  const values = [];
  //Jason, return a promise here, don't return the pool. Once the promise
  //gets resolved, it is then used in the function in menu.js where
  //that function is used in server.js and renders it
  //as a tempvar. This needs to be a promise because it needs to resolve from the database
  //before it can show up in the index page.
  const promise = new Promise((resolve, reject) => {
    pool
      .query(queryString, values)
      .then((res) => {
        resolve(res.rows);
      })
      .catch((err) => {
        console.error("query error", err.stack);
        reject(err);
      });
  });
  return promise;
};
exports.getAllMenuItems = getAllMenuItems;


// This FXN will return an object of all information
// of one menu item taken in as argument as the menu_item id.
const getOneMenuItem = function (id) {
  const queryString = `
  SELECT *
  FROM menu_items
  WHERE id = $1;
  `;
  const values = [id];
  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => console.error("query error", err.stack));
};

exports.getOneMenuItem = getOneMenuItem;

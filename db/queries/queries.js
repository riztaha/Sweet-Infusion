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

// Function to Get all orders
const getOrders = function () {
  const queryString = `
  SELECT *
  FROM orders;
  `;
  return pool
    .query(queryString)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.getOrders = getOrders;

// Function to get a specific customer's order using the order_menu_item table
const getCustomerOrder = function (customer_id) {
  const queryString = `
  SELECT *
  FROM order_menu_item
  JOIN menu_items ON menu_item_id = menu_items.id
  JOIN orders ON order_id = orders.id
  WHERE customer_id = $1;
  `;
  const values = [customer_id];
  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.getCustomerOrder = getCustomerOrder;

// Function to get all customers
const getCustomers = function () {
  const queryString = `
  SELECT *
  FROM customers;
  `;
  return pool
    .query(queryString)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.getCustomers = getCustomers;

// Function to place an order
const placeOrder = function (order) {
  const queryString = `
  INSERT INTO orders (customer_id, is_order_complete)
  VALUES ($1, $2);
  `;
  const values = [order["customer_id"], order["is_order_complete"]];
  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.placeOrder = placeOrder;

// Function to place customer's information into db
const createEmptyCustomer = function () {
  const queryString = `
  INSERT INTO customers
  (name)
  VALUES ('undefined')
  RETURNING id;
  `;
  return pool
    .query(queryString)
    .then((res) => {
      // console.log(res.rows);
      return res.rows;
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.createEmptyCustomer = createEmptyCustomer;

// Function to edit a customer's information
const placeCustomerInfo = function (customer) {
  const queryString = `
  UPDATE customers
  SET name = $1, phone = $2, address = $3, zip_code = $4, credit_card = $5, credit_card_exp = $6, credit_card_code = $7
  WHERE name = 'undefined';
  `;
  const queryParams = [
    customer["name"],
    customer["phone"],
    customer["address"],
    customer["zip_code"],
    customer["credit_card"],
    customer["credit_card_exp"],
    customer["credit_card_code"],
  ];
  return pool
    .query(queryString, queryParams)
    .then((res) => {
      // console.log(res.rows);
      return res.rows;
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.placeCustomerInfo = placeCustomerInfo;

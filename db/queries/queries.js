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
  const promise = new Promise((resolve, reject) => {
    pool
      .query(queryString, values)
      .then((res) => {
        resolve(res.rows);
      })
      .catch((err) => {
        console.log("get menu items query error", err.stack);
        reject(err);
      });
  });
  return promise;
};
exports.getAllMenuItems = getAllMenuItems;

// // This FXN will return an object of all information
// // of one menu item taken in as argument as the menu_item id.
// const getOneMenuItem = function (id) {
//   const queryString = `
//   SELECT *
//   FROM menu_items
//   WHERE id = $1;
//   `;
//   const values = [id];
//   return pool
//     .query(queryString, values)
//     .then((res) => {
//       return res.rows[0];
//     })
//     .catch((err) => console.log("get one Menu item query error", err.stack));
// };
// exports.getOneMenuItem = getOneMenuItem;

// Function to Get all orders
// const getOrders = function () {
//   const queryString = `
//   SELECT *
//   FROM orders;
//   `;
//   return pool
//     .query(queryString)
//     .then((res) => {
//       return res.rows;
//     })
//     .catch((err) => console.log("get orders query error", err.stack));
// };
// exports.getOrders = getOrders;

const setCustomerOrderComplete = function (order_id) {
  const queryString = `
  UPDATE orders
  SET is_order_complete = true WHERE id = $1;
  `;
  // console.log(order_id);
  const queryParams = [order_id];
  return pool
    .query(queryString, queryParams)
    .then((res) => {
      return res.rows;
    })
    .catch((err) =>
      console.log("complete customer order query error", err.stack)
    );
};
exports.setCustomerOrderComplete = setCustomerOrderComplete;

//Get's a customer's phone number by their order_id
const getCustomerPhone = function (order_id) {
  const queryString = `
  SELECT phone
  FROM customers
  JOIN orders ON customer_id = customers.id
  WHERE orders.id = $1;
  `;
  // console.log(order_id);
  const queryParams = [order_id];
  return pool
    .query(queryString, queryParams)
    .then((res) => {
      return res.rows;
    })
    .catch((err) =>
      console.log("complete customer order query error", err.stack)
    );
};
exports.getCustomerPhone = getCustomerPhone;

// // Function to get all pending menu items / orders
const getPendingOrders = function () {
  const queryString = `
  SELECT order_id, customers.name as customer_name, customers.phone as customer_phone,
  menu_items.name as item, order_menu_item.item_quantity as quantity
  FROM orders
  JOIN order_menu_item ON order_menu_item.order_id = orders.id
  JOIN menu_items ON order_menu_item.menu_item_id = menu_items.id JOIN customers ON customer_id = customers.id
  WHERE is_order_complete = false
  GROUP BY order_id, customers.name, customers.phone, item, quantity;`;
  return pool
    .query(queryString)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.log("get pending orders query error", err.stack));
};
exports.getPendingOrders = getPendingOrders;

// // Function to get all customers
// const getCustomers = function () {
//   const queryString = `
//   SELECT *
//   FROM customers;
//   `;
//   return pool
//     .query(queryString)
//     .then((res) => {
//       return res.rows;
//     })
//     .catch((err) => console.log("get customers query error", err.stack));
// };
// exports.getCustomers = getCustomers;

// Function to place an order
const placeOrder = function (order) {
  const queryString = `
  INSERT INTO orders (customer_id, is_order_complete)
  VALUES ($1, $2)
  RETURNING id;
  `;
  const values = [order["customer_id"], order["is_order_complete"]];
  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.log("place order query error", err.stack));
};
exports.placeOrder = placeOrder;

const createOrder = function (order) {
  const queryString = `
  INSERT INTO order_menu_item (order_id, menu_item_id, item_quantity)
  VALUES ($1, $2, $3)
  `;
  const queryParams = [
    order["order_id"],
    order["menu_item_id"],
    order["item_quantity"],
  ];
  return pool
    .query(queryString, queryParams)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.log("create order Query Error", err.stack));
};
exports.createOrder = createOrder;

// // Function to place customer's information into db
// const createEmptyCustomer = function () {
//   const queryString = `
//   INSERT INTO customers
//   (name)
//   VALUES ('undefined')
//   RETURNING id;
//   `;
//   return pool
//     .query(queryString)
//     .then((res) => {
//       // console.log(res.rows);
//       return res.rows;
//     })
//     .catch((err) =>
//       console.log("create empty customer query error", err.stack)
//     );
// };
// exports.createEmptyCustomer = createEmptyCustomer;

// Function to edit a customer's information
const placeCustomerInfo = function (customer) {
  const queryString = `
  INSERT INTO customers
  (name, phone, address, zip_code, credit_card, credit_card_exp, credit_card_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id;
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
    .catch((err) => console.log("place customer info query error", err.stack));
};
exports.placeCustomerInfo = placeCustomerInfo;

// // Function to get all customers
// const getLastCustomer = function () {
//   const queryString = `
//   SELECT *
//   FROM customers
//   ORDER BY id
//   DESC LIMIT 1;
//   `;
//   return pool
//     .query(queryString)
//     .then((res) => {
//       return res.rows;
//     })
//     .catch((err) => console.log("get last customer query error", err.stack));
// };
// exports.getLastCustomer = getLastCustomer;
